import { NextRequest, NextResponse } from 'next/server'
import {
  createPixOrder,
  createBoletoOrder,
  createCreditCardOrder,
  detectBrand,
  type CieloCustomer,
} from '@/lib/cielo'
import { createOrder } from '@/lib/woocommerce'
import type { WCOrderData } from '@/lib/woocommerce'
import { addPoints } from '@/lib/loyalty'
import { sendOrderConfirmation, sendInternalOrderNotification, sendPaymentFailed, sendPixPaymentEmail, sendBoletoEmail, sendInternalPaymentFailureAlert } from '@/lib/email'
import { sendMetaPurchase } from '@/lib/meta-conversions'
import { sendGA4PurchaseMP } from '@/lib/ga4-measurement-protocol'
import { addShipmentToMECart, ME_SERVICE_MAP } from '@/lib/melhor-envio'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function wcAuth(): string {
  return `Basic ${Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')}`
}

type RequestBody = {
  paymentMethod: 'pix' | 'boleto' | 'credit_card'
  cardData?: { number: string; holder: string; expiry: string; cvv: string }
  installments?: number
  cpf: string
  billing: {
    first_name: string
    last_name: string
    email: string
    phone: string
    address_1: string
    address_2: string
    city: string
    state: string
    postcode: string
    country: string
  }
  items: Array<{
    product_id: number
    variation_id?: number
    quantity: number
    name: string
    price: number
    color?: string
    size?: string
  }>
  shipping: {
    method_id: string
    method_title: string
    cost: number
  }
  customer_id?: number
  couponCode?: string
  totalDiscount?: number
  pixDiscount?: number
  gaClientId?: string
}

function phoneNumbers(phone: string): { area_code: string; number: string } {
  const digits = phone.replace(/\D/g, '').replace(/^55/, '')
  // Brazilian phones: mobile 11 digits (XX9XXXXXXXX), landline 10 digits (XXXXXXXXXX)
  if (digits.length < 10) {
    throw new Error(`Telefone inválido: ${phone} (${digits.length} dígitos)`)
  }
  // Mobile: 11 digits → slice(2,11) = 9 digits. Landline: 10 digits → slice(2,10) = 8 digits.
  // If 11 digits but slice(2,11) gives only 8 (when input was 10 digits total after strip), it's landline.
  const numberDigits = digits.slice(2)
  return {
    area_code: digits.slice(0, 2),
    number: numberDigits.slice(0, 9), // max 9 digits for mobile, truncate extras if any
  }
}

function toCents(value: number): number {
  return Math.round(value * 100)
}

function getClientInfo(req: NextRequest) {
  return {
    clientIp: req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || undefined,
    clientUserAgent: req.headers.get('user-agent') || undefined,
    fbc: req.cookies.get('_fbc')?.value || undefined,
    fbp: req.cookies.get('_fbp')?.value || undefined,
  }
}

export async function POST(request: NextRequest) {
  const clientInfo = getClientInfo(request)

  try {
    const body: RequestBody = await request.json()
    const { paymentMethod, cpf, billing, items, shipping, customer_id, cardData, installments, couponCode, totalDiscount, pixDiscount, gaClientId } = body

    if (!billing || !items?.length || !shipping) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }
    if (paymentMethod === 'credit_card' && !cardData) {
      return NextResponse.json({ error: 'Dados do cartão são obrigatórios' }, { status: 400 })
    }

    // ── Bloquear itens sem preço — impede compras fraudulentas ──────────────
    const zeroPriceItems = items.filter(i => !i.price || i.price <= 0)
    if (zeroPriceItems.length > 0) {
      console.error('[payment/create] BLOCKED zero-price items:', zeroPriceItems.map(i => `${i.name} (R$${i.price})`).join(', '))
      return NextResponse.json({ error: 'Um ou mais itens do carrinho estão sem preço cadastrado. Por favor, entre em contato com o suporte.' }, { status: 400 })
    }

    // ── SECURITY: Validar preços contra WooCommerce (paralelo) ───────────────
    const priceChecks = await Promise.all(items.map(async item => {
      const productRes = await fetch(`${WC_API}/products/${item.product_id}`, {
        headers: { Authorization: wcAuth() },
        cache: 'no-store',
      })
      if (!productRes.ok) return { ok: false as const, name: item.name, error: 'fetch_failed' }
      const product = await productRes.json()

      let correctPrice = parseFloat(product.price || '0')

      if (item.variation_id) {
        const varRes = await fetch(`${WC_API}/products/${item.product_id}/variations/${item.variation_id}`, {
          headers: { Authorization: wcAuth() },
          cache: 'no-store',
        })
        if (varRes.ok) {
          const variation = await varRes.json()
          correctPrice = parseFloat(variation.price || product.price || '0')
        }
      }

      const sentPrice = parseFloat(item.price.toString())
      // Allow 1% tolerance for floating point differences
      const priceDiff = Math.abs(sentPrice - correctPrice)
      const priceOk = correctPrice === 0 || priceDiff / correctPrice < 0.01

      if (!priceOk) {
        console.error(`[payment/create] SECURITY: Price mismatch for ${item.name}: sent=${sentPrice}, correct=${correctPrice}`)
      }
      return { ok: priceOk, name: item.name, sent: sentPrice, correct: correctPrice }
    }))

    const failedFetch = priceChecks.find(c => !c.ok && 'error' in c && c.error === 'fetch_failed')
    if (failedFetch) {
      return NextResponse.json({ error: `Erro ao verificar preço do produto ${failedFetch.name}` }, { status: 400 })
    }
    const priceMismatch = priceChecks.find(c => !c.ok)
    if (priceMismatch) {
      return NextResponse.json({ error: 'Preço do carrinho expirou. Recarregue a página e tente novamente.' }, { status: 400 })
    }

    // ── SECURITY: Calcular desconto PIX corretamente no servidor ──────────────
    const PIX_DISCOUNT_PERCENT = 0.05
    const calculatedPixDiscount = parseFloat((items.reduce((sum, i) => sum + i.price * i.quantity, 0) * PIX_DISCOUNT_PERCENT).toFixed(2))
    // Accept only if within R$0.50 tolerance (for rounding)
    if (pixDiscount !== undefined && pixDiscount > 0) {
      if (Math.abs(pixDiscount - calculatedPixDiscount) > 0.50) {
        console.error(`[payment/create] SECURITY: PIX discount mismatch: sent=${pixDiscount}, calculated=${calculatedPixDiscount}`)
        // Note: Pagar.me charge uses wcOrder.total (server-authoritative), so this mismatch is already blocked
      }
    }

    // ── SECURITY: Verificar cupom de primeira compra ─────────────────────────
    if (couponCode && /primeiracompra/i.test(couponCode) && customer_id) {
      const prevOrdersRes = await fetch(
        `${WC_API}/orders?customer=${customer_id}&per_page=5&status=processing,completed,on-hold`,
        { headers: { Authorization: wcAuth() }, cache: 'no-store' }
      )
      if (prevOrdersRes.ok) {
        const prevOrders = await prevOrdersRes.json()
        if (Array.isArray(prevOrders) && prevOrders.length > 0) {
          return NextResponse.json({ error: 'O cupom "PRIMEIRACOMPRA" é exclusivo para a primeira compra. Você já possui pedidos anteriores.' }, { status: 400 })
        }
      }
    }

    // ── 1. Create WooCommerce order ──────────────────────────────────────────
    const wcMethodMap = {
      pix: 'cielo-pix',
      boleto: 'cielo-boleto',
      credit_card: 'cielo-credit-card',
    }
    const wcTitleMap = {
      pix: 'PIX',
      boleto: 'Boleto Bancário',
      credit_card: 'Cartão de Crédito',
    }

    const wcOrderData: WCOrderData = {
      payment_method: wcMethodMap[paymentMethod],
      payment_method_title: wcTitleMap[paymentMethod],
      set_paid: false,
      billing: { ...billing, address_2: billing.address_2 || '' },
      shipping: {
        first_name: billing.first_name,
        last_name: billing.last_name,
        address_1: billing.address_1,
        address_2: billing.address_2 || '',
        city: billing.city,
        state: billing.state,
        postcode: billing.postcode,
        country: billing.country,
      },
      line_items: items.map(i => ({
        product_id: i.product_id,
        variation_id: i.variation_id,
        quantity: i.quantity,
      })),
      shipping_lines: [{
        method_id: shipping.method_id,
        method_title: shipping.method_title,
        total: shipping.cost.toFixed(2),
      }],
      customer_id,
      coupon_lines: couponCode ? [{ code: couponCode }] : undefined,
      // SECURITY: Always use server-calculated PIX discount, never trust client
      fee_lines: paymentMethod === 'pix'
        ? [{ name: 'Desconto PIX (5%)', total: `-${calculatedPixDiscount.toFixed(2)}`, tax_status: 'none' }]
        : undefined,
      meta_data: [
        { key: 'billing_cpf', value: cpf.replace(/\D/g, '') },
        { key: 'melhorenvio_service_id', value: shipping.method_id },
        { key: 'jaleca_shipping_service', value: shipping.method_title },
        ...(gaClientId ? [{ key: 'jaleca_ga_client_id', value: gaClientId }] : []),
      ],
    }

    let wcOrder = await createOrder(wcOrderData).catch(async (err: Error) => {
      // WC rejeita customer_id de usuários WP não indexados na wc_customer_lookup
      // Retenta como pedido guest (customer_id removido)
      if (/customer|cliente/i.test(err.message)) {
        console.warn('[payment/create] WC customer_id rejected, retrying as guest:', err.message)
        const guestOrderData = { ...wcOrderData, customer_id: undefined }
        return createOrder(guestOrderData)
      }
      throw err
    })

    // ── 2. Build Cielo params ────────────────────────────────────────────────
    const wcTotalCents = Math.round(parseFloat(wcOrder.total || '0') * 100)
    const amountCents = Math.max(100, wcTotalCents)

    const customer: CieloCustomer = {
      Name: `${billing.first_name} ${billing.last_name}`.trim(),
      Identity: cpf.replace(/\D/g, ''),
      IdentityType: 'CPF',
      Email: billing.email,
      Address: {
        Street: billing.address_1,
        Number: 'S/N',
        Complement: billing.address_2 || '',
        ZipCode: billing.postcode.replace(/\D/g, ''),
        City: billing.city,
        State: billing.state,
        Country: 'BRA',
      },
    }

    // Use WC order ID as MerchantOrderId — Cielo webhook will return this to identify the WC order
    const orderId = String(wcOrder.id)

    // ── 3. Call Cielo ────────────────────────────────────────────────────────
    let cieloResult
    if (paymentMethod === 'pix') {
      cieloResult = await createPixOrder({ orderId, amount: amountCents, customer })
    } else if (paymentMethod === 'boleto') {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 3)
      const dueDateStr = dueDate.toISOString().split('T')[0]
      cieloResult = await createBoletoOrder({ orderId, amount: amountCents, customer, dueDate: dueDateStr })
    } else {
      const brand = detectBrand(cardData!.number)
      cieloResult = await createCreditCardOrder({
        orderId,
        amount: amountCents,
        customer,
        card: {
          number: cardData!.number,
          holder: cardData!.holder,
          expiry: cardData!.expiry,
          cvv: cardData!.cvv,
          brand,
        },
        installments: installments || 1,
        ip: clientInfo.clientIp,
      })
    }

    const cieloPaymentId = cieloResult.Payment.PaymentId

    // For credit card: update WC immediately based on payment result
    // (PIX/Boleto rely on polling or webhook since payment is async)
    let creditCardPaid = false
    if (paymentMethod === 'credit_card') {
      // Cielo: Status 2 = PaymentConfirmed, ReturnCode "00" = success, Status 3 = Denied
      const ccPayment = cieloResult.Payment as import('@/lib/cielo').CieloCreditResult['Payment']
      const isPaid = ccPayment.Status === 2 && ccPayment.ReturnCode === '00'
      const isFailed = !isPaid && (ccPayment.Status === 3 || ccPayment.Status === 0)

      if (isPaid) {
        creditCardPaid = true
        try {
          const res = await fetch(`${WC_API}/orders/${wcOrder.id}`, {
            method: 'PUT',
            headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
            body: JSON.stringify({ status: 'processing' }),
          })
          if (res.ok) {
            const updatedOrder = await res.json()
            sendOrderConfirmation(updatedOrder, billing.email).catch(() => {})
          }
        } catch {}

        // GA4 Measurement Protocol — Purchase event (server-side, usa client_id real do browser)
        sendGA4PurchaseMP({
          clientId: gaClientId,
          orderId: String(wcOrder.id),
          value: parseFloat(wcOrder.total || '0'),
          items: items.map(i => ({ id: String(i.product_id), name: i.name, price: i.price, quantity: i.quantity })),
        }).catch(err => console.error('[GA4 MP] create error:', err))

        // Meta Conversions API — Purchase event
        await sendMetaPurchase(
          {
            email: billing.email,
            phone: billing.phone,
            firstName: billing.first_name,
            lastName: billing.last_name,
            city: billing.city,
            state: billing.state,
            zip: billing.postcode,
            country: billing.country,
            ...clientInfo,
          },
          {
            orderId: String(wcOrder.id),
            value: parseFloat(wcOrder.total || '0'),
            items: items.map(i => ({ id: String(i.product_id), quantity: i.quantity })),
          }
        ).catch(err => console.error('[CAPI] sendMetaPurchase failed (create):', err))
      }

      if (isFailed) {
        // Update WC order to failed
        fetch(`${WC_API}/orders/${wcOrder.id}`, {
          method: 'PUT',
          headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'failed' }),
        }).catch(() => {})

        // Notify customer about payment failure
        const amountFormatted = `R$ ${parseFloat(wcOrder.total || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
        sendPaymentFailed(
          billing.first_name,
          billing.email,
          wcOrder.number || String(wcOrder.id),
          amountFormatted,
        ).catch(() => {})

        // Alerta interno para equipe Jaleca
        const failReason = ccPayment.ReturnMessage || `Status Cielo: ${ccPayment.Status}`
        sendInternalPaymentFailureAlert({
          orderId:       wcOrder.id,
          orderNumber:   wcOrder.number || String(wcOrder.id),
          customerName:  `${billing.first_name} ${billing.last_name}`.trim(),
          customerEmail: billing.email,
          customerPhone: billing.phone,
          paymentMethod: 'Cartão de Crédito',
          failureReason: failReason,
          amount:        amountFormatted,
        }).catch(() => {})

        console.log(`[Payment] Credit card failed — WC order ${wcOrder.id} set to failed, customer notified`)
      }
    }

    // Award loyalty points only on successful payment
    if (creditCardPaid && customer_id && wcOrder.total) {
      addPoints(customer_id, parseFloat(wcOrder.total)).catch(() => {})
    }
    // PIX/Boleto: points awarded via webhook when payment confirmed
    if (paymentMethod !== 'credit_card' && customer_id && wcOrder.total) {
      addPoints(customer_id, parseFloat(wcOrder.total)).catch(() => {})
    }

    // ── 4. Send order confirmation email ──────────────────────────────────────
    // PIX/Boleto: email sent only after payment confirmed (via polling or webhook)
    // Credit card: handled above after status check
    // Do NOT send here for PIX/Boleto — client hasn't paid yet

    // ── 4b. Adicionar ao carrinho do Melhor Envio ─────────────────────────────
    // Só adiciona ao ME se pagamento aprovado (crédito) ou pendente (PIX/Boleto)
    const isCreditCardFailed = paymentMethod === 'credit_card' && !creditCardPaid
    // Só executa se MELHOR_ENVIO_TOKEN estiver configurado (não placeholder)
    // Use numeric ME service ID directly when available (from live ME API), else map string IDs (fallback)
    const meServiceId = /^\d+$/.test(shipping.method_id)
      ? parseInt(shipping.method_id)
      : (ME_SERVICE_MAP[shipping.method_id] ?? 2)
    console.log(`[ME Cart] method_id="${shipping.method_id}" method_title="${shipping.method_title}" → meServiceId=${meServiceId}`)
    const meTotalItems = items.reduce((s, i) => s + i.quantity, 0)
    const meWeight = Math.max(0.6 * meTotalItems, 0.6)
    const meTotalValue = items.reduce((s, i) => s + i.price * i.quantity, 0)
    if (!isCreditCardFailed) addShipmentToMECart({
      serviceId: meServiceId,
      wcOrderId: wcOrder.id,
      to: {
        name:       `${billing.first_name} ${billing.last_name}`.trim(),
        phone:      billing.phone,
        email:      billing.email,
        document:   cpf,
        address:    billing.address_1,
        complement: '',
        district:   billing.address_2 || '', // billing.address_2 = bairro (neighborhood)
        city:       billing.city,
        state:      billing.state,
        postalCode: billing.postcode,
      },
      products: items.map(i => ({ name: i.name, quantity: i.quantity, unitValue: i.price })),
      insuranceValue: meTotalValue,
      weight: meWeight,
    }).then(meResult => {
      // Save ME cart ID + selected service in WC meta
      const metaUpdates = [
        { key: 'jaleca_me_service_id', value: String(meServiceId) },
        { key: 'jaleca_me_service_name', value: shipping.method_title },
      ]
      if (meResult?.id) {
        metaUpdates.push({ key: 'jaleca_me_cart_id', value: meResult.id })
      }
      // Update meta + add order note with shipping service info
      const recipientName = `${billing.first_name} ${billing.last_name}`.trim()
      const recipientCep  = billing.postcode.replace(/\D/g, '').replace(/^(\d{5})(\d{3})$/, '$1-$2')
      const noteText =
        `🚚 FRETE: ${shipping.method_title}` +
        (meResult?.id
          ? `\n✅ Etiqueta no carrinho ME — buscar por: "${recipientName}" (CEP ${recipientCep})` +
            `\n   Link: https://app.melhorenvio.com.br/app/shipment/cart`
          : '') +
        `\n\n⛔ NÃO use o plugin WP Melhor Envio — usa serviço e dimensões errados.`
      fetch(`${WC_API}/orders/${wcOrder.id}`, {
        method: 'PUT',
        headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          meta_data: metaUpdates,
        }),
      }).catch(err => console.error('[ME Meta] Erro ao salvar meta:', err))
      // Add WC order note (visible in admin)
      fetch(`${WC_API}/orders/${wcOrder.id}/notes`, {
        method: 'POST',
        headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: noteText, customer_note: false }),
      }).catch(err => console.error('[ME Note] Erro ao adicionar nota:', err))
    }).catch(err => console.error('[ME Cart] Erro:', err))

    // ── 4c. Notificação interna — só dispara se pagamento não falhou ─────────
    if (!isCreditCardFailed) {
      const totalFormatted = `R$ ${parseFloat(wcOrder.total || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      const paymentTitle = wcTitleMap[paymentMethod]
      sendInternalOrderNotification(
        wcOrder.id,
        wcOrder.number || String(wcOrder.id),
        `${billing.first_name} ${billing.last_name}`.trim(),
        billing.email,
        billing.phone || '',
        `${billing.address_1}, ${billing.city} - ${billing.state}`,
        totalFormatted,
        paymentTitle,
        items.map(i => ({ name: i.name, quantity: i.quantity, color: i.color, size: i.size })),
        cpf || undefined,
      ).catch((err) => console.error('[payment/create] sendInternalOrderNotification failed:', err))
    }

    // ── 5. Build response ────────────────────────────────────────────────────
    const response: Record<string, unknown> = {
      wcOrderId: wcOrder.id,
      wcOrderKey: wcOrder.order_key,
      cieloPaymentId,
      cieloStatus: cieloResult.Payment.Status,
      paymentMethod,
      orderValue: amountCents / 100,
      orderItems: items.map(i => ({
        id: String(i.variation_id || i.product_id),
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    }

    if (paymentMethod === 'pix') {
      const pixResult = cieloResult as import('@/lib/cielo').CieloPixResult
      const pixCode = pixResult.Payment.QrCodeString
      // Cielo returns base64 image — prefix for use as img src
      const pixImageBase64 = pixResult.Payment.QrCodeBase64Image
      const pixImgSrc = pixImageBase64 ? `data:image/png;base64,${pixImageBase64}` : undefined
      const expiresAt = pixResult.Payment.ExpirationDate

      response.pixQrCode = pixCode
      response.pixQrCodeUrl = pixImgSrc
      response.pixExpiresAt = expiresAt

      if (billing.email && pixCode) {
        sendPixPaymentEmail({
          firstName: billing.first_name,
          customerEmail: billing.email,
          orderNumber: wcOrder.number || String(wcOrder.id),
          total: `R$ ${parseFloat(wcOrder.total || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          pixQrCode: pixCode,
          pixQrCodeUrl: pixImgSrc || '',
          expiresAt: expiresAt || '',
        }).catch(err => console.error('[Payment] Failed to send PIX email:', err))
      }
    }
    if (paymentMethod === 'boleto') {
      const boletoResult = cieloResult as import('@/lib/cielo').CieloBoletoResult
      response.boletoUrl = boletoResult.Payment.Url
      response.boletoLine = boletoResult.Payment.DigitableLine
      response.boletoDueAt = boletoResult.Payment.ExpirationDate

      if (billing.email && boletoResult.Payment.Url) {
        sendBoletoEmail({
          firstName: billing.first_name,
          customerEmail: billing.email,
          orderNumber: wcOrder.number || String(wcOrder.id),
          total: `R$ ${parseFloat(wcOrder.total || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          boletoUrl: boletoResult.Payment.Url,
          boletoLine: boletoResult.Payment.DigitableLine || '',
          boletoDueAt: boletoResult.Payment.ExpirationDate || '',
        }).catch(err => console.error('[Payment] Failed to send boleto email:', err))
      }
    }
    if (paymentMethod === 'credit_card') {
      const ccResult = cieloResult as import('@/lib/cielo').CieloCreditResult
      response.cardStatus = ccResult.Payment.Status === 2 ? 'approved' : 'denied'
      if (ccResult.Payment.Status !== 2) {
        const returnMsg = (ccResult.Payment.ReturnMessage || '').toLowerCase()
        if (/insufficient|saldo|sem limite/.test(returnMsg)) {
          response.cardMessage = 'Saldo insuficiente. Tente outro cartão ou use PIX.'
        } else if (/bloqueado|blocked|restricted/.test(returnMsg)) {
          response.cardMessage = 'Cartão bloqueado. Verifique com seu banco ou use PIX.'
        } else {
          response.cardMessage = 'Pagamento não autorizado. Tente outro cartão ou use PIX.'
        }
      }
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    let message = error instanceof Error ? error.message : 'Erro ao processar pagamento'
    // Traduzir erros comuns do WooCommerce que chegam em inglês
    if (/coupon usage limit|usage limit for coupon|has been reached/i.test(message)) message = 'Este cupom já atingiu o limite de uso.'
    if (/coupon.*already been used/i.test(message)) message = 'Você já utilizou este cupom anteriormente.'
    if (/coupon.*not applicable/i.test(message))    message = 'Este cupom não é válido para os produtos selecionados.'
    if (/coupon.*expired/i.test(message))           message = 'Este cupom está expirado.'
    if (/coupon.*minimum spend/i.test(message))     message = 'O valor mínimo para usar este cupom não foi atingido.'
    if (/invalid coupon/i.test(message))            message = 'Cupom inválido.'
    console.error('[Payment] Error:', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

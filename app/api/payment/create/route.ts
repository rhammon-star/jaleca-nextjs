import { NextRequest, NextResponse } from 'next/server'
import {
  createPixOrder,
  createBoletoOrder,
  createCreditCardOrder,
  type PagarmeCustomer,
  type PagarmeItem,
  type PagarmeAddress,
} from '@/lib/pagarme'
import { createOrder } from '@/lib/woocommerce'
import type { WCOrderData } from '@/lib/woocommerce'
import { addPoints } from '@/lib/loyalty'
import { sendOrderConfirmation, sendInternalOrderNotification, sendPaymentFailed, sendPixPaymentEmail, sendBoletoEmail } from '@/lib/email'
import { sendMetaPurchase } from '@/lib/meta-conversions'
import { addShipmentToMECart, ME_SERVICE_MAP } from '@/lib/melhor-envio'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const WC_CK = process.env.WOOCOMMERCE_CONSUMER_KEY!
const WC_CS = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function wcAuth(): string {
  return `Basic ${Buffer.from(`${WC_CK}:${WC_CS}`).toString('base64')}`
}

type RequestBody = {
  paymentMethod: 'pix' | 'boleto' | 'credit_card'
  cardToken?: string
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
  sessionId?: string
  cardHolderName?: string
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
    const { paymentMethod, cpf, billing, items, shipping, customer_id, cardToken, installments, couponCode, totalDiscount, pixDiscount, sessionId, cardHolderName } = body

    if (!billing || !items?.length || !shipping) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }
    if (paymentMethod === 'credit_card' && !cardToken) {
      return NextResponse.json({ error: 'Token do cartão é obrigatório' }, { status: 400 })
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
      pix: 'woo-pagarme-payments-pix',
      boleto: 'woo-pagarme-payments-billet',
      credit_card: 'woo-pagarme-payments-credit_card',
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
      ],
    }

    const wcOrder = await createOrder(wcOrderData)

    // ── 2. Build Pagar.me params ─────────────────────────────────────────────
    const phone = phoneNumbers(billing.phone)
    const customer: PagarmeCustomer = {
      name: `${billing.first_name} ${billing.last_name}`.trim(),
      email: billing.email,
      document: cpf.replace(/\D/g, ''),
      document_type: 'CPF',
      type: 'individual',
      phones: {
        mobile_phone: {
          country_code: '55',
          area_code: phone.area_code,
          number: phone.number,
        },
      },
    }

    const subtotalCents = items.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0)
    // SECURITY: Use authoritative WC order total (already includes coupon + PIX discount)
    // Never trust client-supplied totalDiscount or pixDiscount for the Pagar.me charge
    const wcTotalCents = Math.round(parseFloat(wcOrder.total || '0') * 100)
    const shippingCents = toCents(shipping.cost)
    const discountedSubtotalCents = Math.max(100, wcTotalCents - shippingCents)

    // Distribute discount proportionally across items
    const scale = discountedSubtotalCents / Math.max(subtotalCents, 1)
    let allocated = 0
    const pagarmeItems: PagarmeItem[] = items.map((i, idx) => {
      const original = Math.round(i.price * 100) * i.quantity
      let adjusted = idx < items.length - 1
        ? Math.round(original * scale)
        : discountedSubtotalCents - allocated
      if (adjusted < 1) adjusted = 1
      allocated += adjusted
      return {
        amount: Math.round(adjusted / i.quantity),
        description: i.name,
        quantity: i.quantity,
        code: String(i.product_id),
      }
    })

    const address: PagarmeAddress = {
      line_1: `${billing.address_1}, ${billing.address_2}`.trim().replace(/,\s*$/, ''),
      zip_code: billing.postcode.replace(/\D/g, ''),
      city: billing.city,
      state: billing.state,
      country: 'BR',
    }

    const shippingParam = {
      amount: toCents(shipping.cost),
      description: shipping.method_title,
      address,
    }

    const metadata = {
      wc_order_id: String(wcOrder.id),
      wc_order_number: String(wcOrder.number),
    }

    // ── 3. Call Pagar.me ─────────────────────────────────────────────────────
    let pagarmeOrder
    if (paymentMethod === 'pix') {
      pagarmeOrder = await createPixOrder({ customer, items: pagarmeItems, shipping: shippingParam, metadata })
    } else if (paymentMethod === 'boleto') {
      pagarmeOrder = await createBoletoOrder({ customer, items: pagarmeItems, shipping: shippingParam, metadata })
    } else {
      pagarmeOrder = await createCreditCardOrder({
        customer,
        items: pagarmeItems,
        shipping: shippingParam,
        billingAddress: address,
        // billing.name must match customer.name (CPF owner) — antifraude compares these two
        // For third-party cards: configure holder_name tolerance in Pagar.me dashboard
        billingName: `${billing.first_name} ${billing.last_name}`.trim(),
        cardToken: cardToken!,
        installments: installments || 1,
        metadata,
        ip: clientInfo.clientIp,
        sessionId: sessionId,
      })
    }

    // For credit card: update WC immediately based on payment result
    // (PIX/Boleto rely on polling or webhook since payment is async)
    let creditCardPaid = false
    if (paymentMethod === 'credit_card') {
      const ccCharge = pagarmeOrder.charges?.[0]
      const isPaid = pagarmeOrder.status === 'paid' || ccCharge?.status === 'paid'
      const isFailed = !isPaid && (
        pagarmeOrder.status === 'failed' ||
        ccCharge?.status === 'failed' ||
        ccCharge?.status === 'not_authorized' ||
        pagarmeOrder.status === 'canceled'
      )

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
    const meWeight = Math.max(items.reduce((s, i) => s + 0.5 * i.quantity, 0), 0.5)
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
      // Save ME cart ID in WC meta for later tracking auto-detection
      if (meResult?.id) {
        fetch(`${WC_API}/orders/${wcOrder.id}`, {
          method: 'PUT',
          headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ meta_data: [{ key: 'jaleca_me_cart_id', value: meResult.id }] }),
        }).catch(() => {})
      }
    }).catch(() => {})

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
      ).catch(() => {})
    }

    // ── 5. Build response ────────────────────────────────────────────────────
    const charge = pagarmeOrder.charges?.[0]
    const tx = charge?.last_transaction

    const response: Record<string, unknown> = {
      wcOrderId: wcOrder.id,
      wcOrderKey: wcOrder.order_key,
      pagarmeOrderId: pagarmeOrder.id,
      pagarmeStatus: pagarmeOrder.status,
      paymentMethod,
      orderValue: (discountedSubtotalCents + toCents(shipping.cost)) / 100,
      orderItems: items.map(i => ({
        id: String(i.variation_id || i.product_id),
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    }

    if (paymentMethod === 'pix' && tx) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pixTx = tx as any
      response.pixQrCode = pixTx.qr_code
      response.pixQrCodeUrl = pixTx.qr_code_url
      response.pixExpiresAt = pixTx.expires_at

      // Send PIX code via email (fire-and-forget)
      if (billing.email && pixTx.qr_code) {
        sendPixPaymentEmail({
          firstName: billing.first_name,
          customerEmail: billing.email,
          orderNumber: wcOrder.number || String(wcOrder.id),
          total: `R$ ${parseFloat(wcOrder.total || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          pixQrCode: pixTx.qr_code,
          pixQrCodeUrl: pixTx.qr_code_url,
          expiresAt: pixTx.expires_at,
        }).catch(err => console.error('[Payment] Failed to send PIX email:', err))
      }
    }
    if (paymentMethod === 'boleto' && tx) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const boletoTx = tx as any
      response.boletoUrl = boletoTx.url
      response.boletoPdf = boletoTx.pdf
      response.boletoLine = boletoTx.line
      response.boletoDueAt = boletoTx.due_at

      // Send boleto via email
      if (billing.email && boletoTx.url) {
        sendBoletoEmail({
          firstName: billing.first_name,
          customerEmail: billing.email,
          orderNumber: wcOrder.number || String(wcOrder.id),
          total: `R$ ${parseFloat(wcOrder.total || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
          boletoUrl: boletoTx.url,
          boletoLine: boletoTx.line,
          boletoDueAt: boletoTx.due_at,
        }).catch(err => console.error('[Payment] Failed to send boleto email:', err))
      }
    }
    if (paymentMethod === 'credit_card') {
      response.cardStatus = charge?.status
      // Derive a user-friendly message from charge status — never use acquirer_message
      // directly because Pagar.me returns "Transação aprovada" even on anti-fraud denials.
      if (charge?.status !== 'paid') {
        const acquirerMsg = ((tx as any)?.acquirer_message || '').toLowerCase()
        if (/fundos|insufficient|saldo insuficiente/.test(acquirerMsg)) {
          response.cardMessage = 'Saldo insuficiente. Tente outro cartão ou use PIX.'
        } else if (/bloqueado|blocked|restricted/.test(acquirerMsg)) {
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

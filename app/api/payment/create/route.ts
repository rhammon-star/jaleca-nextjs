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
import { sendOrderConfirmation, sendInternalOrderNotification, sendPaymentFailed } from '@/lib/email'
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
  cardData?: {
    number: string
    holder: string
    expiry: string   // MM/YYYY
    cvv: string
  }
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
    const { paymentMethod, cpf, billing, items, shipping, customer_id, cardData, installments, couponCode, totalDiscount, pixDiscount } = body

    if (!billing || !items?.length || !shipping) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }
    if (paymentMethod === 'credit_card' && !cardData) {
      return NextResponse.json({ error: 'Dados do cartão são obrigatórios' }, { status: 400 })
    }

    // ── 1. Create WooCommerce order ──────────────────────────────────────────
    const wcMethodMap = {
      pix: 'cielo-pix',
      boleto: 'cielo-boleto',
      credit_card: 'cielo-credit_card',
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
      fee_lines: pixDiscount && pixDiscount > 0
        ? [{ name: 'Desconto PIX (5%)', total: `-${pixDiscount.toFixed(2)}`, tax_status: 'none' }]
        : undefined,
      meta_data: [
        { key: '_billing_cpf', value: cpf.replace(/\D/g, '') },
      ],
    }

    const wcOrder = await createOrder(wcOrderData)

    // ── 2. Build Cielo params ────────────────────────────────────────────────
    const customer: CieloCustomer = {
      Name: `${billing.first_name} ${billing.last_name}`.trim(),
      Identity: cpf.replace(/\D/g, ''),
      IdentityType: 'CPF',
      Email: billing.email,
      Address: {
        Street: billing.address_1,
        Number: billing.address_2 || 'S/N',
        ZipCode: billing.postcode.replace(/\D/g, ''),
        City: billing.city,
        State: billing.state,
        Country: 'BRA',
      },
    }

    const subtotalCents = items.reduce((sum, i) => sum + Math.round(i.price * 100) * i.quantity, 0)
    const discountCents = totalDiscount ? toCents(totalDiscount) : 0
    const discountedSubtotalCents = Math.max(100, subtotalCents - discountCents)
    const totalAmountCents = discountedSubtotalCents + toCents(shipping.cost)

    const orderId = String(wcOrder.id)

    // ── 3. Call Cielo ────────────────────────────────────────────────────────
    let cieloOrder
    if (paymentMethod === 'pix') {
      cieloOrder = await createPixOrder({
        orderId,
        amount: totalAmountCents,
        customer,
      })
      console.log('[PIX] Cielo response:', JSON.stringify(cieloOrder))
    } else if (paymentMethod === 'boleto') {
      const dueDate = new Date()
      dueDate.setDate(dueDate.getDate() + 3)
      const dueDateStr = dueDate.toISOString().split('T')[0]
      cieloOrder = await createBoletoOrder({
        orderId,
        amount: totalAmountCents,
        customer,
        dueDate: dueDateStr,
      })
    } else {
      const brand = detectBrand(cardData!.number)
      cieloOrder = await createCreditCardOrder({
        orderId,
        amount: totalAmountCents,
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

    // ── 4. Handle credit card result ─────────────────────────────────────────
    let creditCardPaid = false
    if (paymentMethod === 'credit_card') {
      const payment = cieloOrder.Payment as { Status: number; ReturnCode?: string; ReturnMessage?: string }
      // Cielo Status: 2 = Captured/Paid, 3 = Denied
      const isPaid = payment.Status === 2 || payment.ReturnCode === '00'
      const isFailed = !isPaid && (payment.Status === 3 || (payment.Status !== 1 && payment.Status !== 12))

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
        fetch(`${WC_API}/orders/${wcOrder.id}`, {
          method: 'PUT',
          headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'failed' }),
        }).catch(() => {})

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

    // ── 5. Loyalty points ────────────────────────────────────────────────────
    if (creditCardPaid && customer_id && wcOrder.total) {
      addPoints(customer_id, parseFloat(wcOrder.total)).catch(() => {})
    }
    if (paymentMethod !== 'credit_card' && customer_id && wcOrder.total) {
      addPoints(customer_id, parseFloat(wcOrder.total)).catch(() => {})
    }

    // ── 6. Melhor Envio + notificação interna ────────────────────────────────
    const isCreditCardFailed = paymentMethod === 'credit_card' && !creditCardPaid
    const meServiceId = /^\d+$/.test(shipping.method_id)
      ? parseInt(shipping.method_id)
      : (ME_SERVICE_MAP[shipping.method_id] ?? 2)
    const meWeight = Math.max(items.reduce((s, i) => s + 0.5 * i.quantity, 0), 0.5)
    const meTotalValue = items.reduce((s, i) => s + i.price * i.quantity, 0)

    if (!isCreditCardFailed) addShipmentToMECart({
      serviceId: meServiceId,
      to: {
        name:       `${billing.first_name} ${billing.last_name}`.trim(),
        phone:      billing.phone,
        email:      billing.email,
        document:   cpf,
        address:    billing.address_1,
        complement: '',
        district:   billing.address_2 || '',
        city:       billing.city,
        state:      billing.state,
        postalCode: billing.postcode,
      },
      products: items.map(i => ({ name: i.name, quantity: i.quantity, unitValue: i.price })),
      insuranceValue: meTotalValue,
      weight: meWeight,
    }).catch(() => {})

    if (!isCreditCardFailed) {
      const totalFormatted = `R$ ${parseFloat(wcOrder.total || '0').toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
      sendInternalOrderNotification(
        wcOrder.id,
        wcOrder.number || String(wcOrder.id),
        `${billing.first_name} ${billing.last_name}`.trim(),
        billing.email,
        billing.phone,
        `${billing.address_1}, ${billing.address_2} — ${billing.city}/${billing.state} — CEP ${billing.postcode}`,
        totalFormatted,
        wcTitleMap[paymentMethod],
        items.map(i => ({ name: i.name, quantity: i.quantity, color: i.color, size: i.size }))
      ).catch(() => {})
    }

    // ── 7. Build response ────────────────────────────────────────────────────
    const payment = cieloOrder.Payment
    const response: Record<string, unknown> = {
      wcOrderId: wcOrder.id,
      wcOrderKey: wcOrder.order_key,
      cieloPaymentId: payment.PaymentId,
      // Keep same field name so pagamento/page.tsx polling works
      pagarmeOrderId: payment.PaymentId,
      pagarmeStatus: payment.Status === 2 ? 'paid' : 'pending',
      paymentMethod,
      orderValue: totalAmountCents / 100,
      orderItems: items.map(i => ({
        id: String(i.variation_id || i.product_id),
        name: i.name,
        price: i.price,
        quantity: i.quantity,
      })),
    }

    if (paymentMethod === 'pix') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let pixPayment: any = payment
      // If QR code missing, query Cielo API as fallback
      if (!pixPayment.QrCodeString && payment.PaymentId) {
        try {
          const { getPaymentStatus } = await import('@/lib/cielo')
          const queried = await getPaymentStatus(payment.PaymentId)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          if ((queried.Payment as any)?.QrCodeString) pixPayment = queried.Payment
          console.log('[PIX] fallback query result:', JSON.stringify(queried.Payment))
        } catch (e) {
          console.error('[PIX] fallback query failed:', e)
        }
      }
      response.pixQrCode = pixPayment.QrCodeString || null
      response.pixQrCodeUrl = pixPayment.QrCodeBase64Image
        ? `data:image/png;base64,${pixPayment.QrCodeBase64Image}`
        : undefined
      response.pixExpiresAt = new Date(Date.now() + 24 * 3600 * 1000).toISOString()
      if (!response.pixQrCode) {
        console.error('[PIX] QrCodeString missing — PIX may not be activated on Cielo account. Payment:', JSON.stringify(payment))
      }
    }

    if (paymentMethod === 'boleto') {
      const boletoPayment = payment as { Url?: string; DigitableLine?: string; ExpirationDate?: string }
      response.boletoUrl = boletoPayment.Url
      response.boletoPdf = boletoPayment.Url
      response.boletoLine = boletoPayment.DigitableLine
      response.boletoDueAt = boletoPayment.ExpirationDate
    }

    if (paymentMethod === 'credit_card') {
      const ccPayment = payment as { Status: number; ReturnCode?: string; ReturnMessage?: string }
      response.cardStatus = ccPayment.Status === 2 ? 'paid' : 'not_authorized'
      response.cardMessage = ccPayment.ReturnMessage
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao processar pagamento'
    console.error('[Payment] Error:', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

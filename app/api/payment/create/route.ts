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
  }>
  shipping: {
    method_id: string
    method_title: string
    cost: number
  }
  customer_id?: number
}

function phoneNumbers(phone: string): { area_code: string; number: string } {
  const digits = phone.replace(/\D/g, '').replace(/^55/, '')
  return {
    area_code: digits.slice(0, 2),
    number: digits.slice(2, 11),
  }
}

function toCents(value: number): number {
  return Math.round(value * 100)
}

export async function POST(request: NextRequest) {
  try {
    const body: RequestBody = await request.json()
    const { paymentMethod, cpf, billing, items, shipping, customer_id, cardToken, installments } = body

    if (!billing || !items?.length || !shipping) {
      return NextResponse.json({ error: 'Dados incompletos' }, { status: 400 })
    }
    if (paymentMethod === 'credit_card' && !cardToken) {
      return NextResponse.json({ error: 'Token do cartão é obrigatório' }, { status: 400 })
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

    const pagarmeItems: PagarmeItem[] = items.map(i => ({
      amount: toCents(i.price),
      description: i.name,
      quantity: i.quantity,
      code: String(i.product_id),
    }))

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
        billingName: `${billing.first_name} ${billing.last_name}`.trim(),
        cardToken: cardToken!,
        installments: installments || 1,
        metadata,
      })
    }

    // Award loyalty points (fire-and-forget)
    if (customer_id && wcOrder.total) {
      addPoints(customer_id, parseFloat(wcOrder.total)).catch(() => {})
    }

    // ── 4. Build response ────────────────────────────────────────────────────
    const charge = pagarmeOrder.charges?.[0]
    const tx = charge?.last_transaction

    // Log card response details for debugging
    if (paymentMethod === 'credit_card') {
      console.log('[Payment] Pagar.me order status:', pagarmeOrder.status)
      console.log('[Payment] Charge status:', charge?.status)
      console.log('[Payment] Transaction:', JSON.stringify(tx, null, 2))
    }

    const response: Record<string, unknown> = {
      wcOrderId: wcOrder.id,
      wcOrderKey: wcOrder.order_key,
      pagarmeOrderId: pagarmeOrder.id,
      pagarmeStatus: pagarmeOrder.status,
      paymentMethod,
    }

    if (paymentMethod === 'pix' && tx) {
      response.pixQrCode = tx.qr_code
      response.pixQrCodeUrl = tx.qr_code_url
      response.pixExpiresAt = tx.expires_at
    }
    if (paymentMethod === 'boleto' && tx) {
      response.boletoUrl = tx.url
      response.boletoPdf = tx.pdf
      response.boletoLine = tx.line
      response.boletoDueAt = tx.due_at
    }
    if (paymentMethod === 'credit_card') {
      response.cardStatus = charge?.status
      response.cardMessage = tx?.acquirer_message
    }

    return NextResponse.json(response, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao processar pagamento'
    console.error('[Payment] Error:', message)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

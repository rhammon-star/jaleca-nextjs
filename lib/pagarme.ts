/**
 * Pagar.me v5 API client
 */

const PAGARME_API = 'https://api.pagar.me/core/v5'

function authHeader(): string {
  const key = process.env.PAGARME_SECRET_KEY!
  return `Basic ${Buffer.from(`${key}:`).toString('base64')}`
}

async function pagarmeRequest<T>(path: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(`${PAGARME_API}${path}`, {
    method,
    headers: {
      Authorization: authHeader(),
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) {
    throw new Error(data.message || `Pagar.me error ${res.status}`)
  }
  return data as T
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type PagarmeCustomer = {
  name: string
  email: string
  document: string       // CPF sem formatação
  document_type: 'CPF'
  type: 'individual'
  phones: {
    mobile_phone: {
      country_code: '55'
      area_code: string
      number: string
    }
  }
}

export type PagarmeItem = {
  amount: number         // centavos
  description: string
  quantity: number
  code: string
}

export type PagarmeAddress = {
  line_1: string         // "número, rua, bairro"
  zip_code: string
  city: string
  state: string
  country: 'BR'
}

export type PagarmeShipping = {
  amount: number
  description: string
  address: PagarmeAddress
}

export type PagarmePixResult = {
  id: string
  status: string
  charges: Array<{
    id: string
    status: string
    last_transaction: {
      qr_code: string
      qr_code_url: string
      expires_at: string
    }
  }>
}

export type PagarmeBoletoResult = {
  id: string
  status: string
  charges: Array<{
    id: string
    status: string
    last_transaction: {
      url: string
      line: string
      pdf: string
      due_at: string
    }
  }>
}

export type PagarmeCreditCardResult = {
  id: string
  status: string
  charges: Array<{
    id: string
    status: string
    last_transaction: {
      status: string
      acquirer_message: string
    }
  }>
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function createPixOrder(params: {
  customer: PagarmeCustomer
  items: PagarmeItem[]
  shipping: PagarmeShipping
  metadata?: Record<string, string>
}): Promise<PagarmePixResult> {
  return pagarmeRequest('/orders', 'POST', {
    items: params.items,
    customer: params.customer,
    shipping: params.shipping,
    metadata: params.metadata,
    payments: [{
      payment_method: 'pix',
      pix: { expires_in: 86400 }, // 24h
    }],
  })
}

export async function createBoletoOrder(params: {
  customer: PagarmeCustomer
  items: PagarmeItem[]
  shipping: PagarmeShipping
  metadata?: Record<string, string>
}): Promise<PagarmeBoletoResult> {
  const dueDate = new Date()
  dueDate.setDate(dueDate.getDate() + 3)

  return pagarmeRequest('/orders', 'POST', {
    items: params.items,
    customer: params.customer,
    shipping: params.shipping,
    metadata: params.metadata,
    payments: [{
      payment_method: 'boleto',
      boleto: {
        instructions: 'Pagar até o vencimento. Após o vencimento, o pedido será cancelado.',
        due_at: dueDate.toISOString(),
        document_number: Date.now().toString().slice(-8),
      },
    }],
  })
}

export async function createCreditCardOrder(params: {
  customer: PagarmeCustomer
  items: PagarmeItem[]
  shipping: PagarmeShipping
  billingAddress: PagarmeAddress
  billingName: string
  cardToken: string
  installments: number
  metadata?: Record<string, string>
}): Promise<PagarmeCreditCardResult> {
  const body = {
    items: params.items,
    customer: params.customer,
    shipping: params.shipping,
    billing: {
      name: params.billingName,
      address: params.billingAddress,
    },
    metadata: params.metadata,
    payments: [{
      payment_method: 'credit_card',
      credit_card: {
        operation_type: 'auth_and_capture',
        installments: params.installments,
        statement_descriptor: 'JALECA',
        card_token: params.cardToken,
        card: {
          billing_address: params.billingAddress,
        },
      },
    }],
  }
  console.log('[Pagar.me] Credit card order body:', JSON.stringify(body, null, 2))
  return pagarmeRequest('/orders', 'POST', body)
}

export async function getOrder(pagarmeOrderId: string) {
  return pagarmeRequest(`/orders/${pagarmeOrderId}`, 'GET')
}

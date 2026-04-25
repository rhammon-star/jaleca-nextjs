/**
 * Cielo API E-commerce 3.0 client
 */

const CIELO_API = 'https://api.cieloecommerce.cielo.com.br'
const CIELO_QUERY_API = 'https://apiquery.cieloecommerce.cielo.com.br'

function authHeaders(): Record<string, string> {
  return {
    'MerchantId': process.env.CIELO_MERCHANT_ID!,
    'MerchantKey': process.env.CIELO_MERCHANT_KEY!,
    'Content-Type': 'application/json',
  }
}

async function cieloPost<T>(path: string, body: unknown): Promise<T> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 10_000)
  try {
    const res = await fetch(`${CIELO_API}${path}`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(body),
      signal: controller.signal,
    })
    clearTimeout(timeout)
    const data = await res.json()
    if (!res.ok) {
      const msg = Array.isArray(data)
        ? data.map((e: { Message?: string }) => e.Message).filter(Boolean).join(', ')
        : (data.message || `Cielo error ${res.status}`)
      throw new Error(msg || `Cielo error ${res.status}`)
    }
    return data as T
  } catch (e) {
    clearTimeout(timeout)
    if (e instanceof Error && e.name === 'AbortError') {
      throw new Error('Cielo API timeout (10s)')
    }
    throw e
  }
}

// ── Card brand detection ──────────────────────────────────────────────────────

export function detectBrand(cardNumber: string): string {
  const n = cardNumber.replace(/\D/g, '')
  if (/^4/.test(n)) return 'Visa'
  if (/^(5[1-5]|2(2[2-9][1-9]|[3-6]\d{2}|7[01]\d|720))/.test(n)) return 'Master'
  if (/^3[47]/.test(n)) return 'Amex'
  if (/^(606282|3841[046]0|637095|637568|637599|637609|637612)/.test(n)) return 'Hipercard'
  if (/^(4011(78|79)|4312(74|75)|4389(35|36)|4514(16|17|18|19)|4576(31|32)|5041(75|76|77|87)|5067(0[0-9]|[1-9]\d)|509\d|6277(80|81|82|83)|6362(97|98)|6363(68|69)|650[0-9]|6516(52|53)|6550(00|01))/.test(n)) return 'Elo'
  return 'Visa' // fallback
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type CieloCustomer = {
  Name: string
  Identity: string       // CPF sem formatação
  IdentityType: 'CPF'
  Email?: string
  Address?: {
    Street: string
    Number: string
    Complement?: string
    District: string       // Bairro — obrigatório pela Cielo
    ZipCode: string
    City: string
    State: string
    Country: string
  }
}

export type CieloPixResult = {
  MerchantOrderId: string
  Payment: {
    PaymentId: string
    Status: number
    QrCodeBase64Image?: string
    QrCodeString?: string
    ExpirationDate?: string
  }
}

export type CieloBoletoResult = {
  MerchantOrderId: string
  Payment: {
    PaymentId: string
    Status: number
    Url?: string
    BoletoNumber?: string
    BarCodeNumber?: string
    DigitableLine?: string
    ExpirationDate?: string
  }
}

export type CieloCreditResult = {
  MerchantOrderId: string
  Payment: {
    PaymentId: string
    Status: number       // 2 = captured/paid, 3 = denied
    ReturnCode: string   // "00" = success
    ReturnMessage: string
    AuthorizationCode?: string
    Tid?: string
  }
}

export type CieloStatusResult = {
  Payment: {
    PaymentId: string
    Status: number
    ReturnCode?: string
    ReturnMessage?: string
  }
}

// ── API calls ─────────────────────────────────────────────────────────────────

export async function createPixOrder(params: {
  orderId: string
  amount: number   // centavos
  customer: CieloCustomer
}): Promise<CieloPixResult> {
  return cieloPost('/1/sales', {
    MerchantOrderId: params.orderId,
    Customer: params.customer,
    Payment: {
      Type: 'Pix',
      Amount: params.amount,
    },
  })
}

export async function createBoletoOrder(params: {
  orderId: string
  amount: number
  customer: CieloCustomer
  dueDate: string  // YYYY-MM-DD
}): Promise<CieloBoletoResult> {
  return cieloPost('/1/sales', {
    MerchantOrderId: params.orderId,
    Customer: params.customer,
    Payment: {
      Type: 'Boleto',
      Amount: params.amount,
      Provider: 'Bradesco2',
      BoletoNumber: Date.now().toString().slice(-8),
      Assignor: 'JALECA',
      Demonstrative: 'Pagamento Jaleca',
      ExpirationDate: params.dueDate,
      Identification: '30379063000161',
      Instructions: 'Pagar até o vencimento. Após o vencimento o pedido será cancelado.',
    },
  })
}

export async function createCreditCardOrder(params: {
  orderId: string
  amount: number
  customer: CieloCustomer
  card: {
    number: string
    holder: string
    expiry: string   // MM/YYYY
    cvv: string
    brand: string
  }
  installments: number
  ip?: string
}): Promise<CieloCreditResult> {
  const payment: Record<string, unknown> = {
    Type: 'CreditCard',
    Amount: params.amount,
    Installments: params.installments,
    Interest: 'ByMerchant',
    Capture: true,
    Authenticate: false,
    CreditCard: {
      CardNumber: params.card.number.replace(/\D/g, ''),
      Holder: params.card.holder.trim().toUpperCase(),
      ExpirationDate: params.card.expiry,  // MM/YYYY
      SecurityCode: params.card.cvv,
      Brand: params.card.brand,
      SaveCard: false,
    },
  }

  if (params.ip) payment.Ip = params.ip

  return cieloPost('/1/sales', {
    MerchantOrderId: params.orderId,
    Customer: params.customer,
    Payment: payment,
  })
}

export async function getPaymentStatus(paymentId: string): Promise<CieloStatusResult> {
  const res = await fetch(`${CIELO_QUERY_API}/1/sales/${paymentId}`, {
    headers: {
      'MerchantId': process.env.CIELO_MERCHANT_ID!,
      'MerchantKey': process.env.CIELO_MERCHANT_KEY!,
    },
    cache: 'no-store',
  })
  return res.json()
}

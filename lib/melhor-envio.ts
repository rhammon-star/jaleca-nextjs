export type ShippingOption = {
  id: string
  label: string
  cost: number
  delivery_time: string
}

export type TrackingEvent = {
  status: 'posted' | 'in_transit' | 'out_for_delivery' | 'delivered' | 'undelivered' | 'unknown'
  description: string
  date: string
}

export type TrackingResult = {
  meTag: string
  status: TrackingEvent['status']
  events: TrackingEvent[]
  error?: string
}

const JALECA_CEP = '35160294'

// States eligible for free PAC shipping above R$499
const FREE_SHIPPING_STATES = ['SP', 'RJ', 'MG', 'ES']
// Regional fallback table (PAC and SEDEX by zone)
const SUL_SUDESTE = ['SP', 'RJ', 'MG', 'ES', 'PR', 'SC', 'RS']

type ViaCEPResponse = {
  cep: string
  logradouro: string
  bairro: string
  localidade: string
  uf: string
  erro?: boolean
}

// Maps our shipping IDs → Melhor Envio service IDs
// Used to add shipment to ME cart and to label order notes
export const ME_SERVICE_MAP: Record<string, number> = {
  pac:    1,  // PAC Correios
  sedex:  2,  // SEDEX Correios
  jadlog: 3,  // Jadlog Package (ME service ID 3)
  '1':    1,
  '2':    2,
  '3':    3,
  '4':    4,
}

function getFallbackOptions(uf?: string, subtotal = 0): ShippingOption[] {
  const isSulSudeste = uf ? SUL_SUDESTE.includes(uf.toUpperCase()) : false
  const isFreeShipping = uf ? FREE_SHIPPING_STATES.includes(uf.toUpperCase()) && subtotal >= 499 : false

  if (isSulSudeste) {
    return [
      { id: 'pac',    label: 'PAC (Correios)',   cost: isFreeShipping ? 0 : 18.90, delivery_time: 'Entrega rápida'   },
      { id: 'sedex',  label: 'SEDEX (Correios)', cost: 35.90,                      delivery_time: 'Entrega expressa' },
      { id: 'jadlog', label: 'Jadlog',           cost: 22.90,                      delivery_time: 'Entrega rápida'   },
    ]
  }

  return [
    { id: 'pac',    label: 'PAC (Correios)',   cost: 18.90, delivery_time: 'Entrega rápida'   },
    { id: 'sedex',  label: 'SEDEX (Correios)', cost: 39.90, delivery_time: 'Entrega expressa' },
    { id: 'jadlog', label: 'Jadlog',           cost: 26.90, delivery_time: 'Entrega rápida'   },
  ]
}

type MelhorEnvioService = {
  id: number
  name: string
  price: string | null
  custom_price: string | null
  delivery_time: number | null
  error: string | null
}

const API_BASE = process.env.MELHOR_ENVIO_SANDBOX === 'true'
  ? 'https://sandbox.melhorenvio.com.br/api/v2'
  : 'https://melhorenvio.com.br/api/v2'

async function callMelhorEnvioAPI(
  cepDestino: string,
  weight: number,
  items = 1
): Promise<ShippingOption[]> {
  const token = process.env.MELHOR_ENVIO_TOKEN

  if (!token || token === 'PLACEHOLDER') {
    return []
  }

  const res = await fetch(`${API_BASE}/me/shipment/calculate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'User-Agent': 'JalecaApp/1.0 (contato@jaleca.com.br)',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      from: { postal_code: JALECA_CEP },
      to:   { postal_code: cepDestino },
      // Cubagem: 4 × 31 × 41 cm base, +4cm de largura por peça adicional
      products: [{ id: 'jaleco', height: 4, width: Math.min(4 + 4 * (items - 1), 60), length: 41, weight, quantity: items, insurance_value: 0 }],
      services: '1,2,3,4',
      options: { insurance_value: 0, receipt: false, own_hand: false, collect: false },
    }),
  })

  if (!res.ok) {
    throw new Error(`Melhor Envio API error: ${res.status}`)
  }

  const services = (await res.json()) as MelhorEnvioService[]

  const SERVICE_LABELS: Record<number, string> = {
    1: 'PAC (Correios)',
    2: 'SEDEX (Correios)',
    3: 'Jadlog Package',
    4: 'Jadlog .com',
  }

  const options: ShippingOption[] = []

  for (const svc of services) {
    if (svc.error) continue
    const rawPrice = svc.custom_price ?? svc.price
    if (!rawPrice) continue
    const cost = parseFloat(rawPrice)
    if (isNaN(cost) || cost <= 0) continue
    const deliveryDays = svc.delivery_time ?? 7
    options.push({
      id:            String(svc.id),
      label:         SERVICE_LABELS[svc.id] ?? svc.name,
      cost:          cost + 3.50, // R$3,50 taxa operacional (etiqueta + manuseio)
      delivery_time: `${deliveryDays} dia${deliveryDays !== 1 ? 's' : ''} útil${deliveryDays !== 1 ? 'eis' : ''}`,
    })
  }

  return options
}

// ── Rastreamento ──────────────────────────────────────────────────────────────

type METrackingResponse = {
  [meTag: string]: {
    tracking: string
    status: string
    status_code?: string
    steps?: Array<{ status: string; message: string; date: string }>
  }
}

function normalizeStatus(raw: string): TrackingEvent['status'] {
  const s = raw.toLowerCase()
  if (s.includes('postado') || s.includes('posted') || s.includes('coletado')) return 'posted'
  if (s.includes('saiu') || s.includes('out_for_delivery') || s.includes('entrega hoje')) return 'out_for_delivery'
  if (s.includes('entregue') || s.includes('delivered')) return 'delivered'
  if (s.includes('trânsito') || s.includes('transito') || s.includes('in_transit') || s.includes('caminho')) return 'in_transit'
  if (s.includes('tentativa') || s.includes('undelivered') || s.includes('ausente')) return 'undelivered'
  return 'unknown'
}

export async function trackShipments(meTags: string[]): Promise<TrackingResult[]> {
  const token = process.env.MELHOR_ENVIO_TOKEN
  if (!token || token === 'PLACEHOLDER' || meTags.length === 0) return []

  try {
    const res = await fetch(`${API_BASE}/me/shipment/tracking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent': 'JalecaApp/1.0 (contato@jaleca.com.br)',
        'Accept': 'application/json',
      },
      body: JSON.stringify({ orders: meTags }),
    })

    if (!res.ok) {
      console.error('[ME Tracking] API error:', res.status)
      return meTags.map(tag => ({ meTag: tag, status: 'unknown' as const, events: [], error: `HTTP ${res.status}` }))
    }

    const data = (await res.json()) as METrackingResponse
    return meTags.map(tag => {
      const info = data[tag]
      if (!info) return { meTag: tag, status: 'unknown' as const, events: [] }
      const status = normalizeStatus(info.status ?? '')
      const events: TrackingEvent[] = (info.steps ?? []).map(s => ({
        status: normalizeStatus(s.status),
        description: s.message,
        date: s.date,
      }))
      return { meTag: tag, status, events }
    })
  } catch (err) {
    console.error('[ME Tracking] fetch error:', err)
    return meTags.map(tag => ({ meTag: tag, status: 'unknown' as const, events: [], error: String(err) }))
  }
}

export async function calculateShipping(
  cepDestino: string,
  weight: number,
  items: number,
  subtotal = 0
): Promise<ShippingOption[]> {
  const cleanCep = cepDestino.replace(/\D/g, '')
  const totalWeight = Math.max(weight * items, 0.5)

  // Try real API first
  try {
    const token = process.env.MELHOR_ENVIO_TOKEN
    if (token && token !== 'PLACEHOLDER') {
      const options = await callMelhorEnvioAPI(cleanCep, totalWeight, items)
      // Only use API result if it returned at least 2 services (PAC + SEDEX or more)
      if (options.length >= 2) {
        // Apply free shipping for PAC if eligible
        const ufRes = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`).catch(() => null)
        if (ufRes?.ok) {
          const cepData = (await ufRes.json()) as ViaCEPResponse
          if (!cepData.erro && FREE_SHIPPING_STATES.includes(cepData.uf?.toUpperCase()) && subtotal >= 499) {
            return options.map(o => o.id === '1' ? { ...o, cost: 0 } : o)
          }
        }
        return options
      }
    }
  } catch {
    // Fall through to regional fallback
  }

  // Fallback: determine UF from ViaCEP
  try {
    const viaCepRes = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
    if (viaCepRes.ok) {
      const cepData = (await viaCepRes.json()) as ViaCEPResponse
      if (!cepData.erro) {
        return getFallbackOptions(cepData.uf, subtotal)
      }
    }
  } catch {
    // ignore
  }

  return getFallbackOptions(undefined, subtotal)
}

// ── Adicionar envio ao carrinho do Melhor Envio ───────────────────────────────

export type MEShipmentPayload = {
  serviceId: number          // 1=PAC, 2=SEDEX, 3=Jadlog Package, 4=Jadlog .com
  to: {
    name: string
    phone: string
    email: string
    document: string         // CPF do cliente
    address: string
    complement?: string
    district?: string
    city: string
    state: string
    postalCode: string
  }
  products: Array<{
    name: string
    quantity: number
    unitValue: number        // valor unitário em reais
  }>
  insuranceValue: number     // valor declarado total
  weight: number             // peso total em kg
}

export async function addShipmentToMECart(payload: MEShipmentPayload): Promise<{ id: string } | null> {
  const token = process.env.MELHOR_ENVIO_TOKEN
  if (!token || token === 'PLACEHOLDER') return null

  const itemCount = payload.products.reduce((s, p) => s + p.quantity, 0)
  const body = {
    service: payload.serviceId,
    from: {
      name:        'Jaleca',
      phone:       '3134461777',
      email:       'contato@jaleca.com.br',
      document:    '30379063000161',   // CNPJ Jaleca
      address:     'Rua Coronel Joao Pessoa, 408',
      complement:  'Loja',
      district:    'Centro',
      city:        'Ipatinga',
      state_abbr:  'MG',
      country_id:  'BR',
      postal_code: JALECA_CEP,
    },
    to: {
      name:        payload.to.name,
      phone:       payload.to.phone.replace(/\D/g, ''),
      email:       payload.to.email,
      document:    payload.to.document.replace(/\D/g, ''),
      address:     payload.to.address,
      complement:  payload.to.complement || '',
      district:    payload.to.district || '',
      city:        payload.to.city,
      state_abbr:  payload.to.state,
      country_id:  'BR',
      postal_code: payload.to.postalCode.replace(/\D/g, ''),
    },
    products: payload.products.map(p => ({
      name:           p.name,
      quantity:       p.quantity,
      unitary_value:  p.unitValue,
    })),
    volumes: [{
      height: 4,
      width:  Math.min(4 + 4 * (itemCount - 1), 60),
      length: 41,
      weight: payload.weight,
    }],
    options: {
      insurance_value: payload.insuranceValue,
      receipt:         false,
      own_hand:        false,
      reverse:         false,
      non_commercial:  false,
    },
  }

  try {
    const res = await fetch(`${API_BASE}/me/cart`, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${token}`,
        'User-Agent':    'JalecaApp/1.0 (contato@jaleca.com.br)',
        'Accept':        'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('[ME Cart] Erro ao adicionar envio:', res.status, err)
      return null
    }

    const data = (await res.json()) as { id: string }
    console.log(`[ME Cart] Envio adicionado ao carrinho: ${data.id}`)
    return data
  } catch (err) {
    console.error('[ME Cart] Falha:', err)
    return null
  }
}

import { NextRequest, NextResponse } from 'next/server'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const key = process.env.WOOCOMMERCE_CONSUMER_KEY!
const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET!

function wcHeaders() {
  return { Authorization: `Basic ${Buffer.from(`${key}:${secret}`).toString('base64')}` }
}

type WCCustomer = {
  id: number
  billing?: { cpf?: string }
  meta_data?: Array<{ key: string; value: string }>
}

function matchesCpf(c: WCCustomer, cpf: string): boolean {
  const native = c.billing?.cpf?.replace(/\D/g, '')
  const meta = c.meta_data?.find(m => m.key === 'billing_cpf')?.value?.replace(/\D/g, '')
  return native === cpf || meta === cpf
}

async function fetchAllCustomers(): Promise<WCCustomer[]> {
  const all: WCCustomer[] = []
  let page = 1
  const deadline = Date.now() + 2500 // 2.5s max
  while (Date.now() < deadline) {
    const res = await fetch(
      `${WC_API}/customers?role=all&per_page=100&page=${page}`,
      { headers: wcHeaders(), cache: 'no-store' }
    )
    if (!res.ok) break
    const batch = await res.json()
    if (!Array.isArray(batch) || batch.length === 0) break
    all.push(...batch)
    if (batch.length < 100) break // last page
    page++
  }
  return all
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const cpf = searchParams.get('cpf')?.replace(/\D/g, '')
  if (!cpf || cpf.length !== 11) {
    return NextResponse.json({ found: false })
  }

  try {
    // Fast path: WooCommerce native search by CPF
    const searchRes = await fetch(
      `${WC_API}/customers?role=all&per_page=10&search=${cpf}`,
      { headers: wcHeaders(), cache: 'no-store' }
    )
    if (searchRes.ok) {
      const results = await searchRes.json() as WCCustomer[]
      if (Array.isArray(results)) {
        const match = results.find(c => matchesCpf(c, cpf))
        if (match) return NextResponse.json({ found: true, id: match.id })
      }
    }

    // Slow path: paginate all customers (handles meta_data not indexed by WC search)
    const all = await fetchAllCustomers()
    const match = all.find(c => matchesCpf(c, cpf))
    if (match) return NextResponse.json({ found: true, id: match.id })

    return NextResponse.json({ found: false })
  } catch {
    return NextResponse.json({ found: false })
  }
}

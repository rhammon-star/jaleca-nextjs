import { NextRequest, NextResponse } from 'next/server'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const key = process.env.WOOCOMMERCE_CONSUMER_KEY!
const secret = process.env.WOOCOMMERCE_CONSUMER_SECRET!
const WP_URL = process.env.NEXT_PUBLIC_WP_URL || 'https://wp.jaleca.com.br'
const PLUGIN_SECRET = process.env.JALECA_PLUGIN_SECRET || 'jaleca-register-secret-2026'

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
    // ── Path 1: Jaleca Plugin (busca por user_meta — funciona para clientes WP) ──
    try {
      const pluginRes = await fetch(
        `${WP_URL}/wp-json/jaleca/v1/lookup-cpf?cpf=${cpf}&secret=${PLUGIN_SECRET}`,
        { cache: 'no-store' }
      )
      if (pluginRes.ok) {
        const data = await pluginRes.json()
        if (data.found && data.id) {
          console.log(`[cpf-lookup] Found via plugin: customer ${data.id}`)
          return NextResponse.json({ found: true, id: data.id })
        }
      }
    } catch {
      // plugin não disponível — continua para WC API
    }

    // ── Path 2: WooCommerce REST API (fast search) ───────────────────────────
    const searchRes = await fetch(
      `${WC_API}/customers?role=all&per_page=10&search=${cpf}`,
      { headers: wcHeaders(), cache: 'no-store' }
    )
    if (searchRes.ok) {
      const results = await searchRes.json() as WCCustomer[]
      if (Array.isArray(results)) {
        const match = results.find(c => matchesCpf(c, cpf))
        if (match) {
          console.log(`[cpf-lookup] Found via WC search: customer ${match.id}`)
          return NextResponse.json({ found: true, id: match.id })
        }
      }
    }

    // ── Path 3: WooCommerce REST API (paginate all) ──────────────────────────
    const all = await fetchAllCustomers()
    const match = all.find(c => matchesCpf(c, cpf))
    if (match) {
      console.log(`[cpf-lookup] Found via WC full scan: customer ${match.id}`)
      return NextResponse.json({ found: true, id: match.id })
    }

    return NextResponse.json({ found: false })
  } catch {
    return NextResponse.json({ found: false })
  }
}

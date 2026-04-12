import { NextRequest, NextResponse } from 'next/server'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const WP_URL = process.env.NEXT_PUBLIC_WP_URL || 'https://wp.jaleca.com.br'
const PLUGIN_SECRET = process.env.JALECA_PLUGIN_SECRET || 'jaleca-register-secret-2026'

const wcAuth = () =>
  'Basic ' + Buffer.from(`${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`).toString('base64')

// ── Jaleca Plugin helpers ────────────────────────────────────────────────────

async function getTokenViaPlugin(customerId: number): Promise<{ token: string; expires: string } | null> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/jaleca/v1/get-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: PLUGIN_SECRET, customer_id: customerId }),
    })
    if (!res.ok) return null
    const data = await res.json()
    return { token: data.email_verify_token || '', expires: data.email_verify_expires || '' }
  } catch {
    return null
  }
}

async function changePasswordViaPlugin(customerId: number, password: string): Promise<boolean> {
  try {
    const res = await fetch(`${WP_URL}/wp-json/jaleca/v1/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: PLUGIN_SECRET, customer_id: customerId, password }),
    })
    return res.ok
  } catch {
    return false
  }
}

async function clearTokenViaPlugin(customerId: number): Promise<void> {
  try {
    await fetch(`${WP_URL}/wp-json/jaleca/v1/clear-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret: PLUGIN_SECRET, customer_id: customerId }),
    })
  } catch {}
}

// ── Main handler ─────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const { login, resetKey, password, customerId } = await request.json()

    if (!login || !resetKey || !password) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 })
    }
    if (password.length < 6) {
      return NextResponse.json({ error: 'A senha deve ter no mínimo 6 caracteres.' }, { status: 400 })
    }

    const cleanToken = resetKey.trim()

    // ── Path 1: Jaleca Plugin (works for all WP users — preferred) ─────────────
    if (customerId) {
      const pluginData = await getTokenViaPlugin(Number(customerId))
      console.log(`[reset-password] Plugin lookup for customer ${customerId}: token=${pluginData?.token?.substring(0, 8) ?? 'null'}`)

      if (pluginData && pluginData.token && pluginData.token.trim() === cleanToken) {
        if (pluginData.expires && Date.now() > parseInt(pluginData.expires)) {
          console.log(`[reset-password] Token expired (plugin). Stored=${pluginData.expires}, Now=${Date.now()}`)
          return NextResponse.json({ error: 'Este link expirou. Solicite um novo.' }, { status: 400 })
        }

        // Try WC API password update first (works for WC customers)
        const wcRes = await fetch(`${WC_API}/customers/${customerId}`, {
          method: 'PUT',
          headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ password }),
        })

        let passwordChanged = wcRes.ok
        if (!passwordChanged) {
          // WP-only customer: use plugin change-password endpoint
          console.log(`[reset-password] WC password update failed (${wcRes.status}), trying plugin for customer ${customerId}`)
          passwordChanged = await changePasswordViaPlugin(Number(customerId), password)
        }

        if (!passwordChanged) {
          return NextResponse.json({ error: 'Erro ao definir senha' }, { status: 500 })
        }

        // Clear token (best effort on both systems)
        await clearTokenViaPlugin(Number(customerId))
        fetch(`${WC_API}/customers/${customerId}`, {
          method: 'PUT',
          headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
          body: JSON.stringify({ meta_data: [
            { key: 'email_verify_token', value: '' },
            { key: 'email_verify_expires', value: '' },
            { key: 'email_verified', value: '1' },
          ]}),
        }).catch(() => {})

        console.log(`[reset-password] Success via plugin for customer ${customerId}`)
        return NextResponse.json({ success: true })
      }
    }

    // ── Path 2: WC API fallback (for tokens saved before plugin was deployed) ──
    type WCCustomer = { id: number; meta_data?: Array<{ key: string; value: string }> }
    let customers: WCCustomer[] = []

    if (customerId) {
      const singleRes = await fetch(`${WC_API}/customers/${customerId}`, {
        headers: { Authorization: wcAuth() }, cache: 'no-store'
      })
      if (singleRes.ok) {
        customers = [await singleRes.json()]
        console.log(`[reset-password] WC direct lookup customer ${customerId}: found`)
      }
    }

    if (customers.length === 0) {
      const searchRes = await fetch(
        `${WC_API}/customers?email=${encodeURIComponent(login)}&role=all&per_page=20`,
        { headers: { Authorization: wcAuth() }, cache: 'no-store' }
      )
      if (searchRes.ok) {
        customers = await searchRes.json()
        console.log(`[reset-password] WC email search ${login}: found ${customers.length}`)
      }
    }

    for (const c of customers) {
      const meta = c.meta_data || []
      const tokenEntry = meta.find(m => m.key === 'email_verify_token' && m.value.trim() === cleanToken)
      if (!tokenEntry) continue

      const expiresEntry = meta.find(m => m.key === 'email_verify_expires')
      if (expiresEntry?.value && Date.now() > parseInt(expiresEntry.value)) {
        return NextResponse.json({ error: 'Este link expirou. Solicite um novo.' }, { status: 400 })
      }

      const updateRes = await fetch(`${WC_API}/customers/${c.id}`, {
        method: 'PUT',
        headers: { Authorization: wcAuth(), 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password,
          meta_data: [
            { key: 'email_verify_token', value: '' },
            { key: 'email_verify_expires', value: '' },
            { key: 'email_verified', value: '1' },
          ],
        }),
      })

      if (!updateRes.ok) {
        return NextResponse.json({ error: 'Erro ao definir senha' }, { status: 500 })
      }

      console.log(`[reset-password] Success via WC for customer ${c.id}`)
      return NextResponse.json({ success: true })
    }

    console.log(`[reset-password] No matching token found for login=${login}, customerId=${customerId}`)
    return NextResponse.json({ error: 'Link inválido ou expirado' }, { status: 400 })
  } catch {
    return NextResponse.json({ error: 'Erro ao redefinir senha' }, { status: 500 })
  }
}

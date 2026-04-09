import { NextRequest, NextResponse } from 'next/server'
import { loginCustomer } from '@/lib/woocommerce'
import { validateCPF, cleanCPF } from '@/lib/cpf'
import { sendEmailVerification } from '@/lib/email'
import crypto from 'crypto'

const WC_API = process.env.WOOCOMMERCE_API_URL!
const auth = Buffer.from(
  `${process.env.WOOCOMMERCE_CONSUMER_KEY}:${process.env.WOOCOMMERCE_CONSUMER_SECRET}`
).toString('base64')

const WP_URL = process.env.NEXT_PUBLIC_WP_URL || 'https://wp.jaleca.com.br'
const REGISTER_SECRET = process.env.JALECA_REGISTER_SECRET || 'jaleca-register-secret-2026'

async function sendVerificationEmail(customerId: number, email: string) {
  const token = crypto.randomBytes(32).toString('hex')
  const expires = String(Date.now() + 48 * 60 * 60 * 1000)

  await fetch(`${WC_API}/customers/${customerId}`, {
    method: 'PUT',
    headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      meta_data: [
        { key: 'email_verify_token', value: token },
        { key: 'email_verify_expires', value: expires },
        { key: 'email_verified', value: '0' },
      ],
    }),
  }).catch(() => {})

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://jaleca.com.br'
  const link = `${siteUrl}/api/auth/verify-email?token=${token}&id=${customerId}`
  await sendEmailVerification(link, email)
}

async function cpfAlreadyExists(cpf: string): Promise<boolean> {
  try {
    const res = await fetch(
      `${WC_API}/customers?meta_key=billing_cpf&meta_value=${cpf}&per_page=10&role=all`,
      { headers: { Authorization: `Basic ${auth}` }, cache: 'no-store' }
    )
    if (!res.ok) return false
    const customers = await res.json()
    if (!Array.isArray(customers) || customers.length === 0) return false
    return customers.some((c: { meta_data?: Array<{ key: string; value: string }> }) =>
      c.meta_data?.some(m => m.key === 'billing_cpf' && m.value === cpf)
    )
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, cpf, phone, birthdate, gender } = await request.json()

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Nome, email e senha são obrigatórios' }, { status: 400 })
    }

    if (!cpf) {
      return NextResponse.json({ error: 'CPF é obrigatório' }, { status: 400 })
    }
    const cleanedCPF = cleanCPF(cpf)
    if (!validateCPF(cleanedCPF)) {
      return NextResponse.json({ error: 'CPF inválido' }, { status: 400 })
    }

    const cpfExists = await cpfAlreadyExists(cleanedCPF)
    if (cpfExists) {
      return NextResponse.json({ error: 'Já existe uma conta cadastrada com este CPF' }, { status: 409 })
    }

    const [first_name, ...rest] = name.trim().split(' ')
    const last_name = rest.join(' ')

    // Cria usuário via endpoint customizado do WordPress (bypassa permissões WC REST API)
    const wpRes = await fetch(`${WP_URL}/wp-json/jaleca/v1/create-customer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Jaleca-Secret': REGISTER_SECRET,
      },
      body: JSON.stringify({
        email,
        password,
        first_name,
        last_name,
        cpf: cleanedCPF,
        phone: phone || '',
      }),
    })

    const wpData = await wpRes.json()

    if (!wpRes.ok) {
      const msg = wpData?.message || wpData?.data?.status || 'Erro ao criar conta'
      if (wpRes.status === 409 || (wpData?.code === 'email_exists')) {
        return NextResponse.json({ error: 'Este email já está cadastrado' }, { status: 409 })
      }
      return NextResponse.json({ error: msg }, { status: 400 })
    }

    const customerId = wpData.id

    // Salva campos extras WC (birthdate, gender) se informados
    if ((birthdate || gender) && customerId) {
      const meta_data: Array<{ key: string; value: string }> = [
        { key: 'billing_cpf', value: cleanedCPF },
        { key: 'billing_persontype', value: '1' },
      ]
      if (birthdate) meta_data.push({ key: 'billing_birthdate', value: birthdate })
      if (gender) meta_data.push({ key: 'billing_sex', value: gender })

      await fetch(`${WC_API}/customers/${customerId}`, {
        method: 'PUT',
        headers: { Authorization: `Basic ${auth}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ meta_data }),
      }).catch(() => {})
    }

    // Email de verificação (fire-and-forget)
    if (customerId) {
      sendVerificationEmail(customerId, email).catch(err =>
        console.error('[Register] Failed to send verification email:', err)
      )
    }

    // Auto-login
    let token = ''
    try {
      const jwtData = await loginCustomer(email, password)
      token = jwtData.token
    } catch {
      // Not critical
    }

    return NextResponse.json({
      user: {
        id: customerId,
        name: wpData.name || name,
        email,
        token,
      },
    }, { status: 201 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao criar conta'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

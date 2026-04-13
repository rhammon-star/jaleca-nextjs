import { NextRequest, NextResponse } from 'next/server'
import { getCustomer, updateCustomer } from '@/lib/woocommerce'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Require authentication
    const auth = requireAuth(request)
    if (auth instanceof NextResponse) return auth

    // SECURITY: User can only access their own profile (userId param ignored)
    const customer = await getCustomer(auth.id)
    return NextResponse.json({ customer })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao buscar perfil'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // SECURITY: Require authentication
    const auth = requireAuth(request)
    if (auth instanceof NextResponse) return auth

    const body = await request.json()
    // SECURITY: Ignore userId from body — use authenticated user's ID
    const { userId: _ignoredUserId, name, email, password, phone, billing, shipping, birthdate, gender } = body

    const updateData: Record<string, unknown> = {}
    if (name) {
      const [first_name, ...rest] = name.trim().split(' ')
      updateData.first_name = first_name
      updateData.last_name = rest.join(' ')
    }
    if (email) updateData.email = email
    if (password) updateData.password = password
    if (phone) updateData.billing = { ...(billing || {}), phone }
    if (billing) updateData.billing = { ...(updateData.billing as object || {}), ...billing }
    if (shipping) updateData.shipping = shipping
    if (birthdate || gender) {
      const metaUpdates: Array<{ key: string; value: string }> = []
      if (birthdate) metaUpdates.push({ key: 'billing_birthdate', value: birthdate })
      if (gender) metaUpdates.push({ key: 'billing_sex', value: gender })
      updateData.meta_data = metaUpdates
    }

    // SECURITY: Always update the authenticated user's profile, not any other
    const customer = await updateCustomer(auth.id, updateData)

    return NextResponse.json({
      user: {
        id: customer.id,
        name: `${customer.first_name} ${customer.last_name}`.trim(),
        email: customer.email,
      },
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro ao atualizar perfil'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { getPoints, addPoints, redeemPoints } from '@/lib/loyalty'
import { requireAuth } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // SECURITY: Require authentication
    const auth = requireAuth(request)
    if (auth instanceof NextResponse) return auth

    // SECURITY: User can only access their own points
    const points = await getPoints(String(auth.id))
    return NextResponse.json({ customerId: auth.id, points })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // SECURITY: Require authentication
    const auth = requireAuth(request)
    if (auth instanceof NextResponse) return auth

    const body = (await request.json()) as {
      customerId?: string | number
      action?: 'add' | 'redeem'
      points?: number
      amount?: number // for 'add' by purchase amount in BRL
    }

    // SECURITY: Ignore customerId from body — use authenticated user's ID
    // Only INTERNAL calls (from the server itself) should be able to specify customerId
    // For now, we require customerId to match auth.id OR be empty (internal call)
    const { customerId, action, points, amount } = body

    // If customerId is provided in body, it must match the authenticated user
    if (customerId !== undefined && Number(customerId) !== auth.id) {
      console.error(`[loyalty] IDOR attempt: auth.id=${auth.id} tried to act on customerId=${customerId}`)
      return NextResponse.json({ error: 'Acesso negado' }, { status: 403 })
    }

    if (!action) {
      return NextResponse.json({ error: 'action é obrigatória' }, { status: 400 })
    }

    // SECURITY: All operations use the authenticated user's ID
    const effectiveCustomerId = auth.id

    if (action === 'add') {
      // 'add' is typically called internally (after purchase), so if called from client,
      // require that customerId matches auth
      const amountToAdd = amount ?? points ?? 0
      const newTotal = await addPoints(effectiveCustomerId, amountToAdd)
      return NextResponse.json({ ok: true, points: newTotal })
    }

    if (action === 'redeem') {
      if (!points || points <= 0) {
        return NextResponse.json({ error: 'Informe a quantidade de pontos' }, { status: 400 })
      }
      const result = await redeemPoints(effectiveCustomerId, points)
      if (!result.ok) {
        return NextResponse.json({ error: result.error }, { status: 400 })
      }
      return NextResponse.json(result)
    }

    return NextResponse.json({ error: 'action inválida' }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Erro interno'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

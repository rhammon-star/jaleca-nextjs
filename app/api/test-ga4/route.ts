import { NextResponse } from 'next/server'
import { sendGA4PurchaseMP } from '@/lib/ga4-measurement-protocol'

export async function GET() {
  const MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA4_ID
  const API_SECRET = process.env.GA4_MEASUREMENT_PROTOCOL_SECRET

  console.log('[TEST] MEASUREMENT_ID:', MEASUREMENT_ID ? '✅ EXISTS' : '❌ MISSING')
  console.log('[TEST] API_SECRET:', API_SECRET ? `✅ EXISTS (${API_SECRET.substring(0, 8)}...)` : '❌ MISSING')

  // Teste de envio
  try {
    await sendGA4PurchaseMP({
      clientId: 'TEST.123456789',
      orderId: 'TEST-' + Date.now(),
      value: 99.99,
      email: 'test@jaleca.com.br',
      items: [{ id: '1', name: 'Teste', price: 99.99, quantity: 1 }],
    })

    return NextResponse.json({
      success: true,
      measurement_id: MEASUREMENT_ID,
      api_secret_configured: !!API_SECRET,
      message: 'Evento de teste enviado. Verifique logs para confirmar.'
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      measurement_id: MEASUREMENT_ID,
      api_secret_configured: !!API_SECRET,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}

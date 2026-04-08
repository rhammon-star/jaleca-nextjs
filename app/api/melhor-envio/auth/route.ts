import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.MELHOR_ENVIO_CLIENT_ID
  if (!clientId) {
    return NextResponse.json({ error: 'MELHOR_ENVIO_CLIENT_ID not set' }, { status: 500 })
  }

  const isSandbox = process.env.MELHOR_ENVIO_SANDBOX === 'true'
  const baseUrl = isSandbox
    ? 'https://sandbox.melhorenvio.com.br'
    : 'https://melhorenvio.com.br'

  const redirectUri = 'https://jaleca.com.br/api/melhor-envio/callback'

  const scopes = [
    'cart-read',
    'cart-write',
    'companies-read',
    'companies-write',
    'coupons-read',
    'coupons-write',
    'notifications-read',
    'orders-read',
    'products-read',
    'products-write',
    'purchases-read',
    'shipping-calculate',
    'shipping-cancel',
    'shipping-checkout',
    'shipping-companies',
    'shipping-generate',
    'shipping-preview',
    'shipping-print',
    'shipping-share',
    'shipping-tracking',
    'ecommerce-shipping',
    'transactions-read',
    'users-read',
    'users-write',
  ].join(' ')

  const authUrl = `${baseUrl}/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scopes)}`

  return NextResponse.redirect(authUrl)
}

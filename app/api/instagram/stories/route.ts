import { NextResponse } from 'next/server'

export const revalidate = 900 // cache 15min (stories expiram em 24h)

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const igId = process.env.INSTAGRAM_BUSINESS_ID

  if (!token || !igId) {
    return NextResponse.json({ error: 'Missing Instagram credentials' }, { status: 500 })
  }

  const url = `https://graph.facebook.com/v25.0/${igId}/stories?fields=id,media_type,media_url,thumbnail_url,timestamp&access_token=${token}`

  const res = await fetch(url, { next: { revalidate: 900 } })
  const data = await res.json()

  if (data.error) {
    return NextResponse.json({ error: data.error.message }, { status: 400 })
  }

  return NextResponse.json({ stories: data.data ?? [] })
}

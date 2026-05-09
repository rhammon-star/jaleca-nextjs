import { NextResponse } from 'next/server'

export const revalidate = 3600

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const igId = process.env.INSTAGRAM_BUSINESS_ID

  if (!token || !igId) {
    return NextResponse.json({ error: 'Missing Instagram credentials' }, { status: 500 })
  }

  const url = `https://graph.facebook.com/v25.0/${igId}/tags?fields=id,media_type,media_url,thumbnail_url,permalink,timestamp&limit=20&access_token=${token}`

  const res = await fetch(url, { next: { revalidate: 3600 } })
  const data = await res.json()

  if (data.error) {
    return NextResponse.json({ error: data.error.message }, { status: 400 })
  }

  return NextResponse.json({ posts: data.data ?? [] })
}

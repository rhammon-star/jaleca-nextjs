import { NextResponse } from 'next/server'

export const revalidate = 3600 // cache 1h

export async function GET() {
  const token = process.env.INSTAGRAM_ACCESS_TOKEN
  const igId = process.env.INSTAGRAM_BUSINESS_ID

  if (!token || !igId) {
    return NextResponse.json({ error: 'Missing Instagram credentials' }, { status: 500 })
  }

  const url = `https://graph.instagram.com/v19.0/${igId}/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${token}`

  const res = await fetch(url, { next: { revalidate: 3600 } })
  const data = await res.json()

  if (data.error) {
    return NextResponse.json({ error: data.error.message }, { status: 400 })
  }

  // Only return IMAGE posts (skip videos for the gallery)
  const posts = (data.data ?? []).filter(
    (p: { media_type: string }) => p.media_type === 'IMAGE' || p.media_type === 'CAROUSEL_ALBUM'
  )

  return NextResponse.json({ posts })
}

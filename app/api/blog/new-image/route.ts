import { NextRequest, NextResponse } from 'next/server'
import { generateImageQuery } from '@/lib/ai-content'
import { searchImage } from '@/lib/unsplash'
import { verifyBlogToken } from '@/lib/blog-auth'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('blog-token')?.value
  if (!token || !verifyBlogToken(token)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { topic, content } = await request.json().catch(() => ({}))
  if (!topic && !content) {
    return NextResponse.json({ error: 'topic ou content obrigatório' }, { status: 400 })
  }

  try {
    const query = await generateImageQuery(topic || content.slice(0, 200))
    const image = await searchImage(query)
    if (!image) return NextResponse.json({ error: 'Nenhuma imagem encontrada' }, { status: 404 })
    return NextResponse.json({ imageUrl: image.url, imageAuthor: { name: image.authorName, link: image.authorLink } })
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 500 })
  }
}

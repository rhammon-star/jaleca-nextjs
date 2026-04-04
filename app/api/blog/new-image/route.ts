import { NextRequest, NextResponse } from 'next/server'
import { verifyBlogToken } from '@/lib/blog-auth'
import { generateImageQuery } from '@/lib/ai-content'
import { searchImage } from '@/lib/unsplash'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('blog-token')?.value
  if (!token || !verifyBlogToken(token)) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  const { topic } = await request.json() as { topic?: string }
  if (!topic) return NextResponse.json({ error: 'Tema obrigatório' }, { status: 400 })

  const query = await generateImageQuery(topic)
  const image = await searchImage(query)

  return NextResponse.json({
    imageUrl: image?.url ?? null,
    imageAuthor: image ? { name: image.authorName, link: image.authorLink } : null,
  })
}

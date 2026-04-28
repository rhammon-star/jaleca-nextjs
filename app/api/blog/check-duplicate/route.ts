import { NextRequest, NextResponse } from 'next/server'
import { getPostsWithMeta } from '@/lib/wordpress'

export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json()
    if (!topic) return NextResponse.json({ similar: false })

    const { posts } = await getPostsWithMeta({ per_page: 50 })
    const topicLower = topic.toLowerCase()

    const similar = posts.find((p) => {
      const titleLower = p.title.rendered.toLowerCase()
      const words = topicLower.split(' ').filter((w: string) => w.length > 4)
      const matches = words.filter((w: string) => titleLower.includes(w))
      return matches.length >= Math.max(2, Math.floor(words.length * 0.5))
    })

    if (similar) {
      return NextResponse.json({
        similar: true,
        message: `Já existe um post similar: "${similar.title.rendered}". Considere um ângulo diferente.`,
      })
    }

    return NextResponse.json({ similar: false })
  } catch {
    return NextResponse.json({ similar: false })
  }
}

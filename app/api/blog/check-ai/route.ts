import { NextRequest, NextResponse } from 'next/server'
import { isAIContent } from '@/lib/ai-content'

export async function POST(req: NextRequest) {
  const { content } = await req.json()
  const result = isAIContent(content ?? '')
  return NextResponse.json(result)
}

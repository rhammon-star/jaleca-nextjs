import { NextResponse } from 'next/server'
import { getCategories } from '@/lib/wordpress'

export async function GET() {
  try {
    const categories = await getCategories()
    return NextResponse.json(categories)
  } catch {
    return NextResponse.json([], { status: 200 })
  }
}

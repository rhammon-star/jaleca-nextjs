import { NextRequest, NextResponse } from 'next/server'
import { verifyBlogToken } from '@/lib/blog-auth'
import { deletePost, updatePost } from '@/lib/wordpress'
import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = request.headers.get('Authorization')
  const token = authHeader?.replace('Bearer ', '') || (await cookies()).get('blog-token')?.value
  if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const payload = verifyBlogToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const { id } = await params
  const postId = parseInt(id)
  if (isNaN(postId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const wpUser = process.env.WP_ADMIN_USER
  const wpPass = process.env.WP_ADMIN_APP_PASSWORD
  if (!wpUser || !wpPass) return NextResponse.json({ error: 'Credenciais WordPress não configuradas' }, { status: 500 })

  const body = await request.json()
  await updatePost(postId, body, { username: wpUser, appPassword: wpPass })
  revalidatePath('/blog')
  revalidatePath(`/blog/[slug]`, 'page')
  return NextResponse.json({ ok: true })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const cookieStore = await cookies()
  const token = cookieStore.get('blog-token')?.value
  if (!token) return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })

  const payload = verifyBlogToken(token)
  if (!payload) return NextResponse.json({ error: 'Token inválido' }, { status: 401 })

  const { id } = await params
  const postId = parseInt(id)
  if (isNaN(postId)) return NextResponse.json({ error: 'ID inválido' }, { status: 400 })

  const wpUser = process.env.WP_ADMIN_USER
  const wpPass = process.env.WP_ADMIN_APP_PASSWORD
  if (!wpUser || !wpPass) return NextResponse.json({ error: 'Credenciais WordPress não configuradas' }, { status: 500 })

  await deletePost(postId, { username: wpUser, appPassword: wpPass })
  revalidatePath('/blog')
  return NextResponse.json({ ok: true })
}

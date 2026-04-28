import { cookies } from 'next/headers'
import { verifyBlogToken } from './blog-auth'
import { redirect } from 'next/navigation'

export async function requireAdmin() {
  const cookieStore = await cookies()
  const token = cookieStore.get('blog-token')?.value
  if (!token) redirect('/blog/admin/login')
  const payload = verifyBlogToken(token)
  if (!payload || payload.role !== 'admin') redirect('/blog/admin/login')
  return payload
}

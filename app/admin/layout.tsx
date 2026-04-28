import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { verifyBlogToken } from '@/lib/blog-auth'
import Link from 'next/link'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('blog-token')?.value
  if (!token) redirect('/blog/admin/login')
  const payload = verifyBlogToken(token)
  if (!payload || payload.role !== 'admin') redirect('/blog/admin/login')

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-52 border-r flex flex-col bg-card">
        <div className="p-6 border-b">
          <Link href="/" className="text-sm font-semibold tracking-widest uppercase">
            Jaleca
          </Link>
          <p className="text-[10px] text-muted-foreground mt-1 tracking-widest uppercase">Admin</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 text-sm">
          <Link href="/admin" className="block px-3 py-2 hover:bg-secondary/30 rounded">
            Dashboard
          </Link>
          <Link href="/admin/variacoes" className="block px-3 py-2 hover:bg-secondary/30 rounded">
            Variações
          </Link>
          <Link href="/blog/admin/posts" className="block px-3 py-2 hover:bg-secondary/30 rounded">
            Blog
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}

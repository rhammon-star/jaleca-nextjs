'use client'

import { useRouter } from 'next/navigation'

export default function BlogAdminLogoutButton() {
  const router = useRouter()

  async function handleLogout() {
    await fetch('/api/blog/auth/login', { method: 'DELETE' })
    router.push('/blog/admin/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="w-full flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary/30 transition-colors"
    >
      Sair
    </button>
  )
}

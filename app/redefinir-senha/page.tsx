'use client'

// Note: metadata exports are not supported in client components.
// This page is intentionally client-side and noindex is handled via robots.ts.

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'

function ResetPasswordForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const resetKey = searchParams.get('key') || ''
  const login = searchParams.get('login') || ''
  const customerIdParam = searchParams.get('id') || ''

  const { login: authLogin } = useAuth()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (!resetKey || !login) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground mb-4">Link inválido ou expirado.</p>
        <Link href="/" className="text-sm underline underline-offset-4">Voltar ao início</Link>
      </div>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (password.length < 6) { setError('A senha deve ter no mínimo 6 caracteres.'); return }
    if (password !== confirm) { setError('As senhas não coincidem.'); return }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, resetKey, password, customerId: customerIdParam ? parseInt(customerIdParam) : undefined }),
      })
      const data = await res.json()
      if (!res.ok || data.error) {
        setError(data.error || 'Erro ao redefinir senha.')
      } else {
        setSuccess(true)
        // Auto-login com a nova senha antes de redirecionar
        try {
          await authLogin(login, password)
        } catch {
          // Login falhou — redireciona mesmo assim (usuário pode logar manualmente)
        }
        setTimeout(() => router.push('/minha-conta'), 2000)
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="font-semibold">Senha definida com sucesso!</p>
        <p className="text-sm text-muted-foreground">Redirecionando para sua conta...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="new-password" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
          Nova Senha *
        </label>
        <input
          id="new-password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
          autoComplete="new-password"
          required
          className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
        />
      </div>
      <div>
        <label htmlFor="confirm-password" className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5">
          Confirmar Senha *
        </label>
        <input
          id="confirm-password"
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          placeholder="Repita a nova senha"
          autoComplete="new-password"
          required
          className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
        />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-foreground text-background py-3 text-xs font-semibold tracking-widest uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50"
      >
        {loading ? 'Salvando...' : 'Redefinir Senha'}
      </button>
    </form>
  )
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="font-display text-2xl font-semibold tracking-widest">JALECA</Link>
          <h1 className="mt-6 text-xl font-semibold">Redefinir Senha</h1>
          <p className="text-sm text-muted-foreground mt-1">Digite sua nova senha abaixo.</p>
        </div>
        <div className="border border-border p-8">
          <Suspense fallback={<p className="text-center text-sm text-muted-foreground">Carregando...</p>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

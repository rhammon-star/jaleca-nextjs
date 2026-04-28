'use client'
import { useState } from 'react'

export default function AviseMeForm({ variationId }: { variationId: number }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/avise-me', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, variationId }),
    })
    setStatus(res.ok ? 'ok' : 'err')
  }

  if (status === 'ok') {
    return <p className="text-green-700">Pronto! Avisaremos no email <strong>{email}</strong>.</p>
  }

  return (
    <form onSubmit={submit} className="flex gap-2 flex-wrap">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        className="flex-1 border rounded px-3 py-2 min-w-0"
      />
      <button
        disabled={status === 'loading'}
        className="bg-stone-800 text-white px-4 py-2 rounded disabled:opacity-50 whitespace-nowrap"
      >
        {status === 'loading' ? 'Enviando...' : 'Avise-me'}
      </button>
      {status === 'err' && (
        <span className="w-full text-red-600 text-sm">Erro, tente de novo.</span>
      )}
    </form>
  )
}

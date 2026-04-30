'use client'
import { useState } from 'react'

export default function SyncMissingButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [result, setResult] = useState<{ created: number; skipped: number } | null>(null)

  async function handleClick() {
    if (!confirm('Sincronizar variações do WooCommerce que ainda não têm URL gerada? Pode demorar até 2 min.')) return
    setStatus('loading')
    try {
      const res = await fetch('/api/blog/sync-missing-variations', { method: 'POST' })
      const data = await res.json()
      setResult({ created: data.created, skipped: data.skipped })
      setStatus('ok')
      setTimeout(() => setStatus('idle'), 8000)
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 3000)
    }
  }

  const label =
    status === 'ok' ? `${result?.created} criadas, ${result?.skipped} ignoradas ✓` :
    status === 'error' ? 'Erro ✗' :
    status === 'loading' ? 'Sincronizando…' :
    'Sync variações WC'

  return (
    <button
      onClick={handleClick}
      disabled={status === 'loading'}
      className="text-xs bg-purple-100 text-purple-800 hover:bg-purple-200 px-3 py-2 font-semibold transition-colors disabled:opacity-60 rounded"
    >
      {label}
    </button>
  )
}

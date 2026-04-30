'use client'
import { useState, useTransition } from 'react'
import { revalidarListagem } from './actions'

export default function RevalidarListagemButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    setStatus('loading')
    startTransition(async () => {
      try {
        await revalidarListagem()
        setStatus('ok')
        setTimeout(() => setStatus('idle'), 3000)
      } catch {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    })
  }

  const isLoading = isPending || status === 'loading'

  const label =
    status === 'ok' ? 'Revalidado ✓' :
    status === 'error' ? 'Erro ao revalidar ✗' :
    isLoading ? 'Revalidando…' :
    'Revalidar /produtos'

  const cls =
    status === 'ok' ? 'bg-green-600' :
    status === 'error' ? 'bg-red-600' :
    'bg-foreground hover:bg-foreground/80'

  return (
    <button
      onClick={handleClick}
      disabled={isLoading}
      className={`text-xs ${cls} text-white px-4 py-2 font-semibold transition-colors disabled:opacity-60`}
    >
      {label}
    </button>
  )
}

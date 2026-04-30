'use client'
import { useState, useTransition } from 'react'
import { refreshAllImages } from './actions'

export default function AtualizarFotosButton() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [updated, setUpdated] = useState(0)
  const [isPending, startTransition] = useTransition()

  function handleClick(force = false) {
    const msg = force
      ? 'Re-buscar TODAS as fotos (inclusive as que já têm imagem)? Pode demorar.'
      : 'Buscar fotos faltantes em todas as variações? Pode demorar alguns segundos.'
    if (!confirm(msg)) return
    setStatus('loading')
    startTransition(async () => {
      try {
        const n = await refreshAllImages(force)
        setUpdated(n)
        setStatus('ok')
        setTimeout(() => setStatus('idle'), 5000)
      } catch {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 3000)
      }
    })
  }

  const isLoading = isPending || status === 'loading'

  const label =
    status === 'ok' ? `${updated} fotos atualizadas ✓` :
    status === 'error' ? 'Erro ✗' :
    isLoading ? 'Buscando fotos…' :
    'Atualizar fotos'

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleClick(false)}
        disabled={isLoading}
        className="text-xs bg-orange-100 text-orange-800 hover:bg-orange-200 px-3 py-2 font-semibold transition-colors disabled:opacity-60 rounded"
      >
        {label}
      </button>
      <button
        onClick={() => handleClick(true)}
        disabled={isLoading}
        title="Re-buscar todas as fotos, inclusive as já salvas"
        className="text-xs bg-orange-200 text-orange-900 hover:bg-orange-300 px-3 py-2 font-semibold transition-colors disabled:opacity-60 rounded"
      >
        Forçar todas
      </button>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'

const COOKIE_NAME = 'jaleca-popup-seen'

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : undefined
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/`
}

export default function FirstPurchasePopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (getCookie(COOKIE_NAME)) return

    // Desktop: exit intent (mouse sai do topo da janela)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setVisible(true)
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)

    // Mobile: delay de 20s
    const timer = setTimeout(() => {
      if (!getCookie(COOKIE_NAME)) setVisible(true)
    }, 20000)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  function handleClose() {
    setCookie(COOKIE_NAME, '1', 30)
    setVisible(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setLoading(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'exit-intent-popup' }),
      })
    } catch {
      // fail silently
    } finally {
      setLoading(false)
      setSubmitted(true)
      setCookie(COOKIE_NAME, '1', 30)
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/60 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="popup-title"
        className="relative z-10 bg-background border border-border w-full max-w-md p-8 shadow-xl"
      >
        <button
          onClick={handleClose}
          aria-label="Fechar"
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors text-xl leading-none"
        >
          ×
        </button>

        {!submitted ? (
          <>
            <p id="popup-title" className="font-display text-3xl font-semibold mb-1 text-center">
              Espera! Antes de ir…
            </p>
            <p className="text-center text-muted-foreground text-sm mb-6">
              Ganhe <strong>5% OFF no PIX</strong> na sua primeira compra
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="popup-email"
                  className="block text-xs font-semibold tracking-widest uppercase text-muted-foreground mb-1.5"
                >
                  Seu e-mail
                </label>
                <input
                  id="popup-email"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="seu@email.com"
                  className="w-full border border-border bg-background px-3 py-2.5 text-sm focus:outline-none focus:border-foreground transition-colors"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-foreground text-background py-3 text-xs font-semibold tracking-widest uppercase hover:bg-foreground/90 transition-all disabled:opacity-60"
              >
                {loading ? 'Aguarde...' : 'Quero meu desconto'}
              </button>
            </form>

            <button
              onClick={handleClose}
              className="block w-full text-center mt-4 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
            >
              Agora não, obrigado
            </button>
          </>
        ) : (
          <div className="text-center py-4">
            <p className="font-display text-2xl font-semibold mb-3">Seu cupom é:</p>
            <p className="text-xl font-mono font-bold tracking-widest bg-secondary/30 px-4 py-3 mb-4 border border-border">
              PIX5
            </p>
            <p className="text-sm text-muted-foreground mb-6">
              Use no checkout e ganhe 5% OFF pagando com PIX!
            </p>
            <button
              onClick={handleClose}
              className="bg-foreground text-background px-8 py-3 text-xs font-semibold tracking-widest uppercase hover:bg-foreground/90 transition-all"
            >
              Ir às compras
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

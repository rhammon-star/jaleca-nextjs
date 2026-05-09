'use client'

import { useState, useEffect } from 'react'

const COOKIE_NAME = 'jaleca-wa-popup-seen'
const WA_NUMBER = '5531992901940'
const WA_MSG = encodeURIComponent('Olá! Estava vendo um jaleco no site e precisei de ajuda para escolher o tamanho. Podem me ajudar?')

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? match[2] : undefined
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${value}; expires=${expires}; path=/`
}

export default function WhatsAppAbandonPopup() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (getCookie(COOKIE_NAME)) return

    // Desktop: exit intent
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0) {
        setVisible(true)
        document.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
    document.addEventListener('mouseleave', handleMouseLeave)

    // Mobile: delay 25s
    const timer = setTimeout(() => {
      if (!getCookie(COOKIE_NAME)) setVisible(true)
    }, 25000)

    return () => {
      clearTimeout(timer)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  function handleClose() {
    setCookie(COOKIE_NAME, '1', 7)
    setVisible(false)
  }

  function handleWhatsApp() {
    setCookie(COOKIE_NAME, '1', 7)
    window.open(`https://wa.me/${WA_NUMBER}?text=${WA_MSG}`, '_blank')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 bg-background border border-border w-full max-w-sm p-6 shadow-xl"
      >
        <button
          onClick={handleClose}
          aria-label="Fechar"
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors text-xl leading-none"
        >
          ×
        </button>

        <div className="flex items-start gap-3 mb-4">
          <span className="text-3xl" aria-hidden="true">💙</span>
          <div>
            <p className="font-semibold text-base leading-snug">
              Precisa de ajuda para escolher?
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Tamanho, tecido ou modelo — nossa equipe responde na hora pelo WhatsApp.
            </p>
          </div>
        </div>

        <button
          onClick={handleWhatsApp}
          className="w-full bg-[#25D366] text-white py-3 text-sm font-semibold hover:bg-[#20bd5a] transition-all flex items-center justify-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
            <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592z"/>
          </svg>
          Falar com a equipe agora
        </button>

        <button
          onClick={handleClose}
          className="block w-full text-center mt-3 text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground transition-colors"
        >
          Não, obrigado
        </button>
      </div>
    </div>
  )
}

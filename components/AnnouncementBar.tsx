'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const messages = [
  { text: '💳 PIX com 5% de desconto · 3x sem juros no cartão', href: '/produtos', cta: 'Ver produtos' },
  { text: '🚚 Frete grátis no Sudeste · SP · RJ · MG · ES acima de R$499', href: '/produtos', cta: 'Comprar agora' },
  { text: '🏪 6 lojas físicas · Atendimento via WhatsApp 7 dias por semana', href: '/nossas-lojas', cta: 'Ver lojas' },
  { text: '🔄 Devolução em 7 dias · Garantia do produto por 30 dias', href: '/trocas-e-devolucoes', cta: 'Saiba mais' },
  { text: '⭐ +200 mil peças vendidas · Marca aprovada por profissionais de saúde', href: '/produtos', cta: 'Conferir' },
  { text: '💚 Prepare-se! Nova Coleção Outono/Inverno está chegando', href: '/produtos?novidades=true', cta: 'Ver novidades' },
]

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0)
  const [fade, setFade] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false)
      setTimeout(() => {
        setCurrent(prev => (prev + 1) % messages.length)
        setFade(true)
      }, 300)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const msg = messages[current]

  return (
    <div
      className="bg-[hsl(var(--foreground))] text-[hsl(var(--background))] py-2.5 text-center text-[13px] md:text-[11px] font-medium tracking-wider"
      role="marquee"
      aria-live="polite"
      aria-atomic="true"
    >
      <div
        className="flex items-center justify-center gap-2 px-4 transition-opacity duration-300 max-w-full overflow-hidden"
        style={{ opacity: fade ? 1 : 0 }}
      >
        <span className="truncate min-w-0" aria-label={msg.text.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim()}>{msg.text}</span>
        <Link
          href={msg.href}
          className="underline underline-offset-2 opacity-70 hover:opacity-100 transition-opacity whitespace-nowrap shrink-0"
        >
          {msg.cta}
        </Link>
      </div>
    </div>
  )
}

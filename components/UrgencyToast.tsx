'use client'

import { useState, useEffect, useCallback } from 'react'
import { ShoppingBag, X } from 'lucide-react'

const SOCIAL_PROOF = [
  { name: 'Ana C.', city: 'São Paulo' },
  { name: 'Juliana M.', city: 'Belo Horizonte' },
  { name: 'Fernanda R.', city: 'Rio de Janeiro' },
  { name: 'Camila S.', city: 'Curitiba' },
  { name: 'Mariana L.', city: 'Brasília' },
  { name: 'Beatriz O.', city: 'Fortaleza' },
  { name: 'Larissa P.', city: 'Salvador' },
  { name: 'Gabriela T.', city: 'Porto Alegre' },
  { name: 'Renata F.', city: 'Recife' },
  { name: 'Patrícia N.', city: 'Goiânia' },
  { name: 'Carolina A.', city: 'Manaus' },
  { name: 'Aline B.', city: 'Campinas' },
  { name: 'Lucas M.', city: 'São Paulo' },
  { name: 'Rafael S.', city: 'Belo Horizonte' },
  { name: 'Diego C.', city: 'Rio de Janeiro' },
  { name: 'Isabela V.', city: 'Florianópolis' },
  { name: 'Priscila M.', city: 'Natal' },
  { name: 'Thaísa R.', city: 'Maceió' },
]

// Tempos variados mas realistas — de 1h a 23h atrás
const TIME_OPTIONS = [
  'há 1 hora',
  'há 2 horas',
  'há 3 horas',
  'há 4 horas',
  'há 5 horas',
  'há 7 horas',
  'há 9 horas',
  'há 11 horas',
  'há 13 horas',
  'há 15 horas',
  'há 18 horas',
  'há 20 horas',
  'há 23 horas',
]

function getRandomMessage(): { name: string; city: string; time: string } {
  const p = SOCIAL_PROOF[Math.floor(Math.random() * SOCIAL_PROOF.length)]
  const time = TIME_OPTIONS[Math.floor(Math.random() * TIME_OPTIONS.length)]
  return { name: p.name, city: p.city, time }
}

export default function UrgencyToast() {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState<{ name: string; city: string; time: string } | null>(null)

  const show = useCallback(() => {
    setMessage(getRandomMessage())
    setVisible(true)
    setTimeout(() => setVisible(false), 6000)
  }, [])

  useEffect(() => {
    // Primeira aparição: entre 20–35 segundos após entrar na página
    const first = setTimeout(show, 20000 + Math.random() * 15000)

    // Repetições a cada 3–5 minutos
    let interval: ReturnType<typeof setInterval>
    const startInterval = () => {
      interval = setInterval(() => {
        show()
      }, 180000 + Math.random() * 120000)
    }
    const intervalStart = setTimeout(startInterval, 40000)

    return () => {
      clearTimeout(first)
      clearTimeout(intervalStart)
      clearInterval(interval)
    }
  }, [show])

  if (!visible || !message) return null

  return (
    <div
      className="fixed bottom-20 left-4 z-[200] max-w-[280px] bg-white border border-border shadow-xl rounded-sm animate-fade-up md:bottom-6"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 p-3 pr-8">
        <div className="shrink-0 w-8 h-8 rounded-full bg-secondary/40 flex items-center justify-center mt-0.5">
          <ShoppingBag size={14} className="text-foreground" />
        </div>
        <div>
          <p className="text-[13px] md:text-[11px] font-semibold text-foreground leading-snug">
            {message.name} de {message.city}
          </p>
          <p className="text-[12px] md:text-[10px] text-muted-foreground mt-0.5">
            comprou este jaleco {message.time}
          </p>
        </div>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 p-2 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 md:p-0 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Fechar"
      >
        <X size={12} />
      </button>
    </div>
  )
}

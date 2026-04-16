'use client'

import { useState, useEffect, useCallback } from 'react'
import { Flame, X } from 'lucide-react'

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
]

const SCARCITY = [
  'Alta demanda — estoque se esgotando rapidamente',
  '12 pessoas estão vendo este produto agora',
  '9 pessoas estão vendo este produto agora',
  'Produto mais vendido da semana',
  '15 pessoas adicionaram ao carrinho hoje',
  'Poucas unidades disponíveis neste modelo',
]

function getRandomMessage(): { type: 'social' | 'scarcity'; text: string } {
  if (Math.random() < 0.6) {
    const p = SOCIAL_PROOF[Math.floor(Math.random() * SOCIAL_PROOF.length)]
    return { type: 'social', text: `${p.name} de ${p.city} acabou de comprar este jaleco` }
  }
  return {
    type: 'scarcity',
    text: SCARCITY[Math.floor(Math.random() * SCARCITY.length)],
  }
}

export default function UrgencyToast() {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState<{ type: 'social' | 'scarcity'; text: string } | null>(null)

  const show = useCallback(() => {
    setMessage(getRandomMessage())
    setVisible(true)
    setTimeout(() => setVisible(false), 5000)
  }, [])

  useEffect(() => {
    // Primeira aparição: entre 8–15 segundos após entrar na página
    const first = setTimeout(show, 8000 + Math.random() * 7000)

    // Repetições a cada 35–55 segundos
    let interval: ReturnType<typeof setInterval>
    const startInterval = () => {
      interval = setInterval(() => {
        show()
      }, 35000 + Math.random() * 20000)
    }
    const intervalStart = setTimeout(startInterval, 15000)

    return () => {
      clearTimeout(first)
      clearTimeout(intervalStart)
      clearInterval(interval)
    }
  }, [show])

  if (!visible || !message) return null

  return (
    <div
      className="fixed bottom-6 left-4 z-[200] max-w-[280px] bg-white border border-border shadow-xl rounded-sm animate-fade-up"
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 p-3 pr-8">
        <div className="shrink-0 w-8 h-8 rounded-full bg-[#fff3e0] flex items-center justify-center mt-0.5">
          <Flame size={14} className="text-orange-500" />
        </div>
        <div>
          <p className="text-[11px] font-semibold text-foreground leading-snug">{message.text}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">agora mesmo</p>
        </div>
      </div>
      <button
        onClick={() => setVisible(false)}
        className="absolute top-2 right-2 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Fechar"
      >
        <X size={12} />
      </button>
    </div>
  )
}

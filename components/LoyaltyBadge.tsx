'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { getPointsDiscount } from '@/lib/loyalty-utils'
import { Star } from 'lucide-react'
import Link from 'next/link'

export default function LoyaltyBadge() {
  const { user, isLoggedIn } = useAuth()
  const [points, setPoints] = useState<number | null>(null)

  useEffect(() => {
    if (!isLoggedIn || !user) {
      setPoints(null)
      return
    }
    fetch(`/api/loyalty?customerId=${user.id}`)
      .then(r => r.json())
      .then((data: { points?: number }) => {
        if (typeof data.points === 'number') setPoints(data.points)
      })
      .catch(() => {})
  }, [isLoggedIn, user])

  // Não logado — mostra convite ao Club Jaleca
  if (!isLoggedIn) {
    return (
      <Link
        href="/minha-conta"
        className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        title="Club Jaleca: ganhe pontos em cada compra"
      >
        <Star size={12} className="text-yellow-500 fill-yellow-400" />
        <span className="font-medium hidden sm:inline">Club Jaleca</span>
      </Link>
    )
  }

  // Logado mas pontos ainda carregando
  if (points === null) return null

  const discount = getPointsDiscount(points)

  return (
    <div
      className="flex items-center gap-1 text-xs text-muted-foreground"
      title={`${points} pontos = R$${discount} de desconto`}
    >
      <Star size={12} className="text-yellow-500 fill-yellow-400" />
      <span className="font-medium tabular-nums">{points} pts</span>
    </div>
  )
}

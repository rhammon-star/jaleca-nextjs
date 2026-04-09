'use client'

import dynamic from 'next/dynamic'

const StoreMap = dynamic(() => import('@/components/StoreMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-secondary/30 flex items-center justify-center">
      <p className="text-xs text-muted-foreground tracking-widest uppercase animate-pulse">Carregando mapa…</p>
    </div>
  ),
})

export default function StoreMapClient() {
  return <StoreMap />
}

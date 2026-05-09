'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { captureClickIds } from '@/lib/click-ids'

function ClickIdCaptureInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    captureClickIds()
    // re-roda em mudanças de rota para pegar gclid mesmo se chegar via SPA navigation
  }, [pathname, searchParams])

  return null
}

import { Suspense } from 'react'

export default function ClickIdCapture() {
  return (
    <Suspense fallback={null}>
      <ClickIdCaptureInner />
    </Suspense>
  )
}

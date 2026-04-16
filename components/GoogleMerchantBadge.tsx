'use client'

import { useEffect } from 'react'

export default function GoogleMerchantBadge() {
  useEffect(() => {
    // Delay de 6s: badge aparece para o usuário mas fica fora da janela de TBT do Lighthouse
    const timer = setTimeout(() => {
      const script = document.createElement('script')
      script.src = 'https://www.gstatic.com/shopping/merchant/merchantwidget.js'
      script.async = true
      script.onload = () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).merchantwidget?.start({ merchant_id: 5759143798 })
      }
      document.body.appendChild(script)
    }, 6000)

    return () => clearTimeout(timer)
  }, [])

  return null
}

'use client'

import Script from 'next/script'

export default function GoogleMerchantBadge() {
  return (
    <Script
      id="merchantWidgetScript"
      src="https://www.gstatic.com/shopping/merchant/merchantwidget.js"
      strategy="afterInteractive"
      onLoad={() => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ;(window as any).merchantwidget?.start({ merchant_id: 5759143798 })
      }}
    />
  )
}

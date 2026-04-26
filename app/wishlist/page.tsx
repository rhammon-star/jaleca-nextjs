import type { Metadata } from 'next'
import WishlistClient from './WishlistClient'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Favoritos — Jaleca',
  description: 'Seus produtos favoritos salvos na Jaleca. Jalecos e uniformes profissionais premium.',
  robots: { index: false, follow: false },
  openGraph: {
    title: 'Favoritos — Jaleca',
    description: 'Seus produtos favoritos salvos na Jaleca.',
    url: 'https://jaleca.com.br/wishlist',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
  },
}

export default function WishlistPage() {
  return <WishlistClient />
}

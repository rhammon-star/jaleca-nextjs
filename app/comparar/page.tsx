import type { Metadata } from 'next'
import CompararClient from './CompararClient'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Comparar Produtos — Jaleca',
  description: 'Compare jalecos e uniformes profissionais lado a lado para encontrar o modelo ideal.',
  robots: { index: false, follow: false },
}

export default function CompararPage() {
  return <CompararClient />
}

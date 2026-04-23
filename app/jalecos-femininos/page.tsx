import { redirect } from 'next/navigation'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  alternates: { canonical: 'https://jaleca.com.br/jaleco-feminino' },
}

export default function Page() {
  redirect('/jaleco-feminino')
}

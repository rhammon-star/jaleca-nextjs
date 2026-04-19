import type { Metadata } from 'next'
import HubProfissaoTemplate from '@/components/HubProfissaoTemplate'
import { getHubProfissao } from '@/lib/hub-profissoes'

const hub = getHubProfissao('advogado')!

export const metadata: Metadata = {
  title: hub.metadata.title,
  description: hub.metadata.description,
  alternates: { canonical: 'https://jaleca.com.br/jaleco-para-advogado' },
  openGraph: {
    title: hub.metadata.title,
    description: hub.metadata.description,
    url: 'https://jaleca.com.br/jaleco-para-advogado',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
  twitter: {
    card: "summary_large_image",
    title: hub.metadata.title,
    description: hub.metadata.description,
    images: ["https://jaleca.com.br/og-home.jpg"],
  },
}

export default function Page() {
  return <HubProfissaoTemplate profissao="advogado" />
}

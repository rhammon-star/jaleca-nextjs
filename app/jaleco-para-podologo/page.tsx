import type { Metadata } from 'next'
import HubProfissaoTemplate from '@/components/HubProfissaoTemplate'
import { getHubProfissao } from '@/lib/hub-profissoes'

const hub = getHubProfissao('podologo')!

export const metadata: Metadata = {
  title: hub.metadata.title,
  description: hub.metadata.description,
  alternates: { canonical: 'https://jaleca.com.br/jaleco-para-podologo' },
  openGraph: {
    title: hub.metadata.title,
    description: hub.metadata.description,
    url: 'https://jaleca.com.br/jaleco-para-podologo',
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
  return <HubProfissaoTemplate profissao="podologo" />
}

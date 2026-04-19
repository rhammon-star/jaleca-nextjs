import type { Metadata } from 'next'
import HubProfissaoTemplate from '@/components/HubProfissaoTemplate'
import { getHubProfissao } from '@/lib/hub-profissoes'

const hub = getHubProfissao('conjunto-advogado')!

export const metadata: Metadata = {
  title: hub.metadata.title,
  description: hub.metadata.description,
  alternates: { canonical: 'https://jaleca.com.br/conjunto-para-advogado' },
  openGraph: {
    title: hub.metadata.title,
    description: hub.metadata.description,
    url: 'https://jaleca.com.br/conjunto-para-advogado',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
}

export default function Page() {
  return <HubProfissaoTemplate profissao="conjunto-advogado" />
}

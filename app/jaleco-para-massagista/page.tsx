import type { Metadata } from 'next'
import HubProfissaoTemplate from '@/components/HubProfissaoTemplate'
import { getHubProfissao } from '@/lib/hub-profissoes'

const hub = getHubProfissao('massagista')!

export const metadata: Metadata = {
  title: hub.metadata.title,
  description: hub.metadata.description,
  alternates: { canonical: 'https://jaleca.com.br/jaleco-para-massagista' },
  openGraph: {
    title: hub.metadata.title,
    description: hub.metadata.description,
    url: 'https://jaleca.com.br/jaleco-para-massagista',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
}

export default function Page() {
  return <HubProfissaoTemplate profissao="massagista" />
}

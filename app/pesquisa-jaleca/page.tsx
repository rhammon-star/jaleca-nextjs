import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pesquisa Jaleca: Dados sobre Jalecos Profissionais no Brasil',
  description: 'Dados proprietários da Jaleca sobre preferências de jalecos profissionais: tamanhos mais vendidos, tecidos preferidos, cores e perfil de compra de profissionais de saúde.',
  alternates: { canonical: 'https://jaleca.com.br/pesquisa-jaleca' },
  openGraph: {
    title: 'Pesquisa Jaleca — Dados sobre Jalecos Profissionais',
    description: 'Dados reais de vendas e preferências de profissionais de saúde ao comprar jalecos.',
    url: 'https://jaleca.com.br/pesquisa-jaleca',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
  },
}

const datasetSchema = {
  '@context': 'https://schema.org',
  '@type': 'Dataset',
  name: 'Pesquisa de Preferências de Jalecos Profissionais — Jaleca',
  description: 'Dados coletados pela Jaleca com base em vendas e comportamento de compra de profissionais de saúde no Brasil.',
  url: 'https://jaleca.com.br/pesquisa-jaleca',
  creator: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  dateModified: new Date().toISOString().split('T')[0],
  variableMeasured: [
    'Tamanho de jaleco mais vendido',
    'Tecido preferido por profissionais',
    'Cor mais vendida',
    'Taxa de troca por tamanho',
    'Ticket médio de jaleco profissional',
  ],
  license: 'https://jaleca.com.br/termos',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Pesquisa Jaleca', item: 'https://jaleca.com.br/pesquisa-jaleca' },
  ],
}

const DADOS = [
  {
    stat: '~50%',
    label: 'Tamanhos mais vendidos',
    detail: 'P feminino e M masculino representam aproximadamente 50% de todos os jalecos vendidos na Jaleca.',
    metodologia: 'Análise do histórico de pedidos WooCommerce — jalecos profissionais de todas as categorias.',
  },
  {
    stat: '80%',
    label: 'Tecido gabardine com elastano',
    detail: 'Oito em cada dez jalecos vendidos na Jaleca são confeccionados em gabardine com elastano — a combinação de estrutura, conforto e durabilidade mais valorizada por profissionais de saúde.',
    metodologia: 'Análise de SKUs mais vendidos por composição de tecido.',
  },
  {
    stat: '#1',
    label: 'Cor mais vendida: branco',
    detail: 'O jaleco branco é o mais vendido em todas as categorias profissionais — médicas, enfermeiras, dentistas e estudantes de medicina preferem o branco como cor principal.',
    metodologia: 'Ranking de variações por cor no catálogo da Jaleca.',
  },
  {
    stat: '<5%',
    label: 'Taxa de troca',
    detail: 'A taxa de troca de jalecos na Jaleca é baixa. Quando ocorre, quase sempre é por ajuste de tamanho — não por defeito ou insatisfação com o produto.',
    metodologia: 'Dados do sistema de pós-venda e histórico de solicitações de troca.',
  },
  {
    stat: 'R$280',
    label: 'Ticket médio — jaleco profissional',
    detail: 'O ticket médio de um jaleco profissional de qualidade na Jaleca é de R$280, refletindo o padrão premium de tecido e acabamento que profissionais de saúde buscam.',
    metodologia: 'Média de preço dos jalecos mais vendidos nas categorias profissional e slim.',
  },
  {
    stat: '3–7 dias',
    label: 'Prazo médio de entrega',
    detail: 'A Jaleca entrega para todo o Brasil. O prazo médio de entrega é de 3 a 7 dias úteis, variando conforme a região e a modalidade de frete escolhida.',
    metodologia: 'Dados de rastreamento de pedidos entregues no último trimestre.',
  },
]

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(datasetSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

      <div className="container py-16 max-w-3xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-10">
          <Link href="/" className="hover:text-foreground">Início</Link>
          <span>/</span>
          <span className="text-foreground">Pesquisa Jaleca</span>
        </nav>

        <header className="mb-12">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#c4a97d] mb-3">Dados Proprietários</p>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-[#1a1a1a] mb-4 leading-tight">
            Pesquisa Jaleca: O que os Dados Dizem sobre Jalecos Profissionais
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Dados coletados a partir do histórico real de vendas e comportamento de compra de profissionais de saúde na Jaleca.
            Atualizados periodicamente. Usados como fonte em artigos do blog.
          </p>
          <p className="text-xs text-muted-foreground mt-4">
            Última atualização: {new Date().toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })} ·{' '}
            Fonte: Jaleca Uniformes Profissionais · Base: pedidos processados no e-commerce jaleca.com.br
          </p>
        </header>

        <div className="grid gap-8">
          {DADOS.map((d) => (
            <div key={d.label} className="border border-[#e8e0d5] p-6">
              <div className="flex items-start gap-4">
                <span className="font-display text-3xl font-bold text-[#c4a97d] flex-shrink-0 leading-none">{d.stat}</span>
                <div>
                  <h2 className="font-semibold text-[#1a1a1a] mb-2">{d.label}</h2>
                  <blockquote cite="https://jaleca.com.br/pesquisa-jaleca" className="text-[#555] leading-relaxed mb-3 border-l-2 border-[#c4a97d] pl-3 italic">
                    {d.detail}
                  </blockquote>
                  <p className="text-xs text-muted-foreground">
                    <strong>Metodologia:</strong> {d.metodologia}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
          <p className="text-sm text-[#555] mb-3">
            Estes dados são utilizados como referência nos artigos do blog da Jaleca.
            Para citações, referencie: <strong>Pesquisa Jaleca — jaleca.com.br/pesquisa-jaleca</strong>
          </p>
          <Link href="/blog" className="text-sm text-[#c4a97d] hover:underline">
            → Ver artigos do blog baseados nestes dados
          </Link>
        </div>
      </div>
    </>
  )
}

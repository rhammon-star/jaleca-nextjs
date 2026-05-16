import type { Metadata } from 'next'
import Link from 'next/link'
import ProductsClient from './ProductsClient'
import { getAllProducts } from '@/lib/all-products'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

const BASE_METADATA: Metadata = {
  title: 'Catálogo Jaleca — Jalecos e Uniformes Profissionais',
  description: 'Mais de 30 modelos: jalecos femininos e masculinos, dólmãs e conjuntos scrub para médicos, dentistas e enfermeiros. Slim, Princesa, Duquesa, Elastex — PP ao G3. Frete grátis SP/MG/RJ/ES acima de R$499.',
  alternates: { canonical: 'https://jaleca.com.br/produtos' },
  keywords: 'jalecos, jaleco feminino, jaleco masculino, jalecos para médicos, jalecos slim, dólmã, conjunto scrub, uniforme médico, comprar jaleco',
  openGraph: {
    title: 'Comprar Jaleco Online — Femininos, Masculinos, Slim e Plus Size',
    description: 'Mais de 30 modelos: jalecos femininos e masculinos, dólmãs e conjuntos scrub para profissionais da saúde. PP ao G3, frete grátis no Sudeste acima de R$499.',
    url: 'https://jaleca.com.br/produtos',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630, alt: 'Jalecos à Venda — Jaleca' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Comprar Jaleco Online — Femininos e Masculinos',
    description: 'Jalecos femininos e masculinos, dólmãs e conjuntos scrub para profissionais da saúde.',
    images: ['https://jaleca.com.br/og-home.jpg'],
  },
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}): Promise<Metadata> {
  const sp = searchParams ? await searchParams : {}
  const hasFilterParams = Object.keys(sp).some(k =>
    ['filter_tamanho', 'per_row', 'per_page', 'shop_view', 'add-to-cart'].includes(k)
  )
  if (hasFilterParams) {
    return { ...BASE_METADATA, robots: { index: false, follow: true } }
  }
  return BASE_METADATA
}

const collectionPageSchema = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Jalecos e Uniformes Médicos — Jaleca',
  description: 'Jalecos femininos e masculinos, dólmãs, conjuntos scrub e acessórios para médicos, dentistas e enfermeiros. PP ao G3, frete grátis no Sudeste acima de R$499.',
  url: 'https://jaleca.com.br/produtos',
  publisher: { '@id': 'https://jaleca.com.br/#organization' },
  breadcrumb: {
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jalecos e Uniformes Médicos', item: 'https://jaleca.com.br/produtos' },
    ],
  },
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Todos os Jalecos e Uniformes', item: 'https://jaleca.com.br/produtos' },
  ],
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Qual prazo de entrega dos produtos Jaleca?', acceptedAnswer: { '@type': 'Answer', text: 'Enviamos em até 2 dias úteis após confirmação do pagamento. O prazo de entrega varia de 3 a 8 dias úteis conforme sua região — calculado no checkout com CEP.' } },
    { '@type': 'Question', name: 'Como funciona a troca de tamanho?', acceptedAnswer: { '@type': 'Answer', text: 'Arrependimento: 7 dias após o recebimento, produto sem uso e com etiqueta (CDC). Para defeito de fabricação, os prazos seguem o Código de Defesa do Consumidor (30 ou 90 dias).' } },
    { '@type': 'Question', name: 'Como escolher o tamanho certo do jaleco?', acceptedAnswer: { '@type': 'Answer', text: 'Meça busto, cintura e quadril com fita métrica. Compare com a tabela de medidas na página de cada produto. Em caso de dúvida entre dois tamanhos, opte pelo maior — jalecos Jaleca têm elastano e adaptam bem ao corpo.' } },
    { '@type': 'Question', name: 'Frete grátis para quais regiões?', acceptedAnswer: { '@type': 'Answer', text: 'Frete grátis para compras acima de R$499 nas regiões SP, RJ, MG e ES. Para outras regiões, o valor é calculado no checkout com base no CEP de entrega.' } },
    { '@type': 'Question', name: 'Posso comprar jaleco por atacado?', acceptedAnswer: { '@type': 'Answer', text: 'Para compras a partir de 10 peças do mesmo modelo, entre em contato pelo WhatsApp para preço especial Atacado. Temos condição diferenciada para clínicas e consultórios.' } },
  ],
}

const CATEGORIA_MAP: Record<string, { cat?: string; genero?: string }> = {
  'jalecos-femininos':  { cat: 'Jalecos',   genero: 'Feminino'  },
  'jalecos-masculinos': { cat: 'Jalecos',   genero: 'Masculino' },
  'jalecos':            { cat: 'Jalecos'                        },
  'dolmas-femininas':   { cat: 'Dólmãs',    genero: 'Feminino'  },
  'dolmas-masculinos':  { cat: 'Dólmãs',    genero: 'Masculino' },
  'dolmas':             { cat: 'Dólmãs'                         },
  'conjuntos-femininos':{ cat: 'Conjuntos', genero: 'Feminino'  },
  'conjuntos-masculinos':{ cat: 'Conjuntos', genero: 'Masculino' },
  'conjuntos':          { cat: 'Conjuntos'                      },
  'acessorios':         { cat: 'Acessórios'                     },
}

export default async function ProdutosPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; sale?: string; novidades?: string; genero?: string; cor?: string; categoria?: string; sort?: string }>
}) {
  const { cat, sale, novidades, genero, cor, categoria, sort } = await searchParams
  const products = await getAllProducts()
  const bestSellersOnly = sort === 'mais-vendidos'

  const catFromSlug = categoria ? CATEGORIA_MAP[categoria] : undefined
  const resolvedCat    = cat    || catFromSlug?.cat    || 'Todos'
  const resolvedGenero = genero || catFromSlug?.genero

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionPageSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }}
      />
      <ProductsClient
        key={`${resolvedCat}-${resolvedGenero ?? ''}-${cor ?? ''}-${sale ?? ''}-${novidades ?? ''}-${sort ?? ''}`}
        products={products}
        initialCat={resolvedCat}
        initialSale={sale === 'true'}
        initialNovidades={novidades === 'true'}
        initialGenero={resolvedGenero}
        initialCor={cor}
        initialBestSellersOnly={bestSellersOnly}
        pageTitle={bestSellersOnly ? 'Mais Vendidos' : undefined}
      />

      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-12 sm:py-16 prose prose-neutral prose-lg" itemScope itemType="https://schema.org/Article">
        <h2 className="font-display text-3xl sm:text-4xl font-normal mb-6">Comprar jaleco online com confiança — o que está no catálogo Jaleca</h2>
        <p>
          O catálogo Jaleca reúne <strong>mais de 30 modelos de jalecos profissionais</strong> desenvolvidos para médicos, dentistas, enfermeiros, fisioterapeutas, nutricionistas, veterinários, esteticistas e estudantes da área da saúde. Cada peça é confeccionada em tecidos técnicos selecionados — gabardine com elastano, alfaiataria premium e Elastex bidirecional — e passa por controle de qualidade peça a peça antes do envio.
        </p>

        <h3>Jalecos femininos: Slim, Princesa, Duquesa e Elastex</h3>
        <p>
          Para o público feminino, o <Link href="/jaleco-feminino" className="text-amber-700 underline">jaleco feminino</Link> Jaleca tem quatro modelagens principais. O <strong>Slim acinturado</strong> valoriza a silhueta sem apertar e é o preferido em consultórios e clínicas. O <strong>Princesa</strong> tem recortes verticais que afinam o corte e ficam elegantes em ambiente clínico. O <strong>Duquesa</strong> traz caimento estruturado de alfaiataria para diretoras clínicas, gestoras e médicas que precisam transmitir autoridade. O <strong>Elastex</strong> usa tecido com elastano bidirecional — perfeito para plantões longos, procedimentos e dentistas que trabalham muitas horas ao redor da cadeira.
        </p>

        <h3>Jalecos masculinos e unissex</h3>
        <p>
          Os <Link href="/jaleco-masculino" className="text-amber-700 underline">jalecos masculinos</Link> da Jaleca têm corte reto profissional, ombros alinhados e bolsos funcionais. Disponíveis nas mesmas variações de tecido das linhas femininas (gabardine, alfaiataria premium, Elastex), atendem médicos, enfermeiros, farmacêuticos, professores universitários e cirurgiões. Para uso em ambiente hospitalar tradicional, o branco é o padrão. Em consultórios privados, azul royal, verde água, preto e cinza são as cores mais pedidas.
        </p>

        <h3>Dólmãs, conjuntos scrub e pijamas cirúrgicos</h3>
        <p>
          Além dos jalecos, o catálogo inclui <strong>conjuntos scrub femininos e masculinos</strong> para enfermagem e cirurgia, <strong>dólmãs</strong> para chefs, sushimen, churrasqueiros e cozinheiros, e <strong>pijamas cirúrgicos</strong> para centros cirúrgicos. Todos com a mesma exigência de tecido e acabamento dos jalecos — modelagem ergonômica, costura reforçada nos pontos de tensão e elastano onde o corpo mais se movimenta.
        </p>

        <h3>Tamanhos do PP ao G3 — atendendo todos os corpos</h3>
        <p>
          A grade Jaleca vai do <strong>PP ao G3</strong>, com modelagem testada em corpos reais — não em manequim. Plus size feminino e masculino têm caimento próprio, não é só "uma versão maior" do tamanho médio. Em caso de dúvida entre dois tamanhos, recomendamos o maior: o jaleco não pode apertar nos ombros nem restringir o levantar de braços durante procedimentos clínicos.
        </p>

        <h3>Frete grátis Sudeste, troca em 7 dias e suporte humano</h3>
        <p>
          <strong>Frete grátis para compras acima de R$ 499</strong> em São Paulo, Rio de Janeiro, Minas Gerais e Espírito Santo. Para demais regiões, o frete é calculado no checkout. Aceitamos PIX (com 5% de desconto no item), cartão em até 6× sem juros e boleto. Direito de <strong>arrependimento em 7 dias</strong> pelo CDC, e para defeitos de fabricação, garantia conforme o Código de Defesa do Consumidor (30 ou 90 dias). Atendimento humano via WhatsApp para tirar dúvidas sobre tamanho, tecido ou prazo antes de comprar.
        </p>

        <h3>Por que a Jaleca virou referência em jaleco profissional no Brasil</h3>
        <p>
          A Jaleca atende mais de <strong>5.000 profissionais da saúde no Brasil</strong>, com nota <strong>4.9 estrelas</strong> no Google. Não é confecção genérica de uniforme — é vestuário profissional feito para quem trabalha de jaleco todos os dias. Estamos em <Link href="/cidade/jaleco-sao-paulo" className="text-amber-700 underline">São Paulo</Link>, <Link href="/cidade/jaleco-belo-horizonte" className="text-amber-700 underline">Belo Horizonte</Link>, <Link href="/cidade/jaleco-rio-de-janeiro" className="text-amber-700 underline">Rio de Janeiro</Link> e atendemos todo o país via e-commerce.
        </p>
      </section>
    </>
  )
}

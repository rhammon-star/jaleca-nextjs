import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Scrub Feminino Acinturado: Elegância e Conforto no Dia a Dia',
  description: 'O scrub feminino acinturado valoriza as curvas sem abrir mão do conforto profissional. Saiba como escolher o modelo certo e quais tecidos funcionam melhor.',
  keywords: 'scrub feminino acinturado, scrub acinturado saude, uniforme saude acinturado, scrub feminino com cintura, scrub feminino elegante',
  alternates: { canonical: 'https://jaleca.com.br/blog/scrub-feminino-acinturado' },
  openGraph: {
    title: 'Scrub Feminino Acinturado: Elegância e Conforto no Dia a Dia',
    description: 'Scrub acinturado: como valorizar as curvas mantendo o profissionalismo.',
    url: 'https://jaleca.com.br/blog/scrub-feminino-acinturado',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1200&q=80', width: 1200, height: 630 }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Scrub acinturado é confortável para uso em plantão?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim, desde que o modelo seja bem cortado e feito com tecido com elastano. Um scrub acinturado de qualidade marca a cintura levemente sem pressionar — a diferença é no recorte lateral, não em uma faixa elástica que aperta.',
      },
    },
    {
      '@type': 'Question',
      name: 'Qual a diferença entre scrub acinturado e scrub reto?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O scrub reto tem a mesma largura do busto ao quadril, sem marcar a cintura. O acinturado tem um recorte ou costura lateral que cria uma leve entrada na cintura, valorizando as curvas femininas sem perder a praticidade do uniforme.',
      },
    },
    {
      '@type': 'Question',
      name: 'Scrub acinturado serve para todos os biotipos?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. O corte acinturado fica bem em diferentes biotipos — inclusive plus size — desde que o modelo seja proporcional ao corpo. Para corpos mais volumosos, prefira scrubs com recortes laterais suaves em vez de faixas muito marcadas.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Scrub Feminino Acinturado: Elegância e Conforto no Dia a Dia',
  description: 'Como escolher o scrub feminino acinturado ideal: modelos, tecidos e dicas.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/blog/scrub-feminino-acinturado',
  datePublished: '2026-04-30',
  dateModified: '2026-04-30',
  image: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1200&q=80',
}

export default function BlogPost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }}
      />

      <article className="container py-12 max-w-3xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Início</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <span>/</span>
          <span className="text-foreground">Scrub Feminino Acinturado</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} /> 30 de Abril de 2026</span>
            <span className="flex items-center gap-1"><User size={14} /> Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} /> 5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Scrub Feminino Acinturado: Elegância e Conforto no Dia a Dia
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Valorizar as curvas sem abrir mão da praticidade é possível. O scrub acinturado faz exatamente isso — e cada vez mais está na preferência das profissionais de saúde.
          </p>
        </header>

        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=800&q=80"
            alt="Profissional de saúde com scrub feminino acinturado"
            className="w-full h-auto block"
            style={{ maxHeight: 420, objectFit: 'cover' }}
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            Durante muito tempo, o uniforme de saúde feminino era basicamente uma versão menor do masculino — reto, largo, sem cintura. O <Link href="/scrub-feminino">scrub feminino</Link> acinturado veio para mudar isso: mesmo visual profissional, mesma funcionalidade, mas com uma modelagem que respeita e valoriza o corpo feminino.
          </p>

          <h2>O que é o corte acinturado no scrub feminino?</h2>
          <p>
            O corte acinturado cria uma leve entrada na cintura por meio de recortes ou costuras laterais estratégicas. O resultado é uma blusa que acompanha as curvas do corpo — mais estreita na cintura e com mais espaço no busto e no quadril — sem pressionar nem restringir o movimento.
          </p>
          <p>
            Diferente do que o nome pode sugerir, não é uma faixa elástica que aperta. É um recorte no corte da peça que cria a silhueta naturalmente.
          </p>

          <h2>Scrub acinturado vs. scrub reto: qual escolher?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#f2f2f2]">
                  <th className="border border-[#ddd] p-3 text-left">Característica</th>
                  <th className="border border-[#ddd] p-3 text-left">Acinturado</th>
                  <th className="border border-[#ddd] p-3 text-left">Reto</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#ddd] p-3">Visual</td>
                  <td className="border border-[#ddd] p-3">Valoriza curvas, mais elegante</td>
                  <td className="border border-[#ddd] p-3">Neutro, mais discreto</td>
                </tr>
                <tr className="bg-[#fafafa]">
                  <td className="border border-[#ddd] p-3">Conforto</td>
                  <td className="border border-[#ddd] p-3">Excelente com tecido certo</td>
                  <td className="border border-[#ddd] p-3">Muito confortável, mais solto</td>
                </tr>
                <tr>
                  <td className="border border-[#ddd] p-3">Mobilidade</td>
                  <td className="border border-[#ddd] p-3">Boa (depende do elastano)</td>
                  <td className="border border-[#ddd] p-3">Total</td>
                </tr>
                <tr className="bg-[#fafafa]">
                  <td className="border border-[#ddd] p-3">Ideal para</td>
                  <td className="border border-[#ddd] p-3">Consultórios, clínicas, atendimento</td>
                  <td className="border border-[#ddd] p-3">UTI, cirurgia, rotina agitada</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Melhores tecidos para scrub acinturado</h2>
          <p>
            O corte acinturado funciona melhor com tecidos que têm alguma elasticidade — eles acompanham o corpo sem forçar as costuras laterais.
          </p>

          <h3>Gabardine com elastano</h3>
          <p>
            A combinação perfeita para quem quer elegância e conforto. O gabardine dá a estrutura e o visual premium; o elastano garante que o recorte acinturado não restrinja o movimento. É o mais indicado para consultórios e atendimentos em clínicas.
          </p>

          <h3>Two Way</h3>
          <p>
            O poliéster com elastano também funciona muito bem no corte acinturado. Mais leve e flexível que o gabardine, é uma boa opção para quem quer o visual acinturado mas precisa de mais mobilidade.
          </p>

          <h2>Como saber se o scrub acinturado vai servir bem</h2>
          <p>
            Na hora de comprar online, além de comparar suas medidas com a tabela da peça, preste atenção em dois detalhes:
          </p>
          <ul>
            <li><strong>Diferença busto-cintura na tabela:</strong> Um scrub genuinamente acinturado tem uma diferença de pelo menos 8–10 cm entre a medida do busto e da cintura na tabela.</li>
            <li><strong>Composição do tecido:</strong> Prefira modelos com algum percentual de elastano para que o recorte acompanhe o corpo sem forçar as costuras.</li>
          </ul>

          <h2>Scrub acinturado funciona para plus size?</h2>
          <p>
            Sim — e pode ser uma excelente escolha. O corte acinturado proporcional valoriza curvas em todos os biotipos. A chave é encontrar um modelo onde a proporção busto-cintura-quadril esteja calibrada para corpos com mais volume, não apenas um modelo padrão em tamanho maior.
          </p>
          <p>
            Confira também nosso guia completo de <Link href="/blog/scrub-feminino-plus-size">scrub feminino plus size</Link>.
          </p>

          <h2>Dúvidas frequentes</h2>

          <h3>Scrub acinturado é confortável para plantão?</h3>
          <p>
            Sim, desde que o modelo seja bem cortado e feito com tecido com elastano. O recorte lateral cria a silhueta sem pressionar — é bem diferente de uma faixa que aperta.
          </p>

          <h3>Qual a diferença entre scrub acinturado e scrub reto?</h3>
          <p>
            O reto tem a mesma largura do busto ao quadril. O acinturado tem recorte lateral que cria entrada na cintura, valorizando as curvas sem perder a praticidade.
          </p>

          <h3>Scrub acinturado serve para todos os biotipos?</h3>
          <p>
            Sim, inclusive plus size — desde que o modelo seja proporcional ao corpo. Para mais volume, prefira recortes suaves em vez de faixas muito marcadas.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e5e0d8]">
          <p className="text-sm text-muted-foreground mb-4">Veja também:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Ver Scrubs Femininos
            </Link>
            <Link href="/blog/melhores-tecidos-scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Melhores Tecidos para Scrub
            </Link>
            <Link href="/blog/scrub-feminino-plus-size" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Scrub Feminino Plus Size
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}

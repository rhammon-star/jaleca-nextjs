import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco Feminino para Gestante: O Que Muda e Como Escolher',
  description: 'Quando trocar o jaleco na gravidez, qual modelo usar em cada trimestre e como manter o visual profissional durante a gestação.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-feminino-gestante-como-escolher' },
  openGraph: {
    title: 'Jaleco Feminino para Gestante: O Que Muda e Como Escolher',
    description: 'Quando trocar o jaleco na gravidez, qual modelo usar em cada trimestre e como manter o visual profissional durante a gestação.',
    url: 'https://jaleca.com.br/blog/jaleco-feminino-gestante-como-escolher',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco Feminino para Gestante: O Que Muda e Como Escolher',
  description: 'Quando trocar o jaleco na gravidez, qual modelo usar em cada trimestre e como manter o visual profissional durante a gestação.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-02',
  dateModified: '2026-05-02',
  url: 'https://jaleca.com.br/blog/jaleco-feminino-gestante-como-escolher',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
  {
    "@type": "Question",
    "name": "Gestante pode usar jaleco slim?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Até o final do primeiro trimestre geralmente sim. A partir do segundo trimestre, quando a barriga cresce, o jaleco reto em tamanho maior é mais confortável. O Slim Elastex em tamanho maior pode funcionar por mais tempo por causa do elastano."
    }
  },
  {
    "@type": "Question",
    "name": "Qual jaleco para gestante profissional de saúde?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Jaleco reto em 1 ou 2 tamanhos acima do habitual é a opção mais prática. O Slim Elastex em tamanho maior também funciona bem até o 6º ou 7º mês na maioria dos casos."
    }
  },
  {
    "@type": "Question",
    "name": "Quando trocar o jaleco na gravidez?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Quando o jaleco aperta na cintura ou fica desconfortável ao sentar — geralmente entre o 3º e 4º mês. Não espere apertar demais: um jaleco apertado durante a gravidez prejudica a circulação e o conforto."
    }
  },
  {
    "@type": "Question",
    "name": "Qual tamanho de jaleco comprar na gravidez?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Regra prática: pegue 1 tamanho acima do seu habitual no 1º trimestre, 2 tamanhos acima no 2º trimestre. No 3º trimestre, jaleco reto em 2 a 3 tamanhos acima ou jaleco gestante específico. Jalecos com elastano (Slim Elastex) acompanham melhor as mudanças de medida."
    }
  },
  {
    "@type": "Question",
    "name": "Jaleco com elastano é melhor para gestante?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Sim. O elastano dá stretch ao tecido, permitindo que um único tamanho sirva por mais tempo durante a gravidez. O Slim Elastex da Jaleca, por exemplo, tem composição com elastano que acompanha o corpo sem apertar."
    }
  },
  {
    "@type": "Question",
    "name": "Como lavar jaleco durante a gravidez?",
    "acceptedAnswer": {
      "@type": "Answer",
      "text": "Mesmo processo de sempre: 30°C a 40°C, sem alvejante clorado. Durante a gravidez, atenção extra a manchas: tirar mancha de sangue sempre com água fria imediata. Evitar amaciante que pode irritar pele sensível."
    }
  }
],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Gestante', item: 'https://jaleca.com.br/blog/jaleco-feminino-gestante-como-escolher' },
  ],
}

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

      <article className="container py-12 max-w-3xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Início</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <span>/</span>
          <span className="text-foreground">Jaleco Gestante</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />02 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco Feminino para Gestante: O Que Muda e Como Escolher
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            A gravidez muda completamente a relação com o jaleco. O modelo que servia perfeitamente antes pode se tornar desconfortável no segundo trimestre.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <p>
            A gravidez traz mudanças rápidas de medida — em alguns casos, 2 tamanhos em poucos meses. Entender o que muda em cada trimestre evita comprar jaleco errado (grande demais cedo, pequeno de novo rápido) e garante aparência profissional do início ao fim da gestação.
          </p>

          <h2>Guia por trimestre: qual jaleco usar em cada fase</h2>

          <h3>1º trimestre (semanas 1–13)</h3>
          <p>
            O corpo ainda não mudou muito visivelmente. Na maioria dos casos, o jaleco atual serve — mas pode já apertar na cintura se você usar corte muito justo. <strong>O que fazer:</strong> verifique se o botão central fecha sem tensão. Se apertar, este é o momento de pedir o Slim Elastex no tamanho atual — o elastano acompanha o crescimento por mais tempo.
          </p>

          <h3>2º trimestre (semanas 14–27)</h3>
          <p>
            A barriga cresce de forma mais visível. O jaleco slim regular normalmente já não fecha bem na frente. <strong>O que fazer:</strong> jaleco reto 1 tamanho acima OU Slim Elastex 1 tamanho acima. O modelo reto dá mais espaço abdominal sem parecer largo nos ombros. É o trimestre em que a maioria das profissionais troca o jaleco.
          </p>

          <h3>3º trimestre (semanas 28–40)</h3>
          <p>
            Trimestre de maior variação. A barriga cresce rápido e o volume na região lombar aumenta. <strong>O que fazer:</strong> jaleco reto 2 tamanhos acima, ou considerar jaleco especial para gestante (corte com mais espaço frontal). Evite jalecos com cinto ou amarração na cintura — pressão abdominal é desconfortável e pode ser perigosa.
          </p>

          <h2>Tabela de tamanhos: como converter durante a gravidez</h2>
          <p>Referência prática baseada nas mudanças típicas de medida por trimestre:</p>

          <div className="not-prose overflow-x-auto my-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  {['Tamanho habitual', '1º trimestre', '2º trimestre', '3º trimestre'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-normal text-xs uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['PP', 'PP', 'P ou M', 'M ou G'],
                  ['P', 'P', 'M ou G', 'G ou GG'],
                  ['M', 'M', 'G ou GG', 'GG ou G1'],
                  ['G', 'G', 'GG ou G1', 'G1 ou G2'],
                  ['GG', 'GG', 'G1 ou G2', 'G2 ou G3'],
                ].map(([base, t1, t2, t3], i) => (
                  <tr key={base} className={i % 2 === 0 ? 'bg-[#faf9f7]' : 'bg-white'}>
                    <td className="px-4 py-3 font-medium border-b border-[#e5e0d8]">{base}</td>
                    <td className="px-4 py-3 font-light border-b border-[#e5e0d8]">{t1}</td>
                    <td className="px-4 py-3 font-light border-b border-[#e5e0d8]">{t2}</td>
                    <td className="px-4 py-3 font-light border-b border-[#e5e0d8]">{t3}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-muted-foreground -mt-2 mb-6">Referência geral — cada corpo é diferente. Priorize conforto abdominal ao escolher.</p>

          <h2>Gestante pode usar jaleco slim?</h2>
          <p>Até o final do primeiro trimestre geralmente sim. A partir do segundo trimestre, quando a barriga cresce, o jaleco reto em tamanho maior é mais confortável. O <strong>Slim Elastex</strong> em tamanho maior pode funcionar por mais tempo por causa do elastano — é o modelo que mais profissionais gestantes escolhem na Jaleca.</p>

          <h2>Qual jaleco para gestante profissional de saúde?</h2>
          <p>Jaleco reto em 1 ou 2 tamanhos acima do habitual é a opção mais prática para o 2º e 3º trimestre. O Slim Elastex em tamanho maior também funciona bem até o 6º ou 7º mês na maioria dos casos. A vantagem do modelo com elastano é que ele acompanha o corpo — você compra 1 tamanho e ele dura mais.</p>

          <h2>Quando trocar o jaleco na gravidez?</h2>
          <p>Quando o jaleco aperta na cintura ou fica desconfortável ao sentar — geralmente entre o 3º e 4º mês. Não espere apertar demais: um jaleco apertado durante a gravidez prejudica a circulação e o conforto.</p>

          <h2>Como manter o visual profissional durante a gestação</h2>
          <p>
            Jaleco maior não precisa parecer folgado. Dicas práticas:
          </p>
          <ul>
            <li><strong>Escolha comprimento adequado:</strong> jalecos de comprimento médio (abaixo da cintura, acima do joelho) disfarçam melhor a barriga do que os curtos.</li>
            <li><strong>Priorize tecidos com queda:</strong> tergal e viscose caem melhor do que algodão, que tende a volumar na frente.</li>
            <li><strong>Bordado no jaleco maior:</strong> ter o nome/especialidade bordado no jaleco de gestante reforça a identidade profissional mesmo em tamanho diferente.</li>
            <li><strong>Cor neutra:</strong> branco e azul clarinho disfarçam melhor as variações de volume do que cores escuras em tamanhos maiores.</li>
          </ul>
        </div>

        <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
          <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
            <Link href="/categoria/jalecos-femininos" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco feminino: guia completo por especialidade</Link>
          <div className="flex flex-col gap-2">
            <Link href="/jaleco-plus-size" className="text-[#c4a97d] hover:underline text-sm">→ Ver jalecos plus size e tamanhos maiores</Link>
            <Link href="/blog/jaleco-feminino-tamanho-certo-como-medir" className="text-[#c4a97d] hover:underline text-sm">→ Como medir e escolher o tamanho certo</Link>
            <Link href="/blog/jaleco-slim-vs-jaleco-reto-diferencas" className="text-[#c4a97d] hover:underline text-sm">→ Slim vs reto: qual a diferença</Link>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jalecos em tamanhos G, G2 e G3</h3>
          <p className="text-muted-foreground mb-4">Modelos com mais espaço para gestantes e plus size. Slim Elastex e Slim Tradicional do PP ao G3.</p>
          <Link href="/categoria/jalecos-femininos" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Jalecos Femininos →
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t">
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            ← Voltar para o blog
          </Link>
        </div>
      </article>
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import ProductCard from '@/components/ProductCard'
import { CheckCircle, ShieldCheck, Truck, RotateCcw, ChevronDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco para Dentista: Guia Completo 2026 | Jaleca',
  description: 'Tudo sobre jaleco para dentista: qual modelo escolher, jaleco branco ou colorido, normas do CRO, cuidados e os melhores modelos com elastano do PP ao G3. Frete grátis SP/RJ/MG/ES.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-para-dentista' },
  openGraph: {
    title: 'Jaleco para Dentista: Guia Completo 2026',
    description: 'Qual jaleco usar na odontologia? Guia completo com modelos, normas do CRO, cuidados e comparação Slim vs Tradicional vs Dolmã.',
    url: 'https://jaleca.com.br/jaleco-para-dentista',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
}

const faqItems = [
  {
    q: 'Qual o melhor tecido para jaleco de dentista?',
    a: 'Tecidos como gabardine, oxfordine e microfibra são ótimas opções: duram muito, têm bom caimento e são fáceis de lavar. Com elastano, o jaleco ainda oferece conforto extra nos movimentos repetitivos dos procedimentos.',
  },
  {
    q: 'Dentista pode usar jaleco colorido?',
    a: 'Sim. O CRO não proíbe — é o ambiente que define. Em clínicas pediátricas, cores deixam o ambiente mais acolhedor. Em clínicas de alto padrão, o branco ou o off-white costumam ser a escolha. A Jaleca tem 12 cores.',
  },
  {
    q: 'Jaleco de dentista precisa ser branco?',
    a: 'Não é obrigação. O branco é o clássico da saúde e transmite higiene, mas tons pastel e cores discretas são aceitos na maioria dos ambientes. O que importa é que esteja sempre limpo e bem conservado.',
  },
  {
    q: 'Com que frequência devo lavar o jaleco?',
    a: 'Idealmente após cada turno de trabalho. O jaleco acumula microrganismos durante os procedimentos, então precisa ser higienizado todo dia. Lave separado das roupas pessoais para evitar contaminação cruzada.',
  },
  {
    q: 'Qual a diferença entre jaleco e dolmã?',
    a: 'O jaleco é mais longo, cobre bem a roupa e é o padrão na odontologia para atendimento direto ao paciente. A dolmã tem corte mais curto e é uma opção confortável para rotinas menos formais ou uso em laboratório.',
  },
  {
    q: 'Jaleco com elastano é bom para dentista?',
    a: 'Muito bom. O elastano dá flexibilidade nos movimentos — essencial para quem fica horas inclinado sobre o paciente. Reduz a fadiga e garante que o jaleco não "prenda" durante os procedimentos.',
  },
  {
    q: 'Como evitar que o jaleco branco amarele?',
    a: 'Lave em água fria com sabão neutro, evite alvejante com cloro e seque à sombra. Nunca deixe o jaleco molhado dobrado por muito tempo. Para manchas específicas, trate antes de lavar a peça inteira.',
  },
  {
    q: 'Jaleco slim é adequado para dentista?',
    a: 'Sim. O corte slim tem ótima aparência profissional e, quando feito com elastano, não restringe os movimentos. É a escolha de dentistas que querem unir elegância com funcionalidade no dia a dia.',
  },
]

const modelos = [
  {
    nome: 'Jaleco Slim',
    indicado: 'Dentistas que buscam visual moderno e conforto',
    vantagens: 'Corte ajustado, valoriza a silhueta, alta mobilidade com elastano, elegante',
    desvantagem: 'Pode ser percebido como menos "tradicional" em alguns ambientes',
  },
  {
    nome: 'Jaleco Tradicional',
    indicado: 'Quem prefere caimento clássico e mais solto',
    vantagens: 'Mais espaçoso, bolsos amplos, atemporal, ótimo para longas jornadas',
    desvantagem: 'Visual menos contemporâneo para quem quer algo mais estiloso',
  },
  {
    nome: 'Dolmã',
    indicado: 'Rotinas menos formais, laboratório, uso alternativo',
    vantagens: 'Leveza máxima, muito confortável, respirável, versátil',
    desvantagem: 'Menor formalidade para atendimento direto ao paciente',
  },
]

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map(item => ({
    '@type': 'Question',
    name: item.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.a,
    },
  })),
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Dentista: Guia Completo 2026',
  description: 'Tudo sobre jaleco para dentista: qual modelo escolher, jaleco branco ou colorido, normas do CRO e cuidados.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: {
    '@type': 'Organization',
    name: 'Jaleca',
    logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
  },
  url: 'https://jaleca.com.br/jaleco-para-dentista',
  datePublished: '2026-04-18',
  dateModified: '2026-04-18',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Jalecos', item: 'https://jaleca.com.br/produtos?categoria=jalecos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco para Dentista', item: 'https://jaleca.com.br/jaleco-para-dentista' },
  ],
}

async function getJalecos(): Promise<WooProduct[]> {
  try {
    const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(GET_PRODUCTS, {
      first: 6,
      category: 'jalecos',
    })
    return data?.products?.nodes ?? []
  } catch {
    return []
  }
}

export default async function JalecoDentistaPage() {
  const produtos = await getJalecos()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

      <main>
        {/* Breadcrumb */}
        <div className="bg-muted/40 border-b border-border">
          <div className="container py-3">
            <nav className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link href="/produtos?categoria=jalecos" className="hover:text-foreground transition-colors">Jalecos</Link>
              <span>/</span>
              <span className="text-foreground">Para Dentista</span>
            </nav>
          </div>
        </div>

        {/* Hero */}
        <section className="bg-[#f9f7f4] border-b border-border py-14 md:py-20">
          <div className="container max-w-4xl text-center">
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-4">Guia Completo</p>
            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-semibold mb-5 leading-tight">
              Jaleco para Dentista
            </h1>
            <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              Escolher o <strong>jaleco para dentista</strong> ideal vai além da aparência. É proteção, conforto e imagem profissional — tudo junto. Aqui você encontra o guia completo para fazer a melhor escolha.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/produtos?categoria=jalecos-femininos"
                className="inline-flex items-center gap-2 bg-foreground text-background px-6 py-3 text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity"
              >
                Ver Jalecos Femininos
              </Link>
              <Link
                href="/produtos?categoria=jalecos-masculinos"
                className="inline-flex items-center gap-2 border border-border px-6 py-3 text-sm font-semibold tracking-wide hover:bg-muted transition-colors"
              >
                Ver Jalecos Masculinos
              </Link>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section className="border-b border-border bg-background">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
              {[
                { icon: CheckCircle, text: 'PP ao G3' },
                { icon: ShieldCheck, text: 'Tecido com elastano' },
                { icon: Truck, text: 'Frete grátis SE +R$499' },
                { icon: RotateCcw, text: 'Troca em 30 dias' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center justify-center gap-2 py-4 px-3 text-xs font-medium text-muted-foreground">
                  <Icon size={14} className="text-primary shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="container max-w-4xl py-12 md:py-16 space-y-16">

          {/* Guia Completo */}
          <article className="prose prose-neutral max-w-none">

            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6">O que o dentista usa no dia a dia</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O dia a dia de um dentista exige muito mais que um jaleco. A biossegurança é prioridade, então a vestimenta completa é essencial. Além do jaleco, você usa touca para proteção dos cabelos, máscara para filtrar partículas e aerossóis, e óculos de proteção para resguardar os olhos. As luvas descartáveis são indispensáveis para cada procedimento.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Muitos profissionais optam por usar um conjunto scrub por baixo do jaleco. Ele garante conforto e mobilidade, além de ser fácil de higienizar — uma escolha prática para longas jornadas. O calçado também importa: fechado, impermeável e antiderrapante é o padrão.
            </p>

            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6 mt-10">Por que o jaleco é obrigatório na odontologia</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O jaleco funciona como barreira física contra respingos de sangue, saliva, produtos químicos e fluidos corporais. Isso reduz o risco de contaminação por microrganismos e acidentes durante os procedimentos.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Além da proteção individual, ele evita a contaminação cruzada — impede que microrganismos da roupa pessoal cheguem ao ambiente clínico, e vice-versa. E transmite confiança: pacientes se sentem mais seguros ao ver o dentista com a vestimenta correta.
            </p>

            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6 mt-10">Como escolher o jaleco ideal para dentista</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O tecido é o primeiro ponto. Opte por materiais duráveis e fáceis de lavar. O elastano — presente nos jalecos da Jaleca — é um diferencial: proporciona flexibilidade e evita aquela sensação de roupa que "prende" durante os procedimentos.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O conforto é essencial para jornadas longas. Prefira modelos que não apertem e permitam ventilação da pele. O tamanho também importa: na Jaleca, você encontra do PP ao G3, garantindo que todas as profissionais encontrem o caimento ideal.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Bolsos são um detalhe prático e muito útil. Pense em quantos você precisa para canetas, instrumentos e pequenos acessórios do dia a dia.
            </p>

            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6 mt-10">Jaleco branco ou colorido: qual usar?</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O branco é o clássico — sinônimo de higiene e assepsia, valores muito importantes na área da saúde. Muitos profissionais e pacientes ainda associam o branco à máxima seriedade. É uma escolha atemporal.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Mas os jalecos coloridos ganharam espaço. A Jaleca oferece 12 cores, permitindo personalizar o uniforme ou combinar com a identidade visual da clínica. Em clínicas pediátricas, cores ajudam a criar um ambiente mais acolhedor para as crianças.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O CRO não restringe a cor do jaleco. O que vale é que esteja sempre limpo e em bom estado de conservação.
            </p>

            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6 mt-10">Cuidados com o jaleco do dentista</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A regra de ouro é lavagem diária — o jaleco acumula microrganismos durante o trabalho. Lave separado das roupas pessoais para evitar contaminação cruzada.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-muted-foreground text-sm mb-4">
              <li>Use água fria ou morna, conforme a etiqueta</li>
              <li>Sabão neutro — evite alvejante com cloro em jalecos coloridos</li>
              <li>Seque à sombra ou em secadora com temperatura baixa</li>
              <li>Passe a ferro na temperatura adequada ao tecido</li>
              <li>Guarde limpo em local arejado, separado das roupas pessoais</li>
            </ul>

            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-6 mt-10">Normas do CRO sobre vestimenta</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              O Conselho Regional de Odontologia, alinhado com a ANVISA, estabelece que o jaleco seja de uso exclusivo do ambiente de trabalho — não deve ser usado fora da clínica ou consultório.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              A vestimenta deve estar sempre limpa e em bom estado. O uso de EPIs é mandatório: jaleco, luvas, máscaras, óculos e touca. Não há norma específica sobre cor — o que importa é que transmita higiene e profissionalismo.
            </p>

          </article>

          {/* Comparação de Modelos */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">Comparação de Modelos</h2>
            <p className="text-muted-foreground text-sm mb-6">Slim, Tradicional ou Dolmã — qual faz mais sentido para a sua rotina?</p>
            <div className="overflow-x-auto rounded-sm border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/60 border-b border-border">
                    <th className="text-left px-4 py-3 font-semibold text-xs tracking-wide uppercase">Modelo</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs tracking-wide uppercase">Indicado para</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs tracking-wide uppercase">Vantagens</th>
                    <th className="text-left px-4 py-3 font-semibold text-xs tracking-wide uppercase hidden md:table-cell">Ponto de atenção</th>
                  </tr>
                </thead>
                <tbody>
                  {modelos.map((m, i) => (
                    <tr key={m.nome} className={`border-b border-border last:border-0 ${i % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}>
                      <td className="px-4 py-4 font-semibold text-foreground whitespace-nowrap">{m.nome}</td>
                      <td className="px-4 py-4 text-muted-foreground">{m.indicado}</td>
                      <td className="px-4 py-4 text-muted-foreground">{m.vantagens}</td>
                      <td className="px-4 py-4 text-muted-foreground hidden md:table-cell">{m.desvantagem}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Produtos */}
          {produtos.length > 0 && (
            <section>
              <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">Jalecos recomendados para dentista</h2>
              <p className="text-muted-foreground text-sm mb-8">Tecido com elastano, do PP ao G3, entrega para todo o Brasil.</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {produtos.slice(0, 6).map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  href="/produtos?categoria=jalecos"
                  className="inline-flex items-center gap-2 border border-border px-8 py-3 text-sm font-semibold tracking-wide hover:bg-muted transition-colors"
                >
                  Ver todos os jalecos
                </Link>
              </div>
            </section>
          )}

          {/* FAQ */}
          <section>
            <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2">Perguntas frequentes</h2>
            <p className="text-muted-foreground text-sm mb-8">Dúvidas comuns de dentistas na hora de escolher o jaleco.</p>
            <div className="space-y-2">
              {faqItems.map((item) => (
                <details
                  key={item.q}
                  className="group border border-border"
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-sm font-medium text-foreground hover:bg-muted/30 transition-colors">
                    {item.q}
                    <ChevronDown size={16} className="text-muted-foreground shrink-0 group-open:rotate-180 transition-transform duration-200" />
                  </summary>
                  <div className="px-5 pb-5 pt-3 text-sm text-muted-foreground leading-relaxed border-t border-border">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* Posts relacionados */}
          <section>
            <h2 className="font-display text-xl font-semibold mb-6">Leia também</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { title: 'Como cuidar do jaleco profissional', href: '/blog/como-lavar-jaleco', desc: 'Passo a passo para lavar, secar e conservar seu jaleco por mais tempo.' },
                { title: 'Jaleco Slim ou Tradicional: qual escolher?', href: '/blog', desc: 'Entenda as diferenças de caimento, modelagem e uso de cada estilo.' },
                { title: 'Conjuntos Scrub para profissionais da saúde', href: '/produtos?categoria=conjuntos', desc: 'Uma alternativa confortável para quem usa jaleco por baixo.' },
              ].map(post => (
                <Link
                  key={post.href}
                  href={post.href}
                  className="border border-border p-5 hover:bg-muted/30 transition-colors group"
                >
                  <h3 className="font-semibold text-sm mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{post.desc}</p>
                </Link>
              ))}
            </div>
          </section>

          {/* CTA Final */}
          <section className="bg-[#f9f7f4] border border-border p-8 md:p-12 text-center">
            <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-3">200.000+ peças vendidas · 4.9/5 estrelas</p>
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4">
              Encontre o jaleco certo para você
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-sm leading-relaxed">
              Do PP ao G3. Elastano para máximo conforto. 12 cores. Frete grátis no Sudeste acima de R$499.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link
                href="/produtos?categoria=jalecos-femininos"
                className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-3.5 text-sm font-semibold tracking-wide hover:opacity-90 transition-opacity"
              >
                Ver Jalecos Femininos
              </Link>
              <Link
                href="/produtos?categoria=jalecos-masculinos"
                className="inline-flex items-center gap-2 border border-border bg-background px-7 py-3.5 text-sm font-semibold tracking-wide hover:bg-muted transition-colors"
              >
                Ver Jalecos Masculinos
              </Link>
            </div>
          </section>

        </div>
      </main>
    </>
  )
}

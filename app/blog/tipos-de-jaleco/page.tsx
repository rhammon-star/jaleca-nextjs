import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Tipos de Jaleco: Guia Completo para Escolher o Modelo Certo',
  description: 'Todos os tipos de jaleco explicados: Slim, Princesa, Duquesa, Elastex, manga curta, scrub e dólmã. Qual tipo de jaleco usar em cada profissão e ambiente.',
  keywords: 'tipos de jaleco, tipo de jaleco, tipos de jalecos, tipos de jaleco feminino, quais os tipos de jaleco, tipos de jaleco médico, jaleco slim, jaleco princesa, jaleco elastex',
  alternates: { canonical: 'https://jaleca.com.br/blog/tipos-de-jaleco' },
  openGraph: {
    title: 'Tipos de Jaleco: Guia Completo',
    description: 'Slim, Princesa, Duquesa, Elastex, manga curta e scrub — todos os tipos de jaleco explicados com qual profissão e ambiente cada um serve melhor.',
    url: 'https://jaleca.com.br/blog/tipos-de-jaleco',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Tipos de Jaleco: Guia Completo para Escolher o Modelo Certo',
  description: 'Todos os tipos de jaleco explicados com quando usar cada um: Slim, Princesa, Duquesa, Elastex, manga curta e scrub.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: {
    '@type': 'Organization',
    name: 'Jaleca',
    logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
    url: 'https://jaleca.com.br',
  },
  datePublished: '2026-05-05',
  dateModified: '2026-05-05',
  url: 'https://jaleca.com.br/blog/tipos-de-jaleco',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Quais são os tipos de jaleco?',
      acceptedAnswer: { '@type': 'Answer', text: 'Os principais tipos de jaleco são: (1) Jaleco Slim — corte acinturado para médicas e dentistas de consultório; (2) Jaleco Princesa — modelagem evasê, mais solto; (3) Jaleco Duquesa — manga longa com punho, mais formal; (4) Jaleco Elastex — tecido com elastano para plantões longos; (5) Jaleco manga curta — mais leve para ambientes quentes; (6) Scrub — conjunto blusa + calça para centro cirúrgico e UTI; (7) Dólmã — abertura lateral, usado em cirurgias e gastronomia.' },
    },
    {
      '@type': 'Question',
      name: 'Qual tipo de jaleco é melhor para médica?',
      acceptedAnswer: { '@type': 'Answer', text: 'Para médica em consultório: Jaleco Slim (elegante, acinturado). Para médica em plantão ou UTI: Jaleco Elastex ou scrub (mais confortável em 12h). Para médica em função de direção ou apresentações: Jaleco Duquesa (manga longa, máxima formalidade).' },
    },
    {
      '@type': 'Question',
      name: 'Qual a diferença entre jaleco Slim e jaleco reto?',
      acceptedAnswer: { '@type': 'Answer', text: 'O jaleco Slim tem recortes laterais que seguem a silhueta do corpo — corte acinturado. O jaleco reto tem corte tubular, sem recortes — cai reto do ombro ao comprimento final. O Slim é mais elegante para consultório; o reto é mais amplo e indicado para quem precisa de mais movimento ou prefere modelagem mais solta.' },
    },
    {
      '@type': 'Question',
      name: 'Tipos de jaleco feminino: quais existem?',
      acceptedAnswer: { '@type': 'Answer', text: 'Os tipos de jaleco feminino são: Slim (acinturado, mais elegante), Princesa (evasê, mais solto na parte inferior), Duquesa (manga longa com punho, mais formal), Elastex (tecido com elastano para movimento), manga curta (leve e confortável) e Plus Size — todos com molde próprio para o corpo feminino, do PP ao G3.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Tipos de Jaleco', item: 'https://jaleca.com.br/blog/tipos-de-jaleco' },
  ],
}

const TIPOS = [
  {
    numero: '01',
    nome: 'Jaleco Slim',
    perfil: 'O mais elegante — para consultório e atendimento presencial',
    desc: 'O jaleco Slim tem recortes laterais que seguem a silhueta do corpo — o resultado é um jaleco acinturado que valoriza a figura sem apertar. É o modelo mais escolhido por médicas e dentistas de consultório que querem transmitir autoridade e elegância simultâneas.',
    tecido: 'Gabardine com elastano 4-6% ou Microfibra premium',
    indicado: 'Médica, dentista, nutricionista, farmacêutica, psicóloga',
    quando: 'Consultório, clínica privada, atendimento presencial',
    href: '/jaleco-feminino',
  },
  {
    numero: '02',
    nome: 'Jaleco Princesa',
    perfil: 'Leveza e fluidez — para quem prefere modelagem mais solta',
    desc: 'O jaleco Princesa tem cava americana e modelagem levemente evasê na parte inferior — mais solto que o Slim sem perder o visual profissional. É o preferido de profissionais que ficam muito em movimento ou preferem uma modelagem menos estruturada no dia a dia.',
    tecido: 'Gabardine leve ou Microfibra com elastano',
    indicado: 'Nutricionista, esteticista, fisioterapeuta, psicóloga, veterinária',
    quando: 'Clínicas de estética, consultório de bem-estar, fisioterapia',
    href: '/jaleco-feminino',
  },
  {
    numero: '03',
    nome: 'Jaleco Duquesa',
    perfil: 'Formalidade máxima — para quem quer transmitir autoridade',
    desc: 'O jaleco Duquesa tem manga longa com punho trabalhado e acabamento em alfaiataria premium. É o modelo mais formal e sofisticado da linha — escolhido por médicas em direção clínica, professoras universitárias e profissionais em ambientes de alto padrão.',
    tecido: 'Gabardine pesado 200-240 g/m² ou Oxford premium',
    indicado: 'Médica chefe, professora, pesquisadora, médica em hospital formal',
    quando: 'Hospital de alto padrão, apresentações acadêmicas, direção clínica',
    href: '/jaleco-elegante',
  },
  {
    numero: '04',
    nome: 'Jaleco Elastex',
    perfil: 'Mobilidade total — para plantões longos e movimento constante',
    desc: 'O jaleco Elastex usa tecido com elastano bidirecional — cede nos dois eixos, não só em um. O resultado é o jaleco com maior amplitude de movimento, indicado para fisioterapeutas, enfermeiras em plantão e qualquer profissional que fica em movimento constante por horas.',
    tecido: 'Elastex (poliéster + elastano bidirecional) 140-160 g/m²',
    indicado: 'Fisioterapeuta, enfermeira, técnica de enfermagem, massoterapeuta',
    quando: 'Plantão 12h+, fisioterapia, procedimentos com movimento intenso',
    href: '/jaleco-feminino',
  },
  {
    numero: '05',
    nome: 'Jaleco Manga Curta',
    perfil: 'Leveza — para ambientes quentes ou procedimentos dentários',
    desc: 'O jaleco manga curta é a versão mais leve — elimina o calor extra das mangas longas e oferece mais liberdade de movimento para os braços. É o modelo preferido de dentistas, esteticistas e profissionais que trabalham em clínicas com temperatura mais alta.',
    tecido: 'Gabardine com elastano, mesmo tecido do manga longa mas com menos cobertura',
    indicado: 'Dentista, esteticista, médico em clínica com calor, terapeuta',
    quando: 'Clínicas quentes, procedimentos odontológicos, estética',
    href: '/categoria/jalecos-manga-curta',
  },
  {
    numero: '06',
    nome: 'Scrub (conjunto)',
    perfil: 'Conforto extremo — para centro cirúrgico, UTI e plantões',
    desc: 'Scrub não é tecnicamente um jaleco — é um conjunto de blusa e calça desenvolvido para uso em ambientes hospitalares de alta intensidade. Mais confortável para jornadas de 12h do que qualquer jaleco. O scrub feminino da Jaleca tem corte para o corpo feminino, não é o masculino adaptado.',
    tecido: 'Microfibra com elastano ou gabardine leve',
    indicado: 'Enfermeira, técnica de enfermagem, médica de plantão, anestesista',
    quando: 'Centro cirúrgico, UTI, pronto-socorro, plantão longo',
    href: '/categoria/conjuntos-femininos',
  },
  {
    numero: '07',
    nome: 'Dólmã',
    perfil: 'Mobilidade de braço — para cirurgia e gastronomia',
    desc: 'A dólmã tem abertura lateral (não frontal como o jaleco) e mangas mais curtas. É muito usada em centros cirúrgicos e na gastronomia profissional. A abertura lateral facilita a vestimenta e a retirada da peça sem contaminar o ambiente.',
    tecido: 'Gabardine ou tecido específico antiderrapante (gastronomia)',
    indicado: 'Cirurgião, anestesista, profissional de gastronomia, esteticista',
    quando: 'Centro cirúrgico, cozinha profissional, procedimentos estéticos',
    href: '/categoria/domas',
  },
]

export default function Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

      <main className="container max-w-3xl py-10 px-4">

        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">Início</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground transition-colors">Blog</Link>
          <span>/</span>
          <span className="text-foreground">Tipos de Jaleco</span>
        </nav>

        {/* META */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> 05 mai 2026</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 8 min de leitura</span>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4 leading-tight">
          Tipos de jaleco: guia completo para escolher o modelo certo
        </h1>

        <p className="text-muted-foreground text-base leading-relaxed mb-4">
          Não existe um tipo de jaleco único para todas as situações. O jaleco Slim para consultório não é o mesmo que o Elastex para plantão — e o scrub para o centro cirúrgico tem função completamente diferente da dólmã da gastronomia.
        </p>
        <p className="text-muted-foreground text-base leading-relaxed mb-8">
          Este guia explica cada tipo de jaleco, quando usar cada um e qual é o indicado para sua profissão.
        </p>

        <hr className="border-border mb-8" />

        {/* RESUMO RÁPIDO */}
        <section className="mb-10">
          <h2 className="font-display text-2xl font-semibold mb-4">Resumo: 7 tipos de jaleco</h2>
          <div className="overflow-x-auto mb-4">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="text-left p-3">Tipo</th>
                  <th className="text-left p-3">Melhor para</th>
                  <th className="text-left p-3">Ambiente</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  { tipo: 'Slim (acinturado)', para: 'Médica, dentista', ambiente: 'Consultório, clínica' },
                  { tipo: 'Princesa (evasê)', para: 'Nutricionista, fisioterapeuta', ambiente: 'Clínica de bem-estar' },
                  { tipo: 'Duquesa (manga longa formal)', para: 'Médica chefe, professora', ambiente: 'Hospital formal, academia' },
                  { tipo: 'Elastex (elastano total)', para: 'Fisioterapeuta, enfermeira', ambiente: 'Plantão, procedimento' },
                  { tipo: 'Manga curta', para: 'Dentista, esteticista', ambiente: 'Clínica quente, estética' },
                  { tipo: 'Scrub (conjunto)', para: 'Enfermeira, técnica', ambiente: 'Centro cirúrgico, UTI' },
                  { tipo: 'Dólmã', para: 'Cirurgião, gastrônomo', ambiente: 'Cirurgia, cozinha profissional' },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-border ${i % 2 === 0 ? '' : 'bg-muted/30'}`}>
                    <td className="p-3 font-medium text-foreground">{row.tipo}</td>
                    <td className="p-3">{row.para}</td>
                    <td className="p-3">{row.ambiente}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* TIPOS DETALHADOS */}
        <section className="mb-10">
          <h2 className="font-display text-2xl font-semibold mb-6">Os 7 tipos de jaleco em detalhe</h2>
          <div className="space-y-8">
            {TIPOS.map((tipo) => (
              <div key={tipo.numero} className="border border-border">
                <div className="bg-[#f9f7f4] px-5 py-4 flex items-start gap-4">
                  <span className="font-display text-3xl font-light text-[#c4a97d] leading-none mt-1">{tipo.numero}</span>
                  <div>
                    <strong className="block text-base font-semibold">{tipo.nome}</strong>
                    <span className="text-sm text-muted-foreground italic">{tipo.perfil}</span>
                  </div>
                </div>
                <div className="p-5 space-y-3">
                  <p className="text-sm text-muted-foreground leading-relaxed">{tipo.desc}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Tecido</p>
                      <p className="text-xs text-foreground">{tipo.tecido}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Indicado para</p>
                      <p className="text-xs text-foreground">{tipo.indicado}</p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Ambiente</p>
                      <p className="text-xs text-foreground">{tipo.quando}</p>
                    </div>
                  </div>
                  <Link href={tipo.href} className="inline-block text-xs text-[#c4a97d] hover:underline mt-1">
                    Ver modelos deste tipo →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="font-display text-2xl font-semibold mb-4">Perguntas frequentes sobre tipos de jaleco</h2>
          <div className="space-y-1 border border-border divide-y divide-border">
            {[
              { q: 'Quais são os tipos de jaleco?', a: 'Os 7 tipos principais são: Slim (acinturado), Princesa (evasê), Duquesa (manga longa formal), Elastex (elastano bidirecional), manga curta, scrub (conjunto) e dólmã (abertura lateral). Cada um tem uma proposta diferente de corte, tecido e ambiente de uso.' },
              { q: 'Qual tipo de jaleco feminino é mais elegante?', a: 'O Jaleco Slim é o mais elegante para consultório — corte acinturado, sem exageros. Para máxima formalidade, o Jaleco Duquesa com manga longa e punho trabalhado é o mais sofisticado.' },
              { q: 'Tipos de jaleco para enfermagem: quais usar?', a: 'Para enfermagem: Elastex (plantões longos, máxima mobilidade), Slim (clínicas privadas com atendimento presencial) ou scrub (ambiente hospitalar, UTI, centro cirúrgico). O COFEN não define o tipo de jaleco — o protocolo é da instituição.' },
              { q: 'Jaleco tipo médico: o que significa?', a: 'Jaleco tipo médico geralmente refere-se ao jaleco tradicional de manga longa, branco, com abertura frontal e bolsos — o modelo clássico associado ao médico. Na prática, pode ser o Slim, o Reto ou o Duquesa, dependendo da preferência e do ambiente.' },
            ].map((item, i) => (
              <details key={i} className="p-4">
                <summary className="cursor-pointer text-sm font-medium text-foreground list-none flex justify-between items-center gap-4">
                  {item.q}
                  <span className="text-muted-foreground text-lg font-light flex-shrink-0">+</span>
                </summary>
                <p className="text-sm text-muted-foreground leading-relaxed mt-3 pt-3 border-t border-border">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* LINKS INTERNOS */}
        <section className="mb-8">
          <h3 className="text-sm font-semibold mb-3 tracking-wide uppercase text-muted-foreground">Leia também</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { href: '/blog/o-que-e-jaleco', label: 'O que é jaleco' },
              { href: '/modelo-de-jaleco', label: 'Modelos de jaleco feminino' },
              { href: '/jaleco-feminino', label: 'Jaleco feminino — guia completo' },
              { href: '/jaleco-elegante', label: 'Jaleco elegante e alfaiataria' },
              { href: '/jaleco-azul-marinho', label: 'Jaleco azul marinho' },
              { href: '/categoria/jalecos', label: 'Ver todos os jalecos' },
            ].map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-muted-foreground border border-border px-3 py-1.5 hover:text-foreground hover:border-foreground transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-[#f9f7f4] border border-border p-6 text-center">
          <p className="font-display text-xl font-semibold mb-2">Escolha o tipo de jaleco certo para você</p>
          <p className="text-sm text-muted-foreground mb-4">Slim, Princesa, Duquesa ou Elastex. Do PP ao G3, 12 cores. Entrega para todo o Brasil.</p>
          <Link href="/modelo-de-jaleco" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white text-xs uppercase tracking-widest hover:bg-[#333] transition-colors">
            Ver todos os modelos ↗
          </Link>
        </div>

      </main>
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco ou Scrub: Qual Escolher para o Consultório? | Jaleca',
  description: 'Jaleco ou scrub para o consultório? Compare os dois por profissão: médica, dentista, enfermeira, fisioterapeuta e nutricionista. Quando cada um funciona melhor.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-ou-scrub-consultorio' },
  openGraph: {
    title: 'Jaleco ou Scrub: Qual Escolher para o Consultório?',
    description: 'Comparação direta: jaleco vs scrub por profissão e ambiente. Guia para médicas, dentistas, enfermeiras e fisioterapeutas.',
    url: 'https://jaleca.com.br/blog/jaleco-ou-scrub-consultorio',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco ou Scrub: Qual Escolher para o Consultório?',
  description: 'Comparação jaleco vs scrub por profissão. Quando cada uniforme é a melhor escolha.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-01',
  dateModified: '2026-05-01',
  url: 'https://jaleca.com.br/blog/jaleco-ou-scrub-consultorio',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Jaleco ou scrub: qual é mais profissional?',
      acceptedAnswer: { '@type': 'Answer', text: 'Os dois são igualmente profissionais — a percepção depende do contexto. Jaleco transmite mais autoridade clínica em consultório presencial (o paciente associa jaleco à consulta médica tradicional). Scrub transmite funcionalidade e dinamismo — é associado a ambientes hospitalares, plantões e procedimentos. Em dermatologia estética ou nutrição, um jaleco slim colorido pode ser mais adequado que o scrub.' },
    },
    {
      '@type': 'Question',
      name: 'Médica deve usar jaleco ou scrub?',
      acceptedAnswer: { '@type': 'Answer', text: 'Depende da especialidade e do ambiente. Médicas de consultório (clínica geral, pediatria, ginecologia, dermatologia) geralmente preferem jaleco — transmite mais autoridade clínica para o paciente. Médicas de plantão, UTI e pronto-socorro preferem scrub — mais prático, mais confortável em 12h de jornada e aceito institucionalmente em ambientes hospitalares.' },
    },
    {
      '@type': 'Question',
      name: 'Enfermeira pode usar jaleco em vez de scrub?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim. O COFEN não proíbe jaleco para enfermeiros. Em clínicas particulares e consultórios, enfermeiros usam jaleco normalmente. Em hospitais públicos e UBSs, o scrub ou o uniforme institucional costuma ser o padrão definido pela instituição — não pelo COFEN.' },
    },
    {
      '@type': 'Question',
      name: 'Fisioterapeuta: jaleco ou scrub?',
      acceptedAnswer: { '@type': 'Answer', text: 'Fisioterapeutas em clínicas particulares usam os dois. O jaleco slim elastex é o preferido para clínicas de estética e pilates clínico — visual mais elegante. O scrub é preferido para fisioterapia esportiva, ortopédica e em ambiente hospitalar — mais liberdade de movimento. Em pediatria, jaleco colorido é muito comum (menos intimidador para crianças).' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco ou Scrub', item: 'https://jaleca.com.br/blog/jaleco-ou-scrub-consultorio' },
  ],
}

const COMPARACAO = [
  { criterio: 'Autoridade clínica no consultório', jaleco: '★★★★★', scrub: '★★★' },
  { criterio: 'Conforto em plantão de 12h', jaleco: '★★★', scrub: '★★★★★' },
  { criterio: 'Liberdade de movimento', jaleco: '★★★★ (com elastano)', scrub: '★★★★★' },
  { criterio: 'Facilidade de lavagem', jaleco: '★★★★', scrub: '★★★★★' },
  { criterio: 'Identidade visual da clínica', jaleco: '★★★★★', scrub: '★★★★' },
  { criterio: 'Custo médio por peça', jaleco: 'Médio-alto', scrub: 'Médio' },
]

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
          <span className="text-foreground">Jaleco ou Scrub</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />1 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco ou Scrub: Qual Escolher para o Consultório?
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Não existe resposta única — existe a resposta certa para o seu ambiente, sua especialidade e o que você quer comunicar. Guia direto por profissão.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>A diferença fundamental entre jaleco e scrub</h2>
          <p>
            <strong>Jaleco</strong> é uma peça única com botões frontais, usada por cima da roupa. Transmite autoridade clínica — o paciente o associa à consulta médica, à competência técnica, à relação formal profissional-paciente.
          </p>
          <p>
            <strong>Scrub</strong> é um conjunto (calça + blusa) que substitui a roupa. É a roupa em si, não uma sobreposição. Transmite funcionalidade, movimento, dinamismo — o paciente o associa ao ambiente hospitalar, a procedimentos, a jornadas longas.
          </p>
          <p>
            A escolha entre os dois depende do que você quer comunicar — e de onde você trabalha.
          </p>

          <h2>Por profissão: o que cada uma escolhe e por quê</h2>

          <h3>Médica de consultório</h3>
          <p>
            Jaleco, sem dúvida. Em consultas presenciais, o jaleco reforça a hierarquia clínica e a percepção de autoridade — o paciente está entregando sua saúde a alguém que ele precisa confiar rapidamente. O jaleco comunica isso antes de qualquer palavra.
          </p>

          <h3>Médica de plantão / UTI / PS</h3>
          <p>
            Scrub. Em 12 horas de jornada com muito movimento, procedimentos e trocas frequentes, o scrub é mais prático, mais lavável e mais aceito institucionalmente. Muitos hospitais já definem o scrub como uniforme padrão para internação.
          </p>

          <h3>Dentista</h3>
          <p>
            Jaleco — especialmente o manga curta com elastano. Em odontologia, o jaleco por cima da roupa é o padrão de consultório. O scrub é menos comum em odontologia, exceto em centros cirúrgicos odontológicos.
          </p>

          <h3>Enfermeira</h3>
          <p>
            Depende do ambiente. Em clínica particular: jaleco ou scrub são igualmente aceitos. Em hospital público e UBS: o uniforme institucional (geralmente scrub ou jaleco branco definido pela chefia) é o padrão.
          </p>

          <h3>Fisioterapeuta</h3>
          <p>
            Os dois convivem. Clínicas de pilates clínico e fisioterapia estética preferem o jaleco slim — mais elegante, melhor para a identidade visual da clínica. Fisioterapia ortopédica e esportiva prefere o scrub — mais liberdade de movimento para demonstrar exercícios e agachar.
          </p>

          <h3>Nutricionista</h3>
          <p>
            Jaleco quase sempre — especialmente o slim colorido. A nutricionista em consultório usa o jaleco como ferramenta de imagem: cor verde associa à saúde, rosê ao acolhimento. O scrub raramente aparece em nutrição clínica.
          </p>

          <h2>Comparação direta</h2>
          <div className="overflow-x-auto not-prose mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="text-left p-3">Critério</th>
                  <th className="text-left p-3">Jaleco</th>
                  <th className="text-left p-3">Scrub</th>
                </tr>
              </thead>
              <tbody>
                {COMPARACAO.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-[#faf9f7]' : 'bg-white'}>
                    <td className="p-3 font-medium">{item.criterio}</td>
                    <td className="p-3">{item.jaleco}</td>
                    <td className="p-3">{item.scrub}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Posso usar os dois?</h2>
          <p>
            Sim — e muitas profissionais fazem isso. Jaleco para consultas e atendimentos presenciais onde a imagem importa. Scrub para procedimentos, plantões ou dias de maior movimento físico. Ter os dois no guarda-roupa profissional é a escolha mais versátil.
          </p>

          <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
            <p className="text-sm text-muted-foreground mb-3">Leia também:</p>
            <div className="flex flex-col gap-2">
              <Link href="/blog/jaleco-slim-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco slim feminino: modelos por especialidade</Link>
              <Link href="/blog/jaleco-colorido-clinica" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco colorido: o que cada conselho permite</Link>
              <Link href="/blog/como-escolher-jaleco-feminino-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Guia completo de jaleco feminino</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Ver jalecos e scrubs Jaleca</h3>
          <p className="text-muted-foreground mb-4">Jaleco slim e scrub feminino — PP ao G3, em até 12 cores.</p>
          <Link href="/jaleco-feminino" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Uniformes →
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

export async function generateStaticParams() {
  return [{ slug: 'jaleco-ou-scrub-consultorio' }]
}

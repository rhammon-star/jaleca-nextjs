import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco Colorido na Clínica: CFM, CRO, COFEN e CFN Permitem?',
  description: 'Jaleco colorido é permitido? Descubra o que cada conselho de saúde determina: CFM para médicos, CRO para dentistas, COFEN para enfermeiros e CFN para nutricionistas. Guia atualizado 2026.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-colorido-clinica' },
  openGraph: {
    title: 'Jaleco Colorido na Clínica: CFM, CRO, COFEN e CFN Permitem?',
    description: 'Jaleco colorido é permitido? O que CFM, CRO, COFEN e CFN determinam. Guia completo por profissão.',
    url: 'https://jaleca.com.br/blog/jaleco-colorido-clinica',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco Colorido na Clínica: o que CFM, CRO, COFEN e CFN permitem',
  description: 'Guia atualizado 2026 sobre jaleco colorido por profissão. CFM, CRO, COFEN, CFN, COFFITO e CFN.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-04-30',
  dateModified: '2026-04-30',
  url: 'https://jaleca.com.br/blog/jaleco-colorido-clinica',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'O CFM proíbe jaleco colorido para médico?',
      acceptedAnswer: { '@type': 'Answer', text: 'Não. O Conselho Federal de Medicina (CFM) não define cor obrigatória de jaleco. O Código de Ética Médica exige que o médico se identifique com nome e CRM no jaleco, mas não especifica cor. A restrição ao branco vem das normas internas das instituições (hospitais, clínicas conveniadas ao SUS), não do CFM.' },
    },
    {
      '@type': 'Question',
      name: 'Dentista pode usar jaleco colorido?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim. O CRO (Conselho Regional de Odontologia) não restringe cor de jaleco. Em consultório particular, dentistas usam jaleco colorido livremente. Em hospitais odontológicos ou clínicas conveniadas, verifique o protocolo interno. A identificação com nome e CRO é obrigatória independente da cor.' },
    },
    {
      '@type': 'Question',
      name: 'COFEN permite jaleco colorido para enfermeiro?',
      acceptedAnswer: { '@type': 'Answer', text: 'O COFEN não define cor de jaleco por norma federal. A Resolução COFEN 543/2017 trata de uniformes mas delega a regulação de cor às instituições. Em hospitais públicos e UBSs, o branco é o padrão institucional. Em clínicas privadas, o enfermeiro tem liberdade de escolha desde que o jaleco tenha identificação do profissional.' },
    },
    {
      '@type': 'Question',
      name: 'Fisioterapeuta precisa usar jaleco branco?',
      acceptedAnswer: { '@type': 'Answer', text: 'Não. O COFFITO não restringe cor. Fisioterapeutas em clínicas particulares usam jaleco em qualquer cor. O jaleco colorido é especialmente comum em fisioterapia pediátrica (cores mais acolhedoras para crianças) e em clínicas de estética (identidade visual da marca).' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Colorido na Clínica', item: 'https://jaleca.com.br/blog/jaleco-colorido-clinica' },
  ],
}

const CONSELHOS = [
  { conselho: 'CFM — Medicina', restricao: 'Nenhuma cor obrigatória', obs: 'Branco é padrão hospitalar por norma institucional, não do CFM' },
  { conselho: 'CRO — Odontologia', restricao: 'Nenhuma cor obrigatória', obs: 'Identificação com nome e CRO obrigatória em qualquer cor' },
  { conselho: 'COFEN — Enfermagem', restricao: 'Delegada às instituições', obs: 'Hospital público: branco padrão. Clínica privada: livre' },
  { conselho: 'COFFITO — Fisioterapia', restricao: 'Nenhuma cor obrigatória', obs: 'Identificação com nome e CREFITO recomendada' },
  { conselho: 'CFN — Nutrição', restricao: 'Nenhuma cor obrigatória', obs: 'CRN no jaleco é recomendado pelo CFN' },
  { conselho: 'CFBio — Biomedicina', restricao: 'Norma ANVISA para laboratório', obs: 'Em laboratório: jaleco fechado, sem bolsos externos abertos' },
  { conselho: 'CFF — Farmácia', restricao: 'Nenhuma cor obrigatória', obs: 'RDC 67 define EPI — não restringe cor' },
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
          <span className="text-foreground">Jaleco Colorido na Clínica</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />30 de Abril de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco Colorido na Clínica: o que Cada Conselho Permite
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            CFM, CRO, COFEN, COFFITO, CFN — nenhum deles proíbe jaleco colorido. O que existe são normas institucionais. Entenda a diferença e saiba quando você tem liberdade de escolha.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>A confusão sobre jaleco branco obrigatório</h2>
          <p>
            Muitas profissionais acreditam que o jaleco branco é obrigatório por lei ou resolução dos conselhos de saúde. Não é. O que existe são normas internas das instituições — hospitais, UBSs, clínicas conveniadas — que adotam o branco como padrão operacional por razões de higiene visual e identificação rápida de profissionais.
          </p>
          <p>
            Os conselhos federais (CFM, CRO, COFEN, COFFITO, CFN) regulam a ética e a competência profissional — não o guarda-roupa. A única exigência universal é a <strong>identificação do profissional</strong> (nome + número de registro) no jaleco, independente da cor.
          </p>

          <h2>O que cada conselho diz — tabela de referência</h2>
          <div className="overflow-x-auto not-prose mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="text-left p-3">Conselho</th>
                  <th className="text-left p-3">Restrição de cor</th>
                  <th className="text-left p-3">Observação</th>
                </tr>
              </thead>
              <tbody>
                {CONSELHOS.map((item, i) => (
                  <tr key={i} className={i % 2 === 0 ? 'bg-[#faf9f7]' : 'bg-white'}>
                    <td className="p-3 font-medium">{item.conselho}</td>
                    <td className="p-3 text-green-700">{item.restricao}</td>
                    <td className="p-3 text-[#555]">{item.obs}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2>Quando o jaleco colorido NÃO é permitido</h2>
          <p>
            Em ambientes com normas institucionais claras. Exemplos:
          </p>
          <ul>
            <li><strong>Hospitais públicos e universitários:</strong> protocolo interno quase sempre exige branco para médicos e enfermeiros</li>
            <li><strong>UTIs e centros cirúrgicos:</strong> cor do jaleco pode ser determinada pela chefia de enfermagem para identificação rápida de hierarquia</li>
            <li><strong>Laboratórios (ANVISA):</strong> jaleco fechado e de manga longa é obrigatório por biossegurança — mas a cor é livre</li>
            <li><strong>Clínicas conveniadas ao SUS:</strong> verifique o manual do prestador</li>
          </ul>
          <p>
            Em qualquer outro contexto — consultório particular, clínica privada, estúdio de estética, ambulatório de empresa — a cor do jaleco é escolha do profissional.
          </p>

          <h2>Quais cores de jaleco transmitem o quê</h2>
          <p>A cor do jaleco comunica antes de qualquer palavra:</p>
          <ul>
            <li><strong>Branco:</strong> autoridade clínica, limpeza, tradição. Funciona em qualquer especialidade.</li>
            <li><strong>Azul royal:</strong> confiança e serenidade. Muito usado em cardiologia e pediatria.</li>
            <li><strong>Verde água / verde musgo:</strong> saúde, natureza, equilíbrio. Popular em nutrição e fisioterapia.</li>
            <li><strong>Rosê / blush:</strong> acolhimento e humanização. Cresce em nutrição comportamental e psicologia clínica.</li>
            <li><strong>Marsala / vinho:</strong> sofisticação. Tendência em estética e dermatologia estética.</li>
            <li><strong>Preto:</strong> modernidade e autoridade. Barbearia, estúdios de tatuagem, estética premium.</li>
          </ul>

          <h2>Jaleco colorido melhora o atendimento?</h2>
          <p>
            Estudos de psicologia da saúde mostram que a cor do uniforme do profissional impacta a percepção do paciente. Em pediatria, jalecos coloridos reduzem a ansiedade de crianças. Em nutrição, cores associadas à saúde (verde) reforçam a credibilidade do profissional.
          </p>
          <p>
            Jaleco branco mantém a vantagem em percepção de autoridade clínica e assepsia. A escolha ideal depende do paciente que você atende e do ambiente onde trabalha — não de uma norma que não existe.
          </p>

          <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
            <p className="text-sm text-muted-foreground mb-3">Leia também:</p>
            <div className="flex flex-col gap-2">
              <Link href="/blog/jaleco-slim-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco slim feminino: modelos e quando usar</Link>
              <Link href="/blog/jaleco-branco-profissional" className="text-[#c4a97d] hover:underline text-sm">→ Como manter jaleco branco sempre imaculado</Link>
              <Link href="/blog/como-escolher-jaleco-feminino-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Guia completo de jaleco feminino</Link>
              <Link href="/jaleco-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Coleção completa de jaleco feminino</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Ver jalecos coloridos da Jaleca</h3>
          <p className="text-muted-foreground mb-4">12 cores disponíveis — do branco clássico ao verde musgo, marsala e rosê.</p>
          <Link href="/categoria/jalecos-femininos" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Todas as Cores →
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
  return [{ slug: 'jaleco-colorido-clinica' }]
}

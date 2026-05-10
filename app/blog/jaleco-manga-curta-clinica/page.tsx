import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco Manga Curta Pode Usar na Clínica? CFM, CRO e COFEN Respondem',
  description: 'Jaleco manga curta é permitido na clínica? O que CFM, CRO e COFEN determinam. Quando o manga curta é indicado e quando o longo é obrigatório. Guia por profissão.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-manga-curta-clinica' },
  openGraph: {
    title: 'Jaleco Manga Curta Pode Usar na Clínica?',
    description: 'O que CFM, CRO e COFEN dizem sobre jaleco manga curta. Guia por profissão e ambiente clínico.',
    url: 'https://jaleca.com.br/blog/jaleco-manga-curta-clinica',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco Manga Curta Pode Usar na Clínica?',
  description: 'CFM, CRO e COFEN permitem jaleco manga curta? Guia completo por profissão e ambiente.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-05-01',
  dateModified: '2026-05-01',
  url: 'https://jaleca.com.br/blog/jaleco-manga-curta-clinica',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Jaleco manga curta é permitido para médica?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim. O CFM não define comprimento de manga no Código de Ética Médica. A restrição ao jaleco manga longa vem de protocolos institucionais — principalmente hospitais públicos, UTIs e centros cirúrgicos, onde a manga longa é exigida por biossegurança (reduz exposição da pele a fluidos). Em consultório particular, o jaleco manga curta é permitido e muito usado em especialidades como dermatologia e clínica estética.' },
    },
    {
      '@type': 'Question',
      name: 'Dentista pode usar jaleco manga curta?',
      acceptedAnswer: { '@type': 'Answer', text: 'Sim. O CRO não restringe comprimento de manga. Em consultório odontológico, o jaleco manga curta é muito comum — facilita o movimento do braço na cadeira e reduz o calor em procedimentos longos. A identificação com nome e CRO é obrigatória independentemente do comprimento da manga.' },
    },
    {
      '@type': 'Question',
      name: 'Quando o jaleco manga longa é obrigatório?',
      acceptedAnswer: { '@type': 'Answer', text: 'Em ambientes com risco biológico elevado: centros cirúrgicos, UTIs, laboratórios (norma ANVISA) e procedimentos com exposição a fluidos. Nesses contextos, a manga longa é exigida por protocolo de biossegurança institucional — não por resolução dos conselhos. Em ambulatórios, clínicas particulares e consultórios, a escolha é do profissional.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco manga curta ou longa: qual é mais profissional?',
      acceptedAnswer: { '@type': 'Answer', text: 'Os dois são igualmente profissionais em contexto de consultório. A percepção de autoridade não muda com o comprimento da manga — muda com o caimento, a cor e a identificação do jaleco. O jaleco manga curta tende a ser preferido em especialidades com muito movimento de braço (odontologia, fisioterapia, estética) e em regiões mais quentes.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Manga Curta na Clínica', item: 'https://jaleca.com.br/blog/jaleco-manga-curta-clinica' },
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
          <span className="text-foreground">Jaleco Manga Curta na Clínica</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />1 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />4 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco Manga Curta Pode Usar na Clínica?
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Resposta direta: sim, na maioria dos ambientes. A restrição ao manga longa não vem dos conselhos federais — vem de protocolos institucionais específicos. Entenda quando cada um se aplica.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>O que CFM, CRO e COFEN dizem sobre manga curta</h2>
          <p>
            Nenhum dos três conselhos federais define comprimento de manga como requisito obrigatório. O Código de Ética Médica (CFM), as resoluções do CRO e a Resolução COFEN 543/2017 tratam de identificação, competência e conduta profissional — não do comprimento da manga do jaleco.
          </p>
          <p>
            O que existe são <strong>normas internas de biossegurança institucional</strong> — aplicadas por hospitais, UTIs, centros cirúrgicos e laboratórios — que exigem manga longa como EPI para reduzir a exposição da pele a fluidos e aerossóis.
          </p>

          <h2>Quando o jaleco manga curta é permitido</h2>
          <ul>
            <li><strong>Consultório particular</strong> — médica, dentista, nutricionista, fisioterapeuta: livre escolha</li>
            <li><strong>Clínica privada sem protocolo de biossegurança elevado</strong>: livre escolha</li>
            <li><strong>Estética, dermatologia clínica, nutrição</strong>: manga curta é padrão em muitas clínicas</li>
            <li><strong>Odontologia</strong>: o jaleco manga curta é especialmente popular — facilita o movimento do braço na cadeira</li>
          </ul>

          <h2>Quando o jaleco manga longa é obrigatório</h2>
          <ul>
            <li><strong>UTI e centro cirúrgico</strong>: protocolo institucional exige cobertura máxima da pele</li>
            <li><strong>Laboratório de análises clínicas</strong>: norma ANVISA (RDC 302/2005) exige jaleco de manga longa como EPI</li>
            <li><strong>Procedimentos com exposição a fluidos biológicos</strong>: protocolo de biossegurança da instituição</li>
            <li><strong>Hospitais públicos com manual de uniformes</strong>: verifique o protocolo interno</li>
          </ul>

          <h2>Manga curta vs manga longa — diferença prática no dia a dia</h2>
          <p>
            Em consultório, a diferença real é de <strong>conforto e movimento</strong>. A manga longa do jaleco pode puxar o ombro em procedimentos que exigem alcance acima da cabeça — especialmente em odontologia e fisioterapia. O jaleco manga curta elimina esse problema.
          </p>
          <p>
            No calor (consultórios sem climatização adequada, regiões Norte e Nordeste), o jaleco manga curta reduz o desconforto térmico sem comprometer o aspecto profissional.
          </p>

          <h2>Manga curta com elastano: a combinação mais pedida</h2>
          <p>
            O jaleco slim manga curta com elastano é o modelo mais pedido por dentistas e fisioterapeutas. O elastano compensa a ausência da manga — o braço tem amplitude total sem puxar o ombro do jaleco. Em procedimentos longos, o conforto é significativamente maior.
          </p>

          <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
            <p className="text-sm text-muted-foreground mb-3">Leia também:</p>
            <div className="flex flex-col gap-2">
              <Link href="/blog/jaleco-colorido-clinica" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco colorido: o que CFM, CRO e COFEN permitem</Link>
              <Link href="/blog/jaleco-slim-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco slim feminino: modelos e quando usar</Link>
              <Link href="/blog/como-escolher-jaleco-feminino-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Guia completo de jaleco feminino</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Ver jalecos manga curta</h3>
          <p className="text-muted-foreground mb-4">Slim manga curta com elastano — PP ao G3, em 12 cores.</p>
          <Link href="/categoria/jalecos-femininos" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Jalecos →
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
  return [{ slug: 'jaleco-manga-curta-clinica' }]
}

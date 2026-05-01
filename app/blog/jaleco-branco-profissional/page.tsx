import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Como Manter Jaleco Branco Sempre Imaculado — Guia Profissional | Jaleca',
  description: 'Jaleco branco amarela, descora e mancha? Guia completo: como lavar, remover manchas de sangue, iodo, café e caneta. Temperatura certa, alvejante seguro e como secar sem perder o branco.',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-branco-profissional' },
  openGraph: {
    title: 'Como Manter Jaleco Branco Sempre Imaculado — Guia Profissional',
    description: 'Jaleco branco amarela, descora e mancha? Guia completo para médicas, dentistas e enfermeiras manterem o jaleco branco impecável.',
    url: 'https://jaleca.com.br/blog/jaleco-branco-profissional',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Como Manter Jaleco Branco Sempre Imaculado — Guia Profissional',
  description: 'Guia completo: como lavar jaleco branco, remover manchas e evitar amarelamento.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br' },
  datePublished: '2026-04-30',
  dateModified: '2026-04-30',
  url: 'https://jaleca.com.br/blog/jaleco-branco-profissional',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Por que o jaleco branco amarela?',
      acceptedAnswer: { '@type': 'Answer', text: 'O jaleco branco amarela por três razões principais: (1) resíduo de amaciante que se acumula no tecido, (2) secagem ao sol direto que oxida as fibras, (3) água quente acima de 60°C que degrada os alvejantes ópticos do tecido. Para evitar: não use amaciante, seque à sombra e lave sempre abaixo de 60°C.' },
    },
    {
      '@type': 'Question',
      name: 'Como tirar mancha de sangue do jaleco branco?',
      acceptedAnswer: { '@type': 'Answer', text: 'Para mancha de sangue fresca: água fria imediatamente — nunca quente (calor coagula a proteína e fixa a mancha). Esfregue com sabão neutro direto na mancha. Se já secou: água oxigenada 10 volumes aplicada por 5 minutos, depois lavagem normal. Água sanitária remove a mancha mas degrada o tecido com uso repetido.' },
    },
    {
      '@type': 'Question',
      name: 'Posso usar água sanitária no jaleco branco?',
      acceptedAnswer: { '@type': 'Answer', text: 'Apenas pontualmente, em manchas resistentes, diluída (1 parte de água sanitária para 10 partes de água). Nunca direto no tecido. Uso frequente de cloro destrói as fibras de poliéster e elastano em poucas lavagens, causando amarelamento permanente e perda do caimento.' },
    },
    {
      '@type': 'Question',
      name: 'Qual alvejante é seguro para jaleco com elastano?',
      acceptedAnswer: { '@type': 'Answer', text: 'Alvejante sem cloro (oxigênio ativo, perborato de sódio). Marcas como OMO Power White, Vanish Oxi Action e similares são seguros para poliéster com elastano. Evite qualquer produto com cloro (água sanitária, Qboa, Clorox) — corrói o elastano e amarela o branco a longo prazo.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco Branco Profissional', item: 'https://jaleca.com.br/blog/jaleco-branco-profissional' },
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
          <span className="text-foreground">Jaleco Branco Profissional</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />30 de Abril de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />6 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Como Manter Jaleco Branco Sempre Imaculado
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Guia direto para médicas, dentistas e enfermeiras que precisam de jaleco branco pronto para qualquer consulta — sem amarelado, sem manchas, sem desfiado.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>Por que o jaleco branco amarela — e como evitar</h2>
          <p>
            Jaleco branco novo parece impecável. Depois de 20 lavagens, começa a ganhar um tom amarelado que não sai. O problema quase nunca é a qualidade do tecido — é a forma de lavar.
          </p>
          <p>
            Os três vilões do branco: <strong>amaciante</strong> (deixa resíduo que se acumula e cria camada amarelada), <strong>sol direto na secagem</strong> (oxida as fibras de poliéster irreversivelmente) e <strong>água muito quente</strong> (destrói os alvejantes ópticos que fazem o branco "brilhar").
          </p>

          <h2>A lavagem certa para jaleco de poliéster com elastano</h2>
          <ol>
            <li><strong>Temperatura:</strong> máximo 40°C para uso diário. 60°C para desinfecção clínica pontual.</li>
            <li><strong>Sabão:</strong> detergente líquido neutro. Pó pode deixar resíduo.</li>
            <li><strong>Alvejante:</strong> sem cloro — oxigênio ativo (Vanish, OMO Power White). Nunca água sanitária.</li>
            <li><strong>Amaciante:</strong> nunca. Cria camada que retém sujeira e amarela o branco.</li>
            <li><strong>Centrifugação:</strong> máxima 800 rpm. Alta velocidade distorce a costura do slim.</li>
            <li><strong>Secagem:</strong> à sombra, estendido horizontalmente ou no varal. Nunca no sol direto.</li>
          </ol>

          <h2>Como remover as manchas mais comuns</h2>

          <h3>Mancha de sangue</h3>
          <p>
            <strong>Fresca:</strong> água fria imediata, esfregue sabão neutro. Nunca água quente — fixa a proteína.
            <strong>Seca:</strong> água oxigenada 10 volumes por 5 minutos, depois lavagem normal.
          </p>

          <h3>Mancha de iodo / PVPI</h3>
          <p>
            Água fria + sabão neutro imediatamente. Se já fixou: água oxigenada 10 volumes ou produto enzimático (Biozyme). O iodo mancha permanentemente se entrar em contato com calor.
          </p>

          <h3>Mancha de café ou chá</h3>
          <p>
            Água fria + detergente neutro. Se já secou: bicarbonato de sódio + água morna, deixar agir 10 minutos antes de lavar.
          </p>

          <h3>Mancha de caneta esferográfica</h3>
          <p>
            Álcool isopropílico aplicado com algodão na mancha antes de lavar. O álcool dissolve a tinta sem danificar o tecido.
          </p>

          <h3>Mancha de maquiagem / batom</h3>
          <p>
            Removedor de maquiagem oleoso ou álcool, depois detergente neutro. Jamais esfregar seco — espalha a mancha.
          </p>

          <h2>O jaleco branco já está amarelado — tem solução?</h2>
          <p>
            Depende da causa. Se for resíduo de amaciante ou detergente: lave com bicarbonato de sódio (4 colheres por máquina) sem sabão — vai tirar o acúmulo. Se for oxidação por sol: geralmente permanente. Se for cloro: irreversível.
          </p>
          <p>
            Para prevenção de amarelamento futuro, adicione 100ml de vinagre branco no compartimento de amaciante — ele neutraliza resíduos alcalinos sem danificar o tecido.
          </p>

          <h2>Jaleco branco em ambiente com risco biológico</h2>
          <p>
            Para profissionais que precisam desinfectar o jaleco após exposição biológica: lave separado dos demais, a 60°C com alvejante sem cloro. Se a instituição exigir ciclo de autoclave, o jaleco de poliéster/elastano não suporta — use jaleco de algodão para esses contextos específicos.
          </p>

          <div className="mt-8 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
            <p className="text-sm text-muted-foreground mb-3">Continue lendo:</p>
            <div className="flex flex-col gap-2">
              <Link href="/blog/jaleco-slim-feminino" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco slim feminino: por que é o favorito das médicas</Link>
              <Link href="/blog/jaleco-colorido-clinica" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco colorido: o que cada conselho de saúde permite</Link>
              <Link href="/blog/como-escolher-jaleco-feminino-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Guia completo de jaleco feminino</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Jaleco branco Jaleca</h3>
          <p className="text-muted-foreground mb-4">Slim Tradicional e Gold em branco — do PP ao G3, com elastano que mantém o caimento.</p>
          <Link href="/jaleco-feminino" className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]">
            Ver Jalecos Brancos →
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
  return [{ slug: 'jaleco-branco-profissional' }]
}

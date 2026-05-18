import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Como Cuidar do Seu Scrub Feminino: Lavagem e Conservação',
  description: 'Aprenda a lavar, secar e guardar seu scrub feminino do jeito certo para ele durar muito mais. Dicas práticas para cada tipo de tecido.',
  keywords: 'como lavar scrub feminino, cuidar scrub feminino, lavar uniforme saude, conservar scrub, lavar two way elastano',
  alternates: { canonical: 'https://jaleca.com.br/blog/como-cuidar-scrub-feminino' },
  openGraph: {
    title: 'Como Cuidar do Seu Scrub Feminino: Lavagem e Conservação',
    description: 'Guia prático de cuidados para seu scrub feminino durar muito mais.',
    url: 'https://jaleca.com.br/blog/como-cuidar-scrub-feminino',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80', width: 1200, height: 630 }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Posso usar amaciante no scrub feminino?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Não é recomendado. O amaciante reduz a capacidade de absorção do tecido e pode danificar fibras de elastano, acelerando a deformação do scrub. Use sabão neutro ou detergente para roupas delicadas.',
      },
    },
    {
      '@type': 'Question',
      name: 'Posso passar ferro no scrub feminino?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Depende do tecido. Gabardine aceita ferro em temperatura baixa. Two way e oxfordine geralmente não precisam de ferro — e o calor excessivo pode danificar o poliéster. Verifique a etiqueta antes de usar o ferro.',
      },
    },
    {
      '@type': 'Question',
      name: 'Com que frequência devo lavar o scrub?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O ideal é lavar após cada uso, especialmente em ambientes hospitalares. Além de higiene, isso evita que sujeira e odores se fixem no tecido. Ter pelo menos 3 scrubs na rotação ajuda a preservar cada peça.',
      },
    },
  ],
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Como Cuidar do Seu Scrub Feminino: Lavagem e Conservação',
  description: 'Guia prático de cuidados para prolongar a vida útil do seu scrub feminino.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-jaleca-512.png', width: 512, height: 512 } },
  url: 'https://jaleca.com.br/blog/como-cuidar-scrub-feminino',
  datePublished: '2026-04-30',
  dateModified: '2026-04-30',
  image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=1200&q=80',
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
          <span className="text-foreground">Como Cuidar do Scrub Feminino</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} /> 30 de Abril de 2026</span>
            <span className="flex items-center gap-1"><User size={14} /> Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} /> 5 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Como Cuidar do Seu Scrub Feminino: Lavagem e Conservação
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Lavar do jeito errado é o principal motivo de scrubs desbotando, deformando e perdendo qualidade antes do tempo. Veja como fazer certo.
          </p>
        </header>

        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&q=80"
            alt="Cuidados com uniforme de saúde — lavagem e conservação"
            className="w-full h-auto block"
            style={{ maxHeight: 420, objectFit: 'cover' }}
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            Você investiu num bom <Link href="/scrub-feminino">scrub feminino</Link> — agora precisa cuidar bem pra ele durar. A maioria das profissionais de saúde perde peças prematuramente por erros simples de lavagem: temperatura errada, amaciante, torcer o tecido.
          </p>
          <p>
            Esse guia resolve isso de uma vez. Dicas práticas por tipo de tecido, do pré-lavagem à secagem.
          </p>

          <h2>Antes de lavar: pré-tratamento de manchas</h2>
          <p>
            Manchas de sangue, medicamento ou iodo precisam de atenção imediata. Quanto mais tempo ficam no tecido, mais difícil de remover.
          </p>
          <ul>
            <li><strong>Sangue:</strong> Água fria (nunca quente) direto na mancha. O calor fixa o sangue. Esfregue com sabão neutro antes de lavar.</li>
            <li><strong>Iodo e PVPI:</strong> Deixe de molho em água fria com sabão por 20 minutos antes da lavagem.</li>
            <li><strong>Gordura ou creme:</strong> Aplique detergente de louça puro na mancha por 5 minutos antes de lavar.</li>
          </ul>

          <h2>Temperatura da água: regra geral</h2>
          <p>
            A temperatura certa varia conforme o objetivo:
          </p>
          <ul>
            <li><strong>Lavagem de rotina:</strong> Água fria ou morna (até 30°C) — preserva o tecido e as cores</li>
            <li><strong>Desinfecção reforçada:</strong> Até 60°C para algodão (tricoline). Para poliéster e elastano, nunca passe de 40°C</li>
          </ul>

          <h2>Cuidados por tipo de tecido</h2>

          <h3>Gabardine</h3>
          <p>
            Lavar na máquina em ciclo delicado, água fria ou morna. Virar ao avesso para preservar a cor. Pode passar ferro em temperatura baixa se necessário. Secar na sombra ou em temperatura baixa na secadora.
          </p>

          <h3>Two Way (Poliéster + Elastano)</h3>
          <p>
            O tecido que mais pede atenção. Lavar à mão ou na máquina em ciclo delicado, água fria. <strong>Nunca use amaciante</strong> — destrói o elastano. Não torça — espreme suavemente. Secar estendido na sombra, nunca no varal de prendedor (marca o tecido).
          </p>

          <h3>Oxfordine</h3>
          <p>
            O mais resistente na lavagem. Aceita máquina normal, água morna. Pode usar centrifugação leve. Seca muito rápido — ótimo pra quem precisa do scrub no dia seguinte.
          </p>

          <h3>Tricoline (Algodão)</h3>
          <p>
            Lavar na máquina em ciclo normal, água fria. <strong>Atenção: não lavar em água quente</strong> — o algodão encolhe. Secar na sombra. Aceita ferro caso necessite.
          </p>

          <h2>O que nunca fazer com o seu scrub</h2>
          <ul>
            <li>Usar amaciante (especialmente em tecidos sintéticos)</li>
            <li>Água quente em poliéster e elastano</li>
            <li>Torcer o tecido com força</li>
            <li>Secar diretamente no sol forte por horas (desbota e enfraquece fibras)</li>
            <li>Lavar com roupas de cores fortes que podem sangrar</li>
            <li>Usar alvejante clorado sem verificar a etiqueta</li>
          </ul>

          <h2>Quantos scrubs ter na rotação?</h2>
          <p>
            O ideal é ter pelo menos <strong>3 scrubs na rotação semanal</strong> — um usando, um lavado, um de reserva. Isso evita lavar peças úmidas às pressas e dá tempo adequado de secagem, especialmente para tecidos mais delicados como o two way.
          </p>

          <h2>Como guardar o scrub</h2>
          <p>
            Guarde dobrado ou pendurado em cabide largo. Evite amontoar com pressão — o two way principalmente pode marcar. Se possível, mantenha os scrubs separados das roupas do dia a dia, especialmente depois de voltar do trabalho.
          </p>

          <h2>Dúvidas frequentes</h2>

          <h3>Posso usar amaciante no scrub feminino?</h3>
          <p>
            Não é recomendado. O amaciante reduz a absorção do tecido e danifica fibras de elastano. Use sabão neutro ou detergente para roupas delicadas.
          </p>

          <h3>Posso passar ferro no scrub feminino?</h3>
          <p>
            Depende do tecido. Gabardine e algodão aceitam ferro baixo. Two way e oxfordine geralmente não precisam — o calor excessivo pode danificar o poliéster.
          </p>

          <h3>Com que frequência devo lavar o scrub?</h3>
          <p>
            Após cada uso. Em ambientes hospitalares, isso é fundamental por questões de higiene. Com 3 peças na rotação, você preserva cada uma sem precisar lavar com pressa.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e5e0d8]">
          <p className="text-sm text-muted-foreground mb-4">Veja também:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Scrub Feminino Jaleca
            </Link>
            <Link href="/blog/melhores-tecidos-scrub-feminino" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Melhores Tecidos para Scrub
            </Link>
            <Link href="/blog/scrub-feminino-acinturado" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Scrub Feminino Acinturado
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}

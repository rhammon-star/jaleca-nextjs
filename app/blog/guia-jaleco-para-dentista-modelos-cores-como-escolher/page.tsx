import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco para Dentista: Modelos, Cores e Como Escolher | Jaleca',
  description: 'Guia completo de jaleco para dentista: modelos certos (Slim, Duquesa, Elastex), cores recomendadas, NR-32 e como escolher o jaleco odontológico ideal para seu consultório.',
  keywords: 'jaleco para dentista, jaleco dentista, jaleco odontológico, jaleco para dentista branco, jaleco slim dentista, jaleco NR-32',
  alternates: { canonical: 'https://jaleca.com.br/blog/guia-jaleco-dentista-modelos-cores-como-escolher' },
  openGraph: {
    title: 'Jaleco para Dentista: Modelos, Cores e Como Escolher | Jaleca',
    description: 'Guia completo de jaleco para dentista. Modelos, cores e como escolher.',
    url: 'https://jaleca.com.br/blog/guia-jaleco-dentista-modelos-cores-como-escolher',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual jaleco é indicado para dentista?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Para dentistas, o Jaleco Slim é o mais indicado: visual elegante, caimento acinturado e tecido premium que transmite profissionalismo no consultório. Modelos em branco são os mais tradicionais.'
      }
    },
    {
      '@type': 'Question',
      name: 'Dentista pode usar jaleco colorido?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim! Consultórios odontológicos permitem jalecos coloridos. Modelos em azul, verde ou rosa transmitem modernidade e podem diferençar a clínica da concorrência.'
      }
    },
    {
      '@type': 'Question',
      name: 'O jaleco para dentista precisa seguir alguma norma?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim, a NR-32 estabelece regras de segurança para profissionais de saúde, incluindo o uso de EPIs adequados. O jaleco deve ser de tecido que permita desinfecção e não acumule partículas.'
      }
    }
  ]
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Dentista: Modelos, Cores e Como Escolher',
  description: 'Guia completo de jaleco para dentista: modelos certos (Slim, Duquesa, Elastex), cores recomendadas, NR-32 e como escolher o jaleco odontológico ideal.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/blog/guia-jaleco-dentista-modelos-cores-como-escolher',
  datePublished: '2026-04-23',
  dateModified: '2026-04-23',
}

export default function BlogPost() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqSchema).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema).replace(/</g, '\\u003c'),
        }}
      />

      <article className="container py-12 max-w-3xl">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground">Início</Link>
          <span>/</span>
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <span>/</span>
          <span className="text-foreground">Jaleco para Dentista</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} /> 23 de Abril de 2026</span>
            <span className="flex items-center gap-1"><User size={14} /> Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} /> 6 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco para Dentista: Modelos, Cores e Como Escolher
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Guia completo para dentistas escolherem o jaleco odontológico ideal: modelos certos, cores permitidas e dicas para，符合 NR-32.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>Por que o jaleco certo é essencial para dentistas</h2>
          <p>
            O dentista trabalha em um ambiente de alto contato com patógenos. Seu jaleco precisa proteger você e seus pacientes, além de transmitir a confiança queTodo paciente espera de um profissional de saúde bucal.
          </p>
          <p>
            Na Jaleca, oferecemos jalecos específicos para dentistas que buscam elegância, conforto e conformidade com as normas de biossegurança.
          </p>

          <h2>Melhores modelos de jaleco para dentista</h2>

          <h3>Jaleco Slim — O mais popular entre dentistas</h3>
          <p>
            O Jaleco Slim tem corte acinturado que valoriza a silhueta sem apretar. É o modelo mais vendido para dentistas porque combina elegância com praticidade — permite movimentação durante procedimentos e mantém visual impecável durante todo o atendimento.
          </p>

          <h3>Jaleco Duquesa — Clássico e formal</h3>
          <p>
            O Jaleco Duquesa tem manga longa com punho e abertura frontal com botões. É ideal para dentistas que fazem procedimentos cirúrgicos e precisam de maior cobertura.
          </p>

          <h3>Jaleco Elastex — Conforto em longas sessões</h3>
          <p>
            Para dentistas que ficam horas na mesma posição, o Jaleco Elastex oferece elasticity que evita apertos e permite liberdade de movimento.
          </p>

          <h2>Cores de jaleco para dentista</h2>
          <p>
            <strong>Branco:</strong> A cor mais tradicional e ainda a mais pedido em clínicas odontológicas. Transmite limpeza e é obrigatória em alguns procedimentos cirúrgicos.
          </p>
          <p>
            <strong>Azul:</strong> Uma alternativa moderna ao branco. Transmite calma e confiança. Muito populares em clínicas de harmonização facial.
          </p>
          <p>
            <strong>Verde ou lilás:</strong> Opções que diferenciam visualmente e transmitem modernidade.
          </p>

          <h2>Conformidade com NR-32</h2>
          <p>
            A NR-32 (Norma Regulamentadora 32) establece diretrizes de segurança para profissionais de saúde. Para dentistas, isso significa:
          </p>
          <ul>
            <li>Jaleco deve ser de tecido que permita desinfecção adequada</li>
            <li>Mangas devem ser longas ou removíveis para procedimentos cirúrgicos</li>
            <li>Uso de EPI complementar (aventais descartáveis sobre o jaleco) em procedimentos de maior risco</li>
          </ul>

          <h2>Perguntas frequentes</h2>

          <h3>Qual o melhor jaleco para dentista?</h3>
          <p>
            O Jaleco Slim em tecido premium é o mais indicado: elegante, confortável e fácil de lavar. A Jaleca oferece modelos específicos para dentistas com características que atendem NR-32.
          </p>

          <h3>Dentista pode usar jaleco preto?</h3>
          <p>
            Sim, jalecos pretos são permitidos em consultórios odontológicos, especialmente para procedimentos estéticos. No entanto, para cirurgias, o jaleco branco é preferível por facilitar a identificação de sujeira.
          </p>

          <h3>Como cuidar do jaleco de dentista?</h3>
          <p>
            Lave em água morna com sabão neutro, evite alvejante. Seque à sombra e passe em temperatura média. Jalecos brancos podem ser lavados com alvejante oxigênio para manter o brancura.
          </p>

          <h2>Onde comprar jaleco para dentista</h2>
          <p>
            A Jaleca oferece jalecos específicos para dentistas em vários modelos, cores e tamanhos de PP ao G3. Compre online com entrega para todo o Brasil e frete grátis no Sudeste acima de R$499.
          </p>
          <p>
            <Link href="/categoria/jalecos-femininos" className="text-[#c4a97d] font-semibold hover:underline">
              Ver jalecos para dentista →
            </Link>
          </p>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Procurando jaleco para dentista?</h3>
          <p className="text-muted-foreground mb-4">
            Conheça a linha completa de jalecos profissionais para dentistas — Slim, Duquesa e Elastex.
          </p>
          <Link
            href="/jaleco-dentista"
            className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]"
          >
            Ver Jalecos para Dentista
          </Link>
        </div>

        <div className="mt-8 pt-8 border-t">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Voltar para o blog
          </Link>
        </div>
      </article>
    </>
  )
}

export async function generateStaticParams() {
  return [{ slug: 'guia-jaleco-dentista-modelos-cores-como-escolher' }]
}
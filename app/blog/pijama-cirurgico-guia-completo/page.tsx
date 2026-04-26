import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Pijama Cirúrgico: Guia Completo para Profissionais de Saúde',
  description: 'Tudo sobre pijama cirúrgico e scrub hospitalar: tecidos, modelagens, tabela comparativa e dicas pra escolher o uniforme cirúrgico ideal pra sua rotina.',
  keywords: 'pijama cirurgico, scrub hospitalar, uniforme cirurgico, roupa centro cirurgico, scrub enfermagem, uniforme saude',
  alternates: { canonical: 'https://jaleca.com.br/blog/pijama-cirurgico-guia-completo' },
  openGraph: {
    title: 'Pijama Cirúrgico: Guia Completo para Profissionais de Saúde',
    description: 'Guia completo sobre pijama cirúrgico: tecidos, modelos e como escolher.',
    url: 'https://jaleca.com.br/blog/pijama-cirurgico-guia-completo',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&q=80', width: 1200, height: 630 }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Posso usar pijama cirúrgico fora do hospital?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'A recomendação é que não. O scrub pode carregar microrganismos do ambiente hospitalar para outros espaços. O ideal é trocar ao chegar e ao sair do trabalho.'
      }
    },
    {
      '@type': 'Question',
      name: 'Qual a melhor cor de scrub hospitalar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Verde e azul são tradicionais por ajudarem a descansar a vista dos cirurgiões. Hoje cores escuras como azul marinho e preto são populares por disfarçarem manchas. Verifique o protocolo da sua instituição.'
      }
    },
    {
      '@type': 'Question',
      name: 'Como saber meu tamanho de scrub ao comprar online?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Use fita métrica e compare busto, cintura e quadril com a tabela de medidas da loja. Não confie apenas no P ou G que você costuma usar — cada marca tem modelagem diferente.'
      }
    }
  ]
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Pijama Cirúrgico: Guia Completo para Profissionais de Saúde',
  description: 'Guia completo sobre pijama cirúrgico: tecidos, modelagens e como escolher o scrub ideal.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/blog/pijama-cirurgico-guia-completo',
  datePublished: '2026-04-28',
  dateModified: '2026-04-28',
  image: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=1200&q=80',
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
          <span className="text-foreground">Pijama Cirúrgico</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} /> 28 de Abril de 2026</span>
            <span className="flex items-center gap-1"><User size={14} /> Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} /> 7 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Pijama Cirúrgico: Guia Completo para Profissionais de Saúde
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Tecidos, modelagens, cores e o que ninguém te conta sobre escolher o scrub hospitalar ideal. Tudo que vc precisa saber antes de comprar.
          </p>
        </header>

        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&q=80"
            alt="Profissional de saúde com pijama cirúrgico azul em ambiente hospitalar"
            className="w-full h-auto block"
            style={{ maxHeight: 420, objectFit: 'cover' }}
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            Seja na correria de um plantão, na precisão de uma cirurgia ou no atendimento diário, uma coisa é certa: o seu uniforme de trabalho precisa ser um aliado. Quando a gente fala de conforto, praticidade e segurança no ambiente de saúde, o <strong>pijama cirúrgico</strong> — também chamado de <strong>scrub hospitalar</strong> — é o campeão.
          </p>
          <p>
            Com tantas opções de tecidos e modelos, como escolher o ideal pra vc? A gente preparou esse guia completo pra vc nunca mais errar na hora de comprar a sua <strong>roupa de centro cirúrgico</strong>.
          </p>

          <h2>O que é um Pijama Cirúrgico, afinal?</h2>
          <p>
            Pode esquecer a ideia de um pijama de dormir. O nome confunde, mas o <strong>uniforme cirúrgico</strong> é uma vestimenta técnica, pensada nos mínimos detalhes para o dia a dia dos profissionais de saúde.
          </p>
          <p>
            Ele é composto, em geral, por calça e blusa de manga curta, com um design simples e funcional. O objetivo é garantir liberdade de movimento, higiene e conforto durante horas e horas de trabalho. Na verdade, ele é a sua segunda pele no hospital ou na clínica.
          </p>

          <h2>Por que o Scrub Hospitalar é tão essencial?</h2>
          <p>
            Ele é muito mais do que um uniforme colorido. O pijama cirúrgico tem funções importantes que impactam diretamente na sua rotina e na segurança de todos.
          </p>

          <h3>Barreira de proteção é o nome do jogo</h3>
          <p>
            O principal papel do scrub é criar uma barreira. Ele ajuda a minimizar a exposição do profissional a fluidos corporais e, ao mesmo tempo, protege os pacientes de possíveis contaminações que viriam das nossas roupas do dia a dia. É uma via de mão dupla de segurança.
          </p>

          <h3>Conforto que aguenta o tranco</h3>
          <p>
            Plantão de 12 ou 24 horas? Vc precisa de uma roupa que não aperte, não esquente demais e deixe vc se mover livremente. Os tecidos dos pijamas cirúrgicos são escolhidos a dedo pra isso: leves, respiráveis e, muitas vezes, com elastano pra acompanhar cada movimento sem reclamar.
          </p>

          <h3>Praticidade e identificação</h3>
          <p>
            Bolsos estratégicos pro celular, caneta, carimbo... Cada detalhe é pensado pra facilitar a sua vida. Além disso, cores e modelos ajudam a identificar equipes e funções dentro do hospital. Um time todo uniformizado passa uma imagem muito mais profissional, né?
          </p>

          <h2>Como escolher o Pijama Cirúrgico perfeito pra você</h2>

          <h3>O tecido é a alma do negócio</h3>
          <ul>
            <li><strong>Gabardine:</strong> Um clássico. Tecido encorpado, amassa pouco e tem durabilidade incrível. Elegante e resistente — ideal pra quem busca visual impecável.</li>
            <li><strong>Two Way (Poliéster com Elastano):</strong> A queridinha da flexibilidade. O elastano dá aquela esticadinha que faz toda a diferença na hora de se abaixar ou se esticar. Super confortável.</li>
            <li><strong>Oxfordine:</strong> Leve, resistente e ótimo custo-benefício. 100% poliéster, não amassa fácil e seca rapidinho. Perfeito pra quem tem rotina corrida.</li>
            <li><strong>Tricoline (100% Algodão):</strong> Pra quem não abre mão do toque natural. Super respirável, ideal pra lugares mais quentes. Tende a amassar um pouco mais.</li>
          </ul>

          <h3>Modelagem: o caimento é tudo</h3>
          <p>
            Um scrub largo demais pode atrapalhar os movimentos e enroscar em equipamentos. Um apertado demais é insuportável. Por isso, verifique o caimento — aqui na Jaleca as modelagens femininas e masculinas são pensadas pra se ajustar a cada biotipo.
          </p>

          <h3>Detalhes que fazem a diferença</h3>
          <p>
            Preste atenção na gola (Gola V é a mais clássica), no tipo de elástico da calça (completo ou só na parte de trás), no cordão de ajuste e, claro, na quantidade e posição dos bolsos. Pense no que vc carrega no dia a dia.
          </p>

          <h2>Tabela Comparativa: Modelos de Pijama Cirúrgico</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#f2f2f2]">
                  <th className="border border-[#ddd] p-3 text-left">Modelo / Tecido</th>
                  <th className="border border-[#ddd] p-3 text-left">Ideal para...</th>
                  <th className="border border-[#ddd] p-3 text-left">Prós</th>
                  <th className="border border-[#ddd] p-3 text-left">Contras</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-[#ddd] p-3"><strong>Gabardine Premium</strong></td>
                  <td className="border border-[#ddd] p-3">Elegância e durabilidade</td>
                  <td className="border border-[#ddd] p-3">Não amassa, muito resistente, visual profissional</td>
                  <td className="border border-[#ddd] p-3">Pode ser mais quente</td>
                </tr>
                <tr className="bg-[#fafafa]">
                  <td className="border border-[#ddd] p-3"><strong>Two Way com Elastano</strong></td>
                  <td className="border border-[#ddd] p-3">Rotina agitada, máxima mobilidade</td>
                  <td className="border border-[#ddd] p-3">Extremamente confortável, flexível</td>
                  <td className="border border-[#ddd] p-3">Cuidado especial na lavagem</td>
                </tr>
                <tr>
                  <td className="border border-[#ddd] p-3"><strong>Oxfordine Básico</strong></td>
                  <td className="border border-[#ddd] p-3">Estudantes, melhor custo-benefício</td>
                  <td className="border border-[#ddd] p-3">Leve, seca rápido, preço acessível</td>
                  <td className="border border-[#ddd] p-3">Toque menos suave</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>E o jaleco? Quando usar cada um?</h2>
          <p>
            O pijama cirúrgico é a escolha ideal para ambientes que exigem alto nível de assepsia e mobilidade: centros cirúrgicos, UTIs e pronto-socorro. Ele é o uniforme de batalha.
          </p>
          <p>
            Já o jaleco funciona como uma camada de proteção por cima da sua roupa (ou até do scrub), sendo perfeito para atendimentos em consultórios, laboratórios e para transitar em áreas administrativas. Cada um tem seu momento. Por isso ter um bom <Link href="/jaleco-medico">jaleco para médico</Link> ou um <Link href="/jaleco-enfermeiro">jaleco para enfermeiro</Link> de qualidade no armário é tão fundamental quanto ter um bom scrub.
          </p>

          <h2>Onde encontrar o pijama cirúrgico ideal?</h2>
          <p>
            A escolha do uniforme certo é um investimento na sua carreira e no seu bem-estar. Não adianta comprar o primeiro que vc vê pela frente — é preciso buscar qualidade, tecidos tecnológicos e uma modelagem que te valorize e te deixe confortável.
          </p>
          <p>
            Se vc tá procurando renovar seus uniformes, dá uma olhada na nossa coleção de <Link href="/produtos?categoria=conjuntos">conjuntos cirúrgicos</Link>. Com certeza tem um que é a sua cara.
          </p>

          <h2>Dúvidas Frequentes sobre Pijamas Cirúrgicos</h2>

          <h3>Posso usar meu pijama cirúrgico fora do hospital?</h3>
          <p>
            A recomendação da maioria das instituições de saúde é que não. O scrub pode carregar microrganismos do ambiente hospitalar para a rua, e vice-versa. O ideal é trocar sempre ao chegar e ao sair do trabalho.
          </p>

          <h3>Qual a melhor cor de scrub hospitalar?</h3>
          <p>
            Historicamente, verde e azul foram escolhidos por ajudarem a &quot;descansar&quot; a vista dos cirurgiões. Hoje a escolha de cores é muito mais ampla. Cores escuras como azul marinho e preto são ótimas por disfarçarem manchas.
          </p>

          <h3>Como saber meu tamanho certo ao comprar online?</h3>
          <p>
            Use uma fita métrica e compare suas medidas (busto, cintura, quadril) com a tabela de medidas da loja. Cada marca tem uma modelagem, então não confie apenas no &quot;P&quot; ou &quot;M&quot; que vc costuma usar.
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e5e0d8]">
          <p className="text-sm text-muted-foreground mb-4">Veja também:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/jaleco-enfermeiro" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Jaleco para Enfermeiro
            </Link>
            <Link href="/jaleco-medico" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Jaleco para Médico
            </Link>
            <Link href="/produtos?categoria=conjuntos" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Ver Conjuntos Cirúrgicos
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}

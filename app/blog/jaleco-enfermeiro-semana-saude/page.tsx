import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, User, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco para Enfermeiro: Como Escolher o Modelo Certo — Semana da Saúde',
  description: 'Semana da Saúde 2026: guia completo pra escolher o jaleco para enfermeiro ideal. Tecidos, modelagens, NR-32 e dicas práticas de quem entende de uniforme de enfermagem.',
  keywords: 'jaleco enfermeiro, jaleco branco enfermagem, uniforme enfermagem, NR-32 jaleco, semana da saude, jaleco para enfermeiro',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-enfermeiro-semana-saude' },
  openGraph: {
    title: 'Jaleco para Enfermeiro: Como Escolher — Semana da Saúde 2026',
    description: 'Guia completo para escolher o jaleco de enfermeiro ideal: tecidos, NR-32 e dicas práticas.',
    url: 'https://jaleca.com.br/blog/jaleco-enfermeiro-semana-saude',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80', width: 1200, height: 630 }],
  },
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual a cor de jaleco que o enfermeiro pode usar?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'O jaleco branco é o padrão universal para enfermagem. Muitas instituições permitem jalecos coloridos em áreas como pediatria e oncologia. Sempre consulte o código de vestimenta do seu local de trabalho.'
      }
    },
    {
      '@type': 'Question',
      name: 'O jaleco de enfermeiro precisa seguir a NR-32?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Sim. A NR-32 exige mangas longas em ambientes com risco biológico, uso exclusivo nas dependências do trabalho e lavagem adequada pelo empregador. O jaleco é considerado EPI.'
      }
    },
    {
      '@type': 'Question',
      name: 'Existe diferença entre o jaleco de enfermeiro e o de médico?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Na prática, a proteção é a mesma. Ambos devem seguir a NR-32. As diferenças são sutis: modelagem, tipo de gola e personalização do bordado com o conselho profissional (COREN para enfermagem, CRM para medicina).'
      }
    }
  ]
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Enfermeiro: Como Escolher o Modelo Certo — Semana da Saúde',
  description: 'Guia completo sobre jaleco para enfermeiro: tecidos, NR-32 e como escolher o uniforme de enfermagem ideal.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/blog/jaleco-enfermeiro-semana-saude',
  datePublished: '2026-04-28',
  dateModified: '2026-04-28',
  image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=1200&q=80',
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
          <span className="text-foreground">Jaleco para Enfermeiro</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} /> 28 de Abril de 2026</span>
            <span className="flex items-center gap-1"><User size={14} /> Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} /> 8 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Semana da Saúde: Seu Jaleco de Enfermeiro é Aliado ou Inimigo?
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Com o Dia da Segurança no Trabalho chegando (28/04), a gente para e pensa: o uniforme de enfermagem que vc usa realmente te protege? Guia completo sobre jaleco para enfermeiro.
          </p>
        </header>

        <div className="mb-8 rounded-lg overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&q=80"
            alt="Enfermeira de jaleco branco em ambiente hospitalar — Semana da Saúde"
            className="w-full h-auto block"
            style={{ maxHeight: 420, objectFit: 'cover' }}
          />
        </div>

        <div className="prose prose-lg max-w-none">
          <p>
            A Semana da Saúde chegou, e com o Dia da Segurança e Saúde no Trabalho batendo na porta (28/04), a gente para e pensa: estamos mesmo seguros na nossa rotina? Para a galera da enfermagem, essa pergunta passa diretamente pelo nosso uniforme. O jaleco não é só uma peça branca que nos identifica no corredor do hospital. Ele é um Equipamento de Proteção Individual (EPI) fundamental.
          </p>
          <p>
            Escolher o <strong>jaleco para enfermeiro</strong> certo vai muito além da estética. Envolve conforto para aguentar um plantão de 12 horas, funcionalidade para ter tudo à mão e segurança para proteger você e seus pacientes.
          </p>

          <h2>O Jaleco Como Barreira de Proteção: O que a NR-32 Exige?</h2>
          <p>
            Seu jaleco é sua primeira linha de defesa contra fluidos, respingos e contaminações. A Norma Regulamentadora 32 (NR-32) foi criada exatamente para estabelecer diretrizes de segurança para os profissionais da saúde — e ela fala diretamente sobre o nosso <strong>uniforme de enfermagem</strong>.
          </p>

          <h3>Pontos Chave da NR-32 para seu Uniforme</h3>
          <ul>
            <li>
              <strong>Mangas Longas:</strong> Em qualquer ambiente com risco biológico (hospitais, clínicas, laboratórios), o uso de jaleco com mangas longas é obrigatório. Modelos de manga curta ou 3/4 não oferecem a proteção necessária.
            </li>
            <li>
              <strong>Uso Exclusivo no Trabalho:</strong> A norma é clara — o jaleco deve ser usado APENAS nas dependências do local de trabalho. Sair pra almoçar ou voltar pra casa com ele é uma prática de risco.
            </li>
            <li>
              <strong>Lavagem Adequada:</strong> A responsabilidade pela higienização dos uniformes usados em ambientes com risco biológico é do empregador. O ideal é que o profissional não leve o jaleco sujo pra casa.
            </li>
          </ul>

          <h2>Decifrando os Tecidos: Encontre o Material Perfeito para Você</h2>

          <h3>Gabardine: O Queridinho da Durabilidade</h3>
          <p>
            Um dos tecidos mais populares. Feito de poliéster ou com misturas, o gabardine é extremamente resistente, amassa muito pouco e tem um caimento elegante. Ele cria uma excelente barreira física, sendo ideal pro dia a dia corrido. Por ser mais encorpado, pode ser um pouco quente em locais sem ar-condicionado.
          </p>

          <h3>Microfibra: Leveza e Praticidade</h3>
          <p>
            Se vc busca um jaleco leve, que seca rápido e quase não precisa passar, a microfibra é sua melhor amiga. Tem um toque sedoso e agradável. Ótima opção pra quem trabalha em cidades mais quentes ou valoriza a praticidade acima de tudo.
          </p>

          <h3>Oxford: O Melhor Custo-Benefício</h3>
          <p>
            Muito usado em uniformes, o oxford é resistente e tem um preço mais acessível. Uma escolha inteligente pra estudantes de enfermagem ou pra quem precisa de várias peças pra o rodízio semanal.
          </p>

          <h3>Tecidos com Elastano: Conforto em Movimento</h3>
          <p>
            A adição de elastano na composição é uma revolução no conforto. Esse tipo de jaleco estica e se adapta aos seus movimentos, dando total liberdade pra se abaixar, levantar um paciente ou correr durante uma emergência. O investimento é um pouco maior, mas o conforto compensa.
          </p>

          <h2>Modelagem e Detalhes que Fazem a Diferença</h2>

          <h3>O Caimento Ideal: Acinturado ou Reto?</h3>
          <p>
            A escolha entre acinturado e reto é pessoal. Modelos acinturados, muito comuns nos <Link href="/produtos?categoria=jalecos-femininos">jalecos femininos</Link>, desenham a silhueta e trazem elegância. Já os cortes retos, presentes em muitos <Link href="/produtos?categoria=jalecos-masculinos">jalecos masculinos</Link> e modelos unissex, oferecem mais espaço e visual clássico.
          </p>
          <p>
            O mais importante é que a peça permita mover os braços e o tronco livremente, sem repuxar ou prender.
          </p>

          <h3>Punhos e Golas: Detalhes de Segurança</h3>
          <p>
            Os punhos devem ser justos pra evitar que a manga entre em contato com superfícies contaminadas. Modelos com punho de ribana (tecido canelado e elástico) são excelentes — se ajustam perfeitamente sem apertar.
          </p>

          <h3>Bolsos: Seus Melhores Amigos</h3>
          <p>
            Um bom <Link href="/jaleco-enfermeiro">jaleco para enfermeiro</Link> precisa de bolsos funcionais. Pense no que vc carrega: celular, canetas, álcool em gel, bloco de anotações. Bolsos inferiores fundos e bem costurados, com um bolso superior menor, costumam ser a combinação perfeita.
          </p>

          <h2>FAQ: Suas Dúvidas sobre Jaleco de Enfermagem Respondidas</h2>

          <h3>Qual a cor de jaleco que o enfermeiro pode usar?</h3>
          <p>
            O <strong>jaleco branco enfermagem</strong> é o padrão universal, simbolizando higiene e cuidado. Muitas instituições, especialmente em pediatria, oncologia e psiquiatria, já permitem jalecos coloridos ou estampados pra criar um ambiente mais acolhedor. A regra de ouro: sempre consulte o código de vestimenta do seu local de trabalho antes de comprar.
          </p>

          <h3>Como tirar as medidas para comprar o jaleco online?</h3>
          <p>
            Não confie apenas no seu tamanho &quot;P&quot; ou &quot;G&quot; de sempre. Use fita métrica e meça busto, cintura e quadril. Compare essas medidas com a tabela de tamanhos da loja. Um jaleco no tamanho certo é sinônimo de conforto e segurança.
          </p>

          <h3>Existe diferença entre o jaleco de enfermeiro e o de médico?</h3>
          <p>
            Na prática, a estrutura e a função de proteção são as mesmas. Tanto o <Link href="/jaleco-enfermeiro">jaleco para enfermeiro</Link> quanto o <Link href="/jaleco-medico">jaleco para médico</Link> devem seguir a NR-32. As diferenças são sutis: preferências de modelagem, tipo de gola ou o bordado com o conselho profissional (COREN para enfermagem, CRM para medicina).
          </p>
        </div>

        <div className="mt-12 pt-8 border-t border-[#e5e0d8]">
          <p className="text-sm text-muted-foreground mb-4">Veja também:</p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/jaleco-enfermeiro" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Jaleco para Enfermeiro
            </Link>
            <Link href="/jaleco-enfermeira" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Jaleco para Enfermeira
            </Link>
            <Link href="/blog/pijama-cirurgico-guia-completo" className="text-sm font-medium text-[#1a1a1a] hover:underline">
              → Guia do Pijama Cirúrgico
            </Link>
          </div>
        </div>
      </article>
    </>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock, User } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Jaleco para Estudante de Medicina: Qual Comprar e Como Cuidar',
  description: 'Guia completo do jaleco para estudante de medicina: modelo ideal, tamanho certo, bordado com nome, quanto investir e como conservar o primeiro jaleco da faculdade.',
  keywords: 'jaleco estudante medicina, jaleco para faculdade medicina, jaleco acadêmico, primeiro jaleco medicina, jaleco para estudante de enfermagem, jaleco academia medicina',
  alternates: { canonical: 'https://jaleca.com.br/blog/jaleco-estudante-medicina' },
  openGraph: {
    title: 'Jaleco para Estudante de Medicina: Tudo que Você Precisa Saber',
    description: 'Qual jaleco comprar para faculdade de medicina, bordado, tamanho e como conservar. Guia completo.',
    url: 'https://jaleca.com.br/blog/jaleco-estudante-medicina',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Estudante de Medicina: Tudo que Você Precisa Saber',
  description: 'Guia completo: qual jaleco comprar para medicina, bordado, tamanho e cuidados.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: { '@type': 'Organization', name: 'Jaleca', url: 'https://jaleca.com.br', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/og-home.jpg' } },
  datePublished: '2026-05-05',
  dateModified: '2026-05-05',
  url: 'https://jaleca.com.br/blog/jaleco-estudante-medicina',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Qual jaleco comprar para faculdade de medicina?',
      acceptedAnswer: { '@type': 'Answer', text: 'Para faculdade de medicina, o jaleco clássico branco de manga longa é o padrão. Tecido recomendado: gabardine com pelo menos 60% de poliéster — resiste melhor ao amarelamento após várias lavagens do que o algodão puro. Comprimento no joelho ou abaixo é o mais aceito nas universidades. Verifique se sua faculdade tem regulamento específico.' },
    },
    {
      '@type': 'Question',
      name: 'Bordado com nome é obrigatório no jaleco de faculdade?',
      acceptedAnswer: { '@type': 'Answer', text: 'Depende da instituição. Muitas universidades exigem identificação visível — nome completo, número de matrícula ou CRM (quando aplicável). Algumas exigem bordado, outras aceitam crachá. Consulte o regulamento do seu curso. Importante: faça o bordado após comprar o jaleco, pois a peça não pode ser trocada depois de personalizada.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco de estudante é diferente do jaleco profissional?',
      acceptedAnswer: { '@type': 'Answer', text: 'Não existe um jaleco exclusivo para estudantes. O jaleco clássico branco de manga longa serve para os dois. A diferença está na identificação: o estudante usa seu nome e nome da faculdade no bordado; o médico formado usa nome e CRM. O modelo e o tecido são iguais.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco branco ou colorido para faculdade?',
      acceptedAnswer: { '@type': 'Answer', text: 'Branco é o padrão universal nas universidades de medicina brasileiras. Algumas faculdades diferenciam o semestre ou o curso pela cor do jaleco — verde para biomedicina, azul para enfermagem — mas isso é definido pela instituição. Para medicina, branco é sempre a escolha segura.' },
    },
    {
      '@type': 'Question',
      name: 'Quanto custa um bom jaleco para faculdade de medicina?',
      acceptedAnswer: { '@type': 'Answer', text: 'Um jaleco de qualidade para faculdade de medicina custa entre R$180 e R$350, dependendo do tecido, marca e modelo. Evite jalecos muito baratos (abaixo de R$80) — o tecido não mantém o branco após poucos meses de uso intenso. Um jaleco de boa qualidade com cuidados adequados dura toda a faculdade.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco para Estudante de Medicina', item: 'https://jaleca.com.br/blog/jaleco-estudante-medicina' },
  ],
}

export default function BlogPost() {
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
          <span className="text-foreground">Jaleco para Estudante de Medicina</span>
        </nav>

        <header className="mb-10">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1"><Calendar size={14} />5 de Maio de 2026</span>
            <span className="flex items-center gap-1"><User size={14} />Jaleca</span>
            <span className="flex items-center gap-1"><Clock size={14} />6 min de leitura</span>
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold leading-tight text-[#1a1a1a] mb-4">
            Jaleco para Estudante de Medicina: Tudo que Você Precisa Saber
          </h1>
          <p className="text-lg text-[#555] leading-relaxed">
            Do primeiro jaleco da cerimônia de recepção ao uso diário nas aulas práticas — guia completo para não errar na escolha.
          </p>
        </header>

        <div className="prose prose-lg max-w-none">
          <h2>Por que o jaleco importa desde a faculdade</h2>
          <p>
            O jaleco é mais do que um uniforme na medicina. A cerimônia de entrega do jaleco branco ("White Coat Ceremony") que acontece em muitas faculdades é um rito de passagem — o momento em que o estudante assume formalmente a identidade da profissão. Essa simbologia torna a escolha do jaleco mais do que uma decisão de compra.
          </p>
          <p>
            Mas além do simbolismo, o jaleco de faculdade precisa ser prático: vai lavar muito, passar por aulas práticas de anatomia, estágios hospitalares e longos dias de estudo. Tecido e qualidade importam para que ele dure toda a graduação.
          </p>

          <h2>Modelo ideal para estudante de medicina</h2>
          <p>
            O jaleco clássico branco de manga longa é o padrão em todas as universidades de medicina brasileiras. As características essenciais:
          </p>
          <ul>
            <li><strong>Manga longa:</strong> obrigatória nas aulas práticas com exposição biológica (NR-32)</li>
            <li><strong>Comprimento no joelho ou abaixo:</strong> padrão mais aceito institucionalmente</li>
            <li><strong>Dois bolsos na altura do quadril:</strong> para estetoscópio, caneta e caderneta</li>
            <li><strong>Tecido com pelo menos 60% de poliéster:</strong> resiste melhor ao amarelamento</li>
            <li><strong>Cor branca:</strong> única cor aceita na maioria das universidades</li>
          </ul>
          <p>
            O modelo slim pode parecer mais elegante, mas para uso intenso na faculdade — agachamentos no campo, inclinações em bancada, movimentos amplos — o clássico com um pouco de elastano oferece melhor custo-benefício.
          </p>

          <h2>Bordado com nome: obrigatório?</h2>
          <p>
            Depende da sua faculdade. Muitas universidades exigem identificação visível no jaleco — nome completo, curso e matrícula bordados. Outras aceitam apenas o crachá. Verifique o regulamento antes de bordar.
          </p>
          <p>
            Se o bordado for necessário, faça-o em uma bordadeira local após receber o jaleco — os valores variam de R$30 a R$80 dependendo do tamanho e da complexidade. Importante: após o bordado, o jaleco não pode ser trocado. Confirme o tamanho antes de personalizar.
          </p>

          <h2>Como escolher o tamanho certo</h2>
          <p>
            Meça busto e cintura com uma fita métrica e compare com a tabela de medidas do fabricante. Para jaleco feminino, veja o <Link href="/blog/jaleco-feminino-tamanho-certo-como-medir" className="text-[#1a6fa8] hover:underline">guia completo de medidas para jaleco feminino</Link>. Na dúvida entre dois tamanhos, opte pelo maior — um jaleco levemente folgado tem melhor caimento do que um apertado nos ombros.
          </p>

          <h2>Quanto investir no primeiro jaleco</h2>
          <p>
            Para faculdade de medicina, um jaleco de qualidade adequada custa entre R$180 e R$280. Esse valor garante tecido com boa proporção de poliéster (que mantém o branco), costuras reforçadas e durabilidade para os 6 anos da graduação.
          </p>
          <p>
            Jalecos abaixo de R$80 costumam amarelam após 3 a 6 meses de uso e lavagem frequente — o que obriga a comprar outro, duplicando o custo. Jalecos acima de R$350 para estudantes costumam ser desnecessários — o investimento extra em premium faz mais sentido quando você já está em consultório.
          </p>

          <h2>Como conservar o jaleco de faculdade</h2>
          <p>
            O jaleco de medicina lava muito. Para manter o branco impecável e o tecido íntegro:
          </p>
          <ul>
            <li>Lave em água fria ou morna — máximo 40°C</li>
            <li>Use sabão neutro ou específico para branco</li>
            <li>Use alvejante com oxigênio ativo (não cloro) apenas em manchas específicas</li>
            <li>Seque à sombra — sol direto amarela o tecido branco</li>
            <li>Passe com ferro na temperatura indicada na etiqueta</li>
          </ul>
          <p>
            Para instruções detalhadas, leia: <Link href="/blog/como-lavar-jaleco-branco" className="text-[#1a6fa8] hover:underline">como lavar jaleco branco sem amarelado</Link>.
          </p>
        </div>

        <div className="mt-10 p-6 bg-[#faf9f7] border border-[#e8e0d5]">
          <p className="text-sm text-muted-foreground mb-3">Aprofunde-se no tema:</p>
          <div className="flex flex-col gap-2">
            <Link href="/blog/como-lavar-jaleco-branco" className="text-[#c4a97d] hover:underline text-sm">→ Como lavar jaleco branco sem amarelado</Link>
            <Link href="/blog/jaleco-feminino-tamanho-certo-como-medir" className="text-[#c4a97d] hover:underline text-sm">→ Guia de medidas: como saber o tamanho certo</Link>
            <Link href="/blog/jaleco-para-medica-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco para médica: guia completo</Link>
            <Link href="/blog/jaleco-masculino-guia-completo" className="text-[#c4a97d] hover:underline text-sm">→ Jaleco masculino: modelos e como escolher</Link>
          </div>
        </div>

        <div className="mt-12 p-8 bg-[#faf9f7] border border-[#e8e0d5]">
          <h3 className="font-display text-xl font-semibold mb-2">Escolha seu jaleco de faculdade</h3>
          <p className="text-muted-foreground mb-4">
            Jaleco clássico branco de manga longa, do PP ao G3. Qualidade para durar toda a graduação.
          </p>
          <Link
            href="/categoria/jalecos"
            className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-sm font-semibold tracking-widest uppercase hover:bg-[#333]"
          >
            Ver Jalecos
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

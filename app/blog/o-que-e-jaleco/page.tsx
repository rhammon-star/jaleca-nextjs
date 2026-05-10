import type { Metadata } from 'next'
import Link from 'next/link'
import { Calendar, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'O que é Jaleco? Origem, Tipos e Para que Serve',
  description: 'O que é jaleco, para que serve e quais são os tipos: tradicional, slim, manga curta, scrub e dólmã. Guia completo sobre o jaleco profissional e suas diferenças.',
  keywords: 'o que e jaleco, o que é jaleco, o que é um jaleco, para que serve o jaleco, tipos de jaleco, jaleco profissional, significado jaleco',
  alternates: { canonical: 'https://jaleca.com.br/blog/o-que-e-jaleco' },
  openGraph: {
    title: 'O que é Jaleco? Origem, Tipos e Para que Serve',
    description: 'Guia completo sobre o jaleco: o que é, para que serve, tipos disponíveis e como escolher o certo para sua profissão.',
    url: 'https://jaleca.com.br/blog/o-que-e-jaleco',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
    images: [{ url: 'https://jaleca.com.br/og-home.jpg', width: 1200, height: 630 }],
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'O que é Jaleco? Origem, Tipos e Para que Serve',
  description: 'Guia completo sobre o jaleco profissional: definição, história, tipos e como escolher.',
  author: { '@type': 'Organization', name: 'Jaleca' },
  publisher: {
    '@type': 'Organization',
    name: 'Jaleca',
    logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' },
    url: 'https://jaleca.com.br',
  },
  datePublished: '2026-05-05',
  dateModified: '2026-05-05',
  url: 'https://jaleca.com.br/blog/o-que-e-jaleco',
  image: 'https://jaleca.com.br/og-home.jpg',
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'O que é jaleco?',
      acceptedAnswer: { '@type': 'Answer', text: 'Jaleco é uma peça de vestuário profissional — geralmente uma bata com manga longa, abertura frontal com botões ou zíper — usada por profissionais da saúde (médicos, dentistas, enfermeiros), profissionais de gastronomia, laboratório e outras áreas que exigem identificação visual ou proteção básica. O jaleco profissional é feito em tecidos técnicos (gabardine, elastex, microfibra) que resistem a lavagens frequentes e mantêm o caimento.' },
    },
    {
      '@type': 'Question',
      name: 'Qual a diferença entre jaleco e avental?',
      acceptedAnswer: { '@type': 'Answer', text: 'O jaleco é uma bata que se veste como uma camisa — tem mangas, colarinho e abre na frente. O avental não tem mangas e é usado sobre a roupa, preso por alças. Na área da saúde, jaleco é o padrão em consultórios e clínicas. O avental é mais comum em laboratórios, cozinhas e em procedimentos que exigem proteção adicional.' },
    },
    {
      '@type': 'Question',
      name: 'Qual a diferença entre jaleco e scrub?',
      acceptedAnswer: { '@type': 'Answer', text: 'Jaleco é a bata tradicional, usada sobre a roupa. Scrub é um conjunto (blusa + calça) desenvolvido para uso em ambientes hospitalares — especialmente centros cirúrgicos e UTIs. O jaleco é mais formal e usado em consultórios. O scrub é mais confortável para jornadas longas e plantões.' },
    },
    {
      '@type': 'Question',
      name: 'Jaleco é obrigatório para médicos e dentistas?',
      acceptedAnswer: { '@type': 'Answer', text: 'O uso de jaleco não é obrigatório por lei federal, mas é exigido por normas institucionais (hospitais, clínicas, faculdades) e por protocolos de cada conselho de classe. Na prática, a ausência de jaleco em consultório é rara porque a peça faz parte da identidade profissional da saúde e transmite confiança ao paciente.' },
    },
  ],
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://jaleca.com.br/blog' },
    { '@type': 'ListItem', position: 3, name: 'O que é Jaleco', item: 'https://jaleca.com.br/blog/o-que-e-jaleco' },
  ],
}

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
          <span className="text-foreground">O que é Jaleco</span>
        </nav>

        {/* META */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-6">
          <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> 05 mai 2026</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> 6 min de leitura</span>
        </div>

        <h1 className="font-display text-3xl md:text-4xl font-semibold mb-4 leading-tight">
          O que é jaleco? Origem, tipos e para que serve
        </h1>

        <p className="text-muted-foreground text-base leading-relaxed mb-8">
          O jaleco é uma das peças de vestuário mais reconhecidas do universo profissional — qualquer pessoa imediatamente associa o jaleco branco ao médico ou dentista. Mas o que exatamente define um jaleco, qual é sua origem e quais são os tipos disponíveis?
        </p>

        <hr className="border-border mb-8" />

        {/* DEFINIÇÃO */}
        <section className="mb-8">
          <h2 className="font-display text-2xl font-semibold mb-4">Definição: o que é jaleco</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            <strong>Jaleco é uma bata profissional</strong> — geralmente com mangas longas ou curtas, abertura frontal com botões ou zíper e um ou mais bolsos — usada por profissionais que precisam de identificação visual, proteção básica ou conformidade com normas institucionais.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            No Brasil, o jaleco é mais associado à <strong>área da saúde</strong>: médicos, dentistas, enfermeiros, farmacêuticos, biomédicos, fisioterapeutas e nutricionistas. Mas a peça também é usada em gastronomia profissional, laboratórios de análises, indústria farmacêutica e estética.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            O jaleco profissional atual é produzido em tecidos técnicos que resistem a lavagens frequentes com alvejante sem encolher ou perder o caimento — diferente dos aventais domésticos ou da roupa comum adaptada.
          </p>
        </section>

        {/* ORIGEM */}
        <section className="mb-8">
          <h2 className="font-display text-2xl font-semibold mb-4">Origem do jaleco</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            A palavra <em>jaleco</em> tem origem no árabe <em>julaqqiyya</em>, que chegou ao português pelo espanhol <em>jaco</em> (um tipo de gibão, peça de vestuário medieval). Com o tempo, o termo foi adaptado para designar a bata profissional de trabalho.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-4">
            O jaleco branco médico como conhecemos hoje popularizou-se no final do século XIX, quando a medicina passou a adotar padrões de higiene mais rígidos. O branco foi escolhido por indicar limpeza e por tornar visíveis os respingos e manchas — sinalizando ao profissional a necessidade de trocar a peça.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            No Brasil, o jaleco colorido ganhou espaço a partir dos anos 2000, especialmente em áreas como nutrição, odontologia estética e fisioterapia, onde a cor faz parte da identidade visual da clínica.
          </p>
        </section>

        {/* PARA QUE SERVE */}
        <section className="mb-8">
          <h2 className="font-display text-2xl font-semibold mb-4">Para que serve o jaleco</h2>
          <div className="space-y-3">
            {[
              { titulo: 'Identificação profissional', texto: 'O jaleco distingue o profissional de saúde dos pacientes e visitantes. Em ambientes hospitalares, a cor e o modelo do jaleco podem indicar a função do profissional (médico, enfermeiro, residente).' },
              { titulo: 'Proteção básica', texto: 'O jaleco protege a roupa pessoal do profissional contra respingos, fluidos e produtos químicos. Não é um EPI completo, mas serve como barreira de proteção básica em consultórios e clínicas.' },
              { titulo: 'Higiene', texto: 'A peça é trocada regularmente e lavada em altas temperaturas, reduzindo o risco de contaminação cruzada. O tecido do jaleco profissional é projetado para suportar lavagens frequentes sem degradar.' },
              { titulo: 'Confiança do paciente', texto: 'Estudos mostram que o jaleco aumenta a percepção de credibilidade do profissional pelo paciente. O "efeito jaleco branco" é reconhecido na literatura médica como fator de confiança no atendimento.' },
            ].map((item, i) => (
              <div key={i} className="border border-border p-4 rounded-sm">
                <strong className="block text-sm mb-1">{item.titulo}</strong>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.texto}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TIPOS */}
        <section className="mb-8">
          <h2 className="font-display text-2xl font-semibold mb-4">Tipos de jaleco</h2>
          <p className="text-muted-foreground leading-relaxed mb-6">
            Existe mais de um tipo de jaleco — e a escolha certa depende da profissão, do ambiente de trabalho e do protocolo da instituição. Veja os principais:
          </p>
          <div className="space-y-4">
            {[
              {
                tipo: 'Jaleco tradicional (manga longa)',
                desc: 'O modelo clássico — manga longa, abertura frontal com botões, dois ou três bolsos. É o padrão em consultórios médicos e faculdades de ciências da saúde. Disponível em branco e colorido.',
                href: '/categoria/jalecos',
              },
              {
                tipo: 'Jaleco Slim (acinturado)',
                desc: 'Corte acinturado com recortes laterais que seguem a silhueta. O modelo mais escolhido por médicas e dentistas que querem um visual elegante e profissional. O tecido com elastano garante liberdade de movimento.',
                href: '/jaleco-feminino',
              },
              {
                tipo: 'Jaleco manga curta',
                desc: 'Versão com mangas mais curtas, mais leve e confortável para ambientes quentes. Muito usado por dentistas, esteticistas e profissionais que trabalham em clínicas com ar-condicionado ou em regiões quentes.',
                href: '/categoria/jalecos-manga-curta',
              },
              {
                tipo: 'Scrub (conjunto)',
                desc: 'Blusa + calça desenvolvidos para uso em centros cirúrgicos, UTIs e plantões longos. Mais confortável que o jaleco para jornadas de 12h. Não é tecnicamente um jaleco, mas cumpre função similar em ambientes hospitalares.',
                href: '/categoria/conjuntos',
              },
              {
                tipo: 'Dólmã',
                desc: 'Bata de manga curta com abertura lateral — muito usada por médicos em procedimentos cirúrgicos, profissionais de gastronomia e em ambientes que exigem mais mobilidade dos braços.',
                href: '/categoria/domas',
              },
            ].map((item, i) => (
              <div key={i} className="border-l-2 border-[#c4a97d] pl-4 py-1">
                <strong className="block text-sm mb-1">{item.tipo}</strong>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">{item.desc}</p>
                <Link href={item.href} className="text-xs text-[#c4a97d] hover:underline">Ver modelos →</Link>
              </div>
            ))}
          </div>
        </section>

        {/* DIFERENÇAS */}
        <section className="mb-8">
          <h2 className="font-display text-2xl font-semibold mb-4">Jaleco vs. avental vs. scrub</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-[#1a1a1a] text-white">
                  <th className="text-left p-3">Peça</th>
                  <th className="text-left p-3">Tem mangas?</th>
                  <th className="text-left p-3">Uso principal</th>
                  <th className="text-left p-3">Onde é padrão</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                {[
                  { peca: 'Jaleco', mangas: 'Sim (longa ou curta)', uso: 'Sobre a roupa', onde: 'Consultório, clínica, faculdade' },
                  { peca: 'Avental', mangas: 'Não', uso: 'Sobre a roupa, preso por alças', onde: 'Laboratório, cozinha' },
                  { peca: 'Scrub', mangas: 'Sim (curta)', uso: 'Veste completo (blusa + calça)', onde: 'Centro cirúrgico, UTI, plantão' },
                  { peca: 'Dólmã', mangas: 'Sim (curta, abertura lateral)', uso: 'Sobre ou completo', onde: 'Cirurgia, gastronomia' },
                ].map((row, i) => (
                  <tr key={i} className={`border-b border-border ${i % 2 === 0 ? '' : 'bg-muted/30'}`}>
                    <td className="p-3 font-medium text-foreground">{row.peca}</td>
                    <td className="p-3">{row.mangas}</td>
                    <td className="p-3">{row.uso}</td>
                    <td className="p-3">{row.onde}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-8">
          <h2 className="font-display text-2xl font-semibold mb-4">Perguntas frequentes sobre jaleco</h2>
          <div className="space-y-1 border border-border divide-y divide-border">
            {[
              { q: 'O que é jaleco?', a: 'Jaleco é uma bata profissional com mangas, abertura frontal com botões ou zíper e bolsos, usada por profissionais da saúde, gastronomia e laboratório para identificação, proteção básica e higiene.' },
              { q: 'Qual a diferença entre jaleco e avental?', a: 'O jaleco tem mangas e é vestido como uma camisa por cima da roupa. O avental não tem mangas e é preso por alças. O jaleco é o padrão em consultórios; o avental é mais usado em laboratórios e cozinhas.' },
              { q: 'Jaleco é obrigatório para médicos?', a: 'Não existe lei federal que obrigue o uso de jaleco, mas é exigido por normas institucionais da maioria dos hospitais, clínicas e faculdades de medicina. Na prática, é quase universal na área da saúde.' },
              { q: 'Jaleco pode ser colorido?', a: 'Sim. Jaleco colorido é amplamente aceito em clínicas privadas, consultórios de nutrição, estética, fisioterapia e odontologia. O CFM, CRO e COFEN não proíbem jaleco colorido — a norma de cor é institucional, não do conselho.' },
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
              { href: '/blog/tipos-de-jaleco', label: 'Tipos de jaleco: guia visual completo' },
              { href: '/jaleco-feminino', label: 'Jaleco feminino — guia completo' },
              { href: '/modelo-de-jaleco', label: 'Modelos de jaleco feminino' },
              { href: '/jaleco-elegante', label: 'Jaleco elegante e de alfaiataria' },
              { href: '/blog/jaleco-ou-scrub-consultorio', label: 'Jaleco ou scrub para o consultório?' },
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
          <p className="font-display text-xl font-semibold mb-2">Encontre o jaleco certo para sua profissão</p>
          <p className="text-sm text-muted-foreground mb-4">Slim, Princesa, Duquesa ou Elastex. Do PP ao G3. Entrega para todo o Brasil.</p>
          <Link href="/categoria/jalecos-femininos" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] text-white text-xs uppercase tracking-widest hover:bg-[#333] transition-colors">
            Ver jalecos ↗
          </Link>
        </div>

      </main>
    </>
  )
}

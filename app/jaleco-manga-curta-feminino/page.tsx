import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Jaleco Manga Curta Feminino: Conforto em Climas Quentes | Jaleca',
  description: 'Jaleco manga curta feminino para clínicas com ar pesado, verão e profissionais que pegam muito sol. Gabardine leve, PP ao G3, ⭐ 4.9 no Google.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-manga-curta-feminino' },
  openGraph: {
    title: 'Jaleco Manga Curta Feminino | Jaleca',
    description: 'Jaleco feminino manga curta para climas quentes. PP ao G3, leve, com elastano.',
    url: 'https://jaleca.com.br/jaleco-manga-curta-feminino',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
}

const FAQ = [
  { q: 'Jaleco manga curta pode usar em hospital?', a: 'Depende do protocolo da instituição. A maioria dos hospitais e clínicas exige manga longa por barreira de proteção. Em odontologia o CRO de cada estado define — muitos exigem manga 3/4 ou longa. Verifique antes da compra.' },
  { q: 'Jaleco manga curta é mais barato?', a: 'Não significativamente — o custo do jaleco vem do molde, da costura e do gabardine, não do comprimento da manga. A versão manga curta é ofertada como opção de conforto, não como linha econômica.' },
  { q: 'Para que profissões o jaleco manga curta é indicado?', a: 'Esteticista, fisioterapeuta, nutricionista, psicóloga, farmacêutica em drogaria, profissionais de estética masculina, dermatologista em clínica refrigerada. Profissionais que ficam em climas quentes ou em movimentos repetitivos.' },
  { q: 'Jaleco manga curta feminino tem plus size?', a: 'Sim — do PP ao G3, com molde próprio em cada grade. Manga curta no plus size é especialmente útil para conforto em climas quentes.' },
  { q: 'Qual o comprimento ideal de manga curta em jaleco feminino?', a: 'A manga deve terminar 2-3cm acima do cotovelo. Mais longa parece manga 3/4 mal proporcionada; mais curta perde funcionalidade e o caimento fica "polo masculino". O molde Jaleca é calibrado para essa proporção.' },
]

export default function Page() {
  const schemaFaq = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })),
  }
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
      { '@type': 'ListItem', position: 2, name: 'Jaleco Feminino', item: 'https://jaleca.com.br/jaleco-feminino' },
      { '@type': 'ListItem', position: 3, name: 'Manga Curta', item: 'https://jaleca.com.br/jaleco-manga-curta-feminino' },
    ],
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      <main style={{ fontWeight: 300 }}>
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            <li className="text-xs"><Link href="/" style={{ color: '#6b6b6b', textDecoration: 'none' }}>Início</Link></li>
            <li className="text-xs" style={{ color: '#c8c4bc' }}>/</li>
            <li className="text-xs"><Link href="/jaleco-feminino" style={{ color: '#6b6b6b', textDecoration: 'none' }}>Jaleco Feminino</Link></li>
            <li className="text-xs" style={{ color: '#c8c4bc' }}>/</li>
            <li className="text-xs" style={{ color: '#1a1a1a' }}>Manga Curta</li>
          </ol>
        </div>

        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,8vw,6rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.4rem,5.5vw,4.2rem)', fontWeight: 400, lineHeight: 1.1, color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Jaleco manga curta<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>feminino</em>
            </h1>
            <p style={{ fontSize: '1rem', color: '#6b6b6b', maxWidth: 620, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Para clínicas refrigeradas mal, verão pesado, estética e fisioterapia. Gabardine leve com elastano, molde feminino, PP ao G3.
            </p>
            <Link href="/jaleco-feminino" style={{ padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>Ver coleção feminina</Link>
          </div>
        </section>

        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem' }}>Quando manga curta é a escolha certa</h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.25rem' }}>
              Manga longa é o padrão em saúde por uma razão: barreira de proteção. Mas nem todo contexto profissional exige isso. <Link href="/jaleco-esteticista" style={{ color: '#c8a96e' }}>Esteticistas</Link>, <Link href="/jaleco-fisioterapeuta" style={{ color: '#c8a96e' }}>fisioterapeutas</Link>, <Link href="/jaleco-nutricionista" style={{ color: '#c8a96e' }}>nutricionistas</Link> e profissionais em clínicas refrigeradas precariamente se beneficiam de manga curta — menos suor, menos fadiga térmica em 8h de atendimento.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.25rem' }}>
              A versão feminina da Jaleca preserva o corte acinturado do <Link href="/jaleco-feminino" style={{ color: '#c8a96e' }}>jaleco feminino slim</Link> — a manga curta não muda o restante do molde. Comprimento até 2-3cm acima do cotovelo, com acabamento em viés que não fica engessado nem fica largo demais.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              <strong>Atenção institucional:</strong> antes de comprar, confirme com a CCIH do seu local ou com o conselho profissional do seu estado se há exigência de manga longa. Em hospital-escola e SUS, normalmente é obrigatório.
            </p>
          </div>
        </section>

        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>Dúvidas frequentes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8' }}>
              {FAQ.map((item, i) => (
                <details key={i} style={{ background: '#fff', padding: '1.5rem' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.95rem', color: '#1a1a1a' }}>{item.q}</summary>
                  <p style={{ fontSize: '0.88rem', color: '#4a4a4a', lineHeight: 1.85, marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #f0ece5' }}>{item.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

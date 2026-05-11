import type { Metadata } from 'next'
import Link from 'next/link'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Jaleco para Residência Médica: Resistência em Plantão de 24h | Jaleca',
  description: 'Jaleco para residência médica — gabardine 165-200 g/m² com elastano e DWR, suporta lavagem industrial. Manga longa, bolsos amplos, PP ao G3. ⭐ 4.9 no Google.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-para-residencia-medica' },
  openGraph: {
    title: 'Jaleco para Residência Médica | Jaleca',
    description: 'Jaleco que aguenta plantão de 24h, lavagem industrial e uso intenso.',
    url: 'https://jaleca.com.br/jaleco-para-residencia-medica',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
}

const FAQ = [
  { q: 'Quantos jalecos preciso na residência médica?', a: 'Mínimo 3 jalecos: um em uso, um lavando/secando, um de backup para contaminação. Residentes que rodam em UTI/emergência preferem 4-5. A peça vira EPI: rotação é essencial.' },
  { q: 'Qual tecido aguenta lavagem hospitalar industrial?', a: 'Gabardine poliéster/viscose com elastano, 165-200 g/m². Resiste a 60°C com sabão alcalino sem encolher nem perder cor. Algodão puro encolhe e fica amarelado após 20-30 ciclos.' },
  { q: 'Branco continua sendo obrigatório em hospital-escola?', a: 'Na maioria das instituições, sim — protocolo da CCIH. Algumas residências (psiquiatria, pediatria) permitem cor neutra. Sempre confirme com o serviço antes de comprar fora do padrão.' },
  { q: 'Bordado com nome e CRM/CRO compensa?', a: 'Sim, é mais resistente que crachá pendurado (que cai, suja, perde). A Jaleca não bordamos — recomendamos bordadeira local após receber a peça. Atenção: jaleco bordado não pode ser trocado.' },
  { q: 'Jaleco para plantão de 24h precisa ter algo diferente?', a: 'Três coisas: (1) elastano 4-6% para não travar movimentos amplos (RCP, transferência de paciente); (2) bolsos amplos e reforçados (celular, estetoscópio, caneta, lanterna); (3) gabardine de gramatura média (165-200 g/m²) que não amassa em 12-24h.' },
  { q: 'Plus size para residência funciona?', a: 'Sim. Na Jaleca o plus size (G1, G2, G3) usa o mesmo gabardine resistente da linha regular. O molde é recalculado: ombro, manga e busto. Veja o guia de jaleco plus size.' },
  { q: 'Quanto custa um jaleco de residência decente?', a: 'Entre R$180-R$350 a peça, dependendo do tecido (gabardine simples vs premium com DWR). Vale o investimento — um jaleco de R$60 não aguenta 6 meses de residência; um de R$280 dura 2+ anos.' },
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
      { '@type': 'ListItem', position: 2, name: 'Jaleco Médico', item: 'https://jaleca.com.br/jaleco-medico' },
      { '@type': 'ListItem', position: 3, name: 'Residência Médica', item: 'https://jaleca.com.br/jaleco-para-residencia-medica' },
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
            <li className="text-xs"><Link href="/jaleco-medico" style={{ color: '#6b6b6b', textDecoration: 'none' }}>Jaleco Médico</Link></li>
            <li className="text-xs" style={{ color: '#c8c4bc' }}>/</li>
            <li className="text-xs" style={{ color: '#1a1a1a' }}>Residência Médica</li>
          </ol>
        </div>

        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,8vw,6rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
            <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.4rem,5.5vw,4.2rem)', fontWeight: 400, lineHeight: 1.1, color: '#1a1a1a', marginBottom: '1.5rem' }}>
              Jaleco para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>residência médica</em>
            </h1>
            <p style={{ fontSize: '1rem', color: '#6b6b6b', maxWidth: 620, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Plantão de 24h. Lavagem industrial. Bolsos cheios. Cinco anos de uso. O jaleco da residência precisa aguentar tudo — e ainda sair bem na foto da formatura.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/jaleco-feminino" style={{ padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>Feminino</Link>
              <Link href="/jaleco-masculino" style={{ padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>Masculino</Link>
            </div>
          </div>
        </section>

        <section style={{ background: '#fff', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem' }}>O que muda de um jaleco "comum" para um de residência</h2>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.25rem' }}>
              Um jaleco de consultório vive 4-6 horas por dia, 5 dias por semana, lavagem doméstica. Um jaleco de residência vive 12-24h por dia, 6 dias por semana, lavagem hospitalar a 60°C com sabão alcalino industrial. A diferença de uso é tão grande que o mesmo modelo "premium" do consultório degrada em meses na residência.
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: '#4a4a4a', marginBottom: '1.25rem' }}>
              Três especificações fazem a diferença: <strong>gabardine 165-200 g/m²</strong> (gramatura suficiente sem ficar pesado), <strong>elastano 4-6%</strong> (mobilidade para RCP, palpação, transferência de paciente) e <strong>costuras duplas reforçadas</strong> em ombro, cava e bolso (os pontos que mais sofrem em uso intenso).
            </p>
            <p style={{ fontSize: '0.95rem', lineHeight: 1.9, color: '#4a4a4a' }}>
              Para residência, recomendamos o modelo <Link href="/jaleco-medico" style={{ color: '#c8a96e' }}>Profissional</Link> com <Link href="/jaleco-com-elastano" style={{ color: '#c8a96e' }}>elastano</Link> — disponível na <Link href="/jaleco-feminino" style={{ color: '#c8a96e' }}>linha feminina</Link> e <Link href="/jaleco-masculino" style={{ color: '#c8a96e' }}>masculina</Link>, do PP ao G3.
            </p>
          </div>
        </section>

        <section style={{ background: '#f9f7f4', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 800, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '2rem' }}>Dúvidas da residência</h2>
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

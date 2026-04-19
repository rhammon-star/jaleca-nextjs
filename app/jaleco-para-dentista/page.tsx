import type { Metadata } from 'next'
import Link from 'next/link'
import { graphqlClient, GET_PRODUCTS } from '@/lib/graphql'
import type { WooProduct } from '@/components/ProductCard'
import FaqAccordion from './FaqAccordion'

export const metadata: Metadata = {
  title: 'Jaleco para Dentista: Guia Completo 2026 | Jaleca',
  description: 'Jalecos para dentista com design premium, elastano e modelagens exclusivas. Feminino e masculino, tamanhos PP ao G3. Frete grátis acima de R$499 para SP/RJ/MG/ES.',
  alternates: { canonical: 'https://jaleca.com.br/jaleco-para-dentista' },
  openGraph: {
    title: 'Jaleco para Dentista: Guia Completo 2026',
    description: 'Qual jaleco usar na odontologia? Guia completo: modelos, normas do CRO, cuidados e comparativo Slim vs Tradicional vs Dolmã.',
    url: 'https://jaleca.com.br/jaleco-para-dentista',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'article',
  },
}

const schemaFaq = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    { '@type': 'Question', name: 'Qual comprimento de jaleco é mais indicado para dentistas?', acceptedAnswer: { '@type': 'Answer', text: 'Para odontologia, o jaleco curto (até o quadril) é mais popular por facilitar o movimento ao redor da cadeira odontológica. O longo é mais usado em procedimentos cirúrgicos.' } },
    { '@type': 'Question', name: 'O jaleco pode ser lavado com água quente?', acceptedAnswer: { '@type': 'Answer', text: 'Os jalecos Jaleca suportam lavagem a 60°C, temperatura suficiente para higienização clínica.' } },
    { '@type': 'Question', name: 'Jaleco com elastano é bom para dentista?', acceptedAnswer: { '@type': 'Answer', text: 'Sim. O elastano adiciona memória ao tecido, retornando à forma após o movimento — essencial para quem passa horas com braços elevados.' } },
    { '@type': 'Question', name: 'Jaleco de dentista precisa ser branco?', acceptedAnswer: { '@type': 'Answer', text: 'Não é obrigação. O branco é o clássico, mas tons pastel e cores discretas são aceitos. O CRO não restringe a cor.' } },
  ],
}

const schemaArticle = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Jaleco para Dentista: Guia Completo 2026',
  description: 'Tudo sobre jaleco para dentista: qual modelo escolher, jaleco branco ou colorido, normas do CRO e cuidados.',
  author: { '@type': 'Organization', name: 'Jaleca Uniformes Profissionais' },
  publisher: { '@type': 'Organization', name: 'Jaleca', logo: { '@type': 'ImageObject', url: 'https://jaleca.com.br/logo-email.png' } },
  url: 'https://jaleca.com.br/jaleco-para-dentista',
  datePublished: '2026-04-18',
  dateModified: '2026-04-18',
}

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://jaleca.com.br' },
    { '@type': 'ListItem', position: 2, name: 'Por Especialidade', item: 'https://jaleca.com.br/produtos' },
    { '@type': 'ListItem', position: 3, name: 'Jaleco para Dentista', item: 'https://jaleca.com.br/jaleco-para-dentista' },
  ],
}

async function getJalecos(): Promise<WooProduct[]> {
  try {
    const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(GET_PRODUCTS, {
      first: 6,
      category: 'jalecos',
    })
    return data?.products?.nodes ?? []
  } catch {
    return []
  }
}

export default async function JalecoDentistaPage() {
  const produtos = await getJalecos()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem 2rem' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Por Especialidade', href: '/produtos' },
              { label: 'Jaleco para Dentista', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* ── HERO ── */}
        <section
          className="grid"
          style={{ gridTemplateColumns: '1fr 1fr', minHeight: '88vh', padding: 0 }}
        >
          {/* Conteúdo */}
          <div
            className="flex flex-col justify-center"
            style={{ padding: 'clamp(3rem,8vw,5rem) clamp(2rem,5vw,4rem) clamp(3rem,8vw,5rem) clamp(2rem,8vw,7rem)', background: '#f9f7f4' }}
          >
            <div className="flex items-center gap-3 mb-6" style={{ fontSize: '0.72rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b' }}>
              <span style={{ display: 'inline-block', width: 32, height: 1, background: '#c8c4bc' }} />
              Uniforme profissional
            </div>
            <h1
              style={{
                fontFamily: "'Cormorant', Georgia, serif",
                fontSize: 'clamp(3rem,5.5vw,5.2rem)',
                fontWeight: 400,
                lineHeight: 1.05,
                letterSpacing: '-0.01em',
                color: '#1a1a1a',
                marginBottom: '1.5rem',
              }}
            >
              Jaleco para<br />
              <em style={{ fontStyle: 'italic', fontWeight: 300 }}>Dentista</em>
            </h1>
            <p style={{ fontSize: '1rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 420, marginBottom: '2.5rem', lineHeight: 1.8 }}>
              Design que une conforto clínico e elegância. Modelagens exclusivas com elastano, pensadas para o movimento do dia a dia odontológico.
            </p>
            <div className="flex gap-4 flex-wrap">
              <Link href="/produtos?categoria=jalecos-femininos" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff',
                fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em',
                textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a',
              }}>
                Feminino ↗
              </Link>
              <Link href="/produtos?categoria=jalecos-masculinos" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a',
                fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em',
                textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a',
              }}>
                Masculino →
              </Link>
            </div>
            <div className="flex items-center gap-2 mt-10">
              <span style={{ color: '#c8a96e', fontSize: '0.85rem', letterSpacing: 2 }}>★★★★★</span>
              <span style={{ fontSize: '0.78rem', color: '#6b6b6b' }}>4,9 de 5 — mais de 200 avaliações</span>
            </div>
          </div>

          {/* Imagem */}
          <div
            className="relative"
            style={{ background: 'linear-gradient(160deg, #ccc8c0 0%, #bfbab2 100%)', minHeight: 480 }}
          >
            <div className="w-full h-full flex items-end p-8">
              <span style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '0.85rem', fontStyle: 'italic', color: 'rgba(26,26,26,0.4)' }}>
                Foto do produto
              </span>
            </div>
            <div style={{
              position: 'absolute', top: '2rem', left: '2rem',
              background: '#fff', padding: '0.5rem 1rem',
              fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1a',
            }}>
              Coleção 2026
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <div
          className="grid"
          style={{ gridTemplateColumns: 'repeat(4,1fr)', background: '#1a1a1a', padding: '2rem clamp(1.5rem,5vw,4rem)' }}
        >
          {[
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M3 6h18M3 12h18M3 18h18" /></svg>, title: 'Tamanhos PP ao G3', sub: 'Grade completa, corpo real' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><ellipse cx="12" cy="12" rx="9" ry="6" /><path d="M12 3v18M3 12h18" opacity=".5" /></svg>, title: 'Com elastano', sub: 'Movimento sem restrição' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><rect x="2" y="7" width="20" height="14" rx="1" /><path d="M16 7V5a4 4 0 0 0-8 0v2" /></svg>, title: 'Frete grátis', sub: 'Acima de R$499 no Sudeste' },
            { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 20, height: 20 }}><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" /><path d="m9 12 2 2 4-4" /></svg>, title: 'Troca facilitada', sub: '30 dias sem burocracia' },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4" style={{ padding: '0.5rem 1.5rem', borderRight: i < 3 ? '1px solid rgba(255,255,255,0.12)' : 'none' }}>
              <div className="shrink-0 flex items-center justify-center" style={{ width: 40, height: 40, border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.8)' }}>
                {item.icon}
              </div>
              <div>
                <strong style={{ display: 'block', fontSize: '0.82rem', fontWeight: 400, letterSpacing: '0.06em', color: '#fff', marginBottom: '0.15rem' }}>{item.title}</strong>
                <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', letterSpacing: '0.03em' }}>{item.sub}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── GUIA ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="grid" style={{ gridTemplateColumns: '300px 1fr', gap: 'clamp(3rem,6vw,6rem)', alignItems: 'start' }}>

              {/* Sidebar */}
              <aside style={{ position: 'sticky', top: 80 }}>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Guia completo</div>
                <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.8rem', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '1.5rem' }}>
                  Como escolher o jaleco ideal para odontologia
                </h2>
                <nav>
                  <ul style={{ listStyle: 'none' }}>
                    {['Tecido e composição', 'Modelagem e silhueta', 'Cores recomendadas', 'Bolsos e funcionalidade', 'Guia de tamanhos'].map(item => (
                      <li key={item} style={{ marginBottom: '0.5rem' }}>
                        <a href={`#${item.toLowerCase().replace(/ /g, '-')}`} style={{ fontSize: '0.82rem', color: '#6b6b6b', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{ display: 'inline-block', width: 16, height: 1, background: '#c8c4bc' }} />
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>

              {/* Conteúdo */}
              <article>
                {[
                  {
                    id: 'tecido-e-composição',
                    title: 'Tecido e composição: o que realmente importa',
                    content: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          O jaleco para dentista exige requisitos específicos que vão além da estética. O tecido precisa suportar lavagens frequentes, resistir a manchas de materiais odontológicos e garantir conforto em turnos longos. Na Jaleca, utilizamos composição com elastano em proporções que preservam o caimento sem comprometer a mobilidade.
                        </p>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          A presença de elastano é determinante: enquanto o algodão puro pode dificultar a flexão dos braços durante procedimentos, a fibra elástica permite que o tecido acompanhe cada movimento do dentista com naturalidade.
                        </p>
                        <div style={{ background: '#1a1a1a', color: '#fff', padding: '1.5rem 2rem', margin: '2rem 0', borderLeft: '3px solid #c8c4bc' }}>
                          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.95rem', fontStyle: 'italic', fontWeight: 300, margin: 0 }}>
                            "O jaleco certo é aquele que você esquece que está usando — o tecido se move com você, não contra você."
                          </p>
                        </div>
                      </>
                    ),
                  },
                  {
                    id: 'modelagem-e-silhueta',
                    title: 'Modelagem e silhueta: Slim, Tradicional ou Dolmã?',
                    content: (
                      <>
                        <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                          Cada modelagem atende a um perfil profissional diferente. A escolha correta passa por entender as exigências clínicas da sua especialidade e também por preferência pessoal.
                        </p>
                        <ul style={{ listStyle: 'none', margin: '1.2rem 0 1.5rem' }}>
                          {[
                            'Slim — Modelagem mais aderente ao corpo, indicada para quem prioriza aparência elegante em consultórios premium',
                            'Tradicional — Ampla cobertura com gola padre, a escolha mais versátil para a maioria das rotinas clínicas',
                            'Dolmã — Fechamento diferenciado, reduz risco de contato com pacientes em procedimentos mais longos',
                          ].map(item => (
                            <li key={item} style={{ fontSize: '0.95rem', color: '#444', padding: '0.5rem 0 0.5rem 1.5rem', position: 'relative', borderBottom: '1px solid #e5e0d8', fontWeight: 300 }}>
                              <span style={{ position: 'absolute', left: 0, color: '#c8c4bc', fontSize: '0.85rem' }}>→</span>
                              {item}
                            </li>
                          ))}
                        </ul>
                      </>
                    ),
                  },
                  {
                    id: 'cores-recomendadas',
                    title: 'Cores: o que a evidência e o bom senso indicam',
                    content: (
                      <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                        O branco tradicional ainda é a escolha dominante na odontologia brasileira, mas tons como o cru, cinza claro e azul-marinho têm ganhado espaço. Em consultórios pediátricos, algumas profissionais optam por cores mais amigáveis para reduzir a ansiedade das crianças. O CRO não restringe a cor — o que importa é que o jaleco esteja sempre limpo.
                      </p>
                    ),
                  },
                  {
                    id: 'bolsos-e-funcionalidade',
                    title: 'Bolsos e funcionalidade clínica',
                    content: (
                      <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                        O jaleco para dentista precisa ter pelo menos um bolso no peito com profundidade suficiente para comportar uma caneta sem risco de queda durante procedimentos com o paciente reclinado. Bolsos laterais com reforço nos cantos prolongam a vida útil da peça.
                      </p>
                    ),
                  },
                  {
                    id: 'guia-de-tamanhos',
                    title: 'Como usar o guia de tamanhos Jaleca',
                    content: (
                      <p style={{ fontSize: '0.97rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
                        Nossa grade vai do PP ao G3, com tabela de medidas detalhada baseada em busto, cintura e quadril. Recomendamos sempre medir o corpo (não a roupa que você já usa) e considerar +2 a +4 cm de folga para conforto de movimento durante procedimentos odontológicos.
                      </p>
                    ),
                  },
                ].map((sec) => (
                  <div key={sec.id} id={sec.id} style={{ borderTop: '1px solid #e5e0d8', paddingTop: '2rem', marginTop: '2.5rem' }}>
                    <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 400, marginBottom: '1rem', color: '#1a1a1a' }}>
                      {sec.title}
                    </h2>
                    {sec.content}
                  </div>
                ))}
              </article>
            </div>
          </div>
        </section>

        {/* ── TABELA COMPARATIVA ── */}
        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Comparativo</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: '2.5rem' }}>
              Qual modelagem é a<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>certa para você?</em>
            </h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr>
                    <th style={{ padding: '1.5rem 1.5rem 1rem', textAlign: 'left', borderBottom: '2px solid #1a1a1a', width: 180 }}></th>
                    {['Slim', 'Tradicional', 'Dolmã'].map((m, i) => (
                      <th key={m} style={{
                        fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.3rem', fontWeight: 400,
                        padding: '1.5rem 1.5rem 1rem', textAlign: 'left',
                        borderBottom: '2px solid #1a1a1a',
                        background: i === 1 ? '#1a1a1a' : 'transparent',
                        color: i === 1 ? '#fff' : '#1a1a1a',
                        position: 'relative' as const,
                      }}>
                        {i === 1 && (
                          <span style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', fontSize: '0.6rem', letterSpacing: '0.15em', background: '#1a1a1a', color: '#c8c4bc', padding: '0.3rem 1rem', border: '1px solid rgba(255,255,255,0.2)' }}>
                            MAIS VENDIDO
                          </span>
                        )}
                        {m}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Silhueta', 'Ajustada', 'Estruturada', 'Fluida'],
                    ['Fechamento', 'Botões laterais', 'Botões frontais', 'Transpasse'],
                    ['Gola', 'Gola V', 'Gola padre', 'Gola V ampla'],
                    ['Elastano', '✓ 5%', '✓ 5%', '✓ 8%'],
                    ['Bolsos', '2 bolsos', '3 bolsos', '2 bolsos'],
                    ['Ideal para', 'Consultórios premium', 'Uso geral clínico', 'Procedimentos longos'],
                    ['A partir de', 'R$ 219', 'R$ 199', 'R$ 229'],
                  ].map(([label, slim, trad, dolma]) => (
                    <tr key={label}>
                      <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e0d8', fontSize: '0.78rem', letterSpacing: '0.06em', textTransform: 'uppercase', color: '#6b6b6b', fontWeight: 400 }}>{label}</td>
                      <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e0d8', color: '#1a1a1a' }}>{slim}</td>
                      <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e0d8', color: '#1a1a1a', background: '#f9f7f4' }}>{trad}</td>
                      <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #e5e0d8', color: '#1a1a1a' }}>{dolma}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td />
                    <td style={{ padding: '1.5rem' }}>
                      <Link href="/produtos?categoria=jalecos" style={{ display: 'inline-flex', padding: '0.75rem 1.5rem', fontSize: '0.72rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                        Ver Slim
                      </Link>
                    </td>
                    <td style={{ padding: '1.5rem', background: '#f9f7f4' }}>
                      <Link href="/produtos?categoria=jalecos" style={{ display: 'flex', justifyContent: 'center', padding: '0.85rem', fontSize: '0.72rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', background: '#1a1a1a', color: '#fff' }}>
                        Ver Tradicional →
                      </Link>
                    </td>
                    <td style={{ padding: '1.5rem' }}>
                      <Link href="/produtos?categoria=jalecos" style={{ display: 'inline-flex', padding: '0.75rem 1.5rem', fontSize: '0.72rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                        Ver Dolmã
                      </Link>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </section>

        {/* ── PRODUTOS ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div className="flex justify-between items-end flex-wrap gap-4 mb-0">
              <div>
                <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Coleção odontologia</div>
                <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
                  Jalecos para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>Dentistas</em>
                </h2>
              </div>
              <Link href="/produtos?categoria=jalecos" style={{ display: 'inline-flex', padding: '0.9rem 2rem', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a', color: '#1a1a1a' }}>
                Ver todos →
              </Link>
            </div>

            {/* Grid de produtos */}
            <div
              className="grid"
              style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5px', background: '#e5e0d8', marginTop: '3rem' }}
            >
              {produtos.length > 0 ? produtos.slice(0, 6).map(product => (
                <Link
                  key={product.id}
                  href={`/produto/${product.slug}`}
                  className="block"
                  style={{ background: '#fff', textDecoration: 'none', color: 'inherit' }}
                >
                  <div style={{ aspectRatio: '3/4', background: '#f0ede8', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                    {product.image?.sourceUrl ? (
                      <img
                        src={product.image.sourceUrl}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <span style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1rem', fontStyle: 'italic', color: '#c8c4bc' }}>
                        {product.name}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '1.25rem', background: '#fff' }}>
                    <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b6b6b', marginBottom: '0.35rem' }}>Jaleco</div>
                    <div style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.15rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.25rem' }}>{product.name}</div>
                    <div style={{ fontSize: '0.88rem', color: '#6b6b6b', fontWeight: 300 }}>
                      {product.price ? `R$ ${parseFloat(product.price.replace(/[^\d.]/g, '')).toFixed(2).replace('.', ',')}` : 'Ver preço'}
                    </div>
                  </div>
                </Link>
              )) : (
                // Placeholder quando sem produtos
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} style={{ background: '#fff' }}>
                    <div style={{ aspectRatio: '3/4', background: 'linear-gradient(170deg, #f9f7f4 0%, #e5e0d8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontFamily: "'Cormorant', Georgia, serif", fontStyle: 'italic', color: '#c8c4bc' }}>Produto</span>
                    </div>
                    <div style={{ padding: '1.25rem' }}>
                      <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b6b6b', marginBottom: '0.35rem' }}>Jaleco</div>
                      <div style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.15rem', fontWeight: 400, color: '#1a1a1a' }}>Jaleco Profissional</div>
                      <div style={{ fontSize: '0.88rem', color: '#6b6b6b', marginTop: '0.25rem' }}>Ver preço</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Dúvidas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a' }}>
              Perguntas sobre jaleco<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>para dentista</em>
            </h2>
            <FaqAccordion />
          </div>
        </section>

        {/* ── POSTS RELACIONADOS ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Blog Jaleca</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,3.5vw,3rem)', fontWeight: 400, lineHeight: 1.15, color: '#1a1a1a', marginBottom: 0 }}>
              Leitura para<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>profissionais</em>
            </h2>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(3,1fr)', gap: '2px', background: '#e5e0d8', marginTop: '3rem' }}>
              {[
                { tag: 'Cuidados com uniforme', title: 'Como lavar e conservar seu jaleco branco por mais tempo', excerpt: 'Erros simples de lavagem aceleram o amarelamento. Veja o guia de cuidados que preserva a brancura e o caimento.', href: '/blog/como-lavar-jaleco' },
                { tag: 'Biossegurança', title: 'O que o CRO recomenda sobre vestimenta clínica odontológica', excerpt: 'Normas atualizadas de biossegurança e o que realmente importa na escolha do uniforme para o consultório.', href: '/blog' },
                { tag: 'Guia de tamanhos', title: 'Como tirar suas medidas e escolher o tamanho certo sem errar', excerpt: 'Passo a passo para medir busto, cintura e quadril corretamente e encontrar o tamanho perfeito.', href: '/medidas' },
              ].map(post => (
                <Link key={post.title} href={post.href} style={{ background: '#fff', textDecoration: 'none', color: 'inherit', display: 'block' }}>
                  <div style={{ aspectRatio: '16/10', background: 'linear-gradient(135deg, #f9f7f4 0%, #e5e0d8 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '0.8rem', fontStyle: 'italic', color: '#c8c4bc' }}>Imagem</span>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                    <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: '#6b6b6b', display: 'block', marginBottom: '0.6rem' }}>{post.tag}</span>
                    <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.15rem', fontWeight: 400, lineHeight: 1.35, color: '#1a1a1a', marginBottom: '0.75rem' }}>{post.title}</h3>
                    <p style={{ fontSize: '0.85rem', color: '#6b6b6b', lineHeight: 1.7, fontWeight: 300, marginBottom: '1rem' }}>{post.excerpt}</p>
                    <span style={{ fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1a1a1a' }}>Ler artigo →</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section
          style={{
            background: '#f9f7f4',
            padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,4rem)',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              fontFamily: "'Cormorant', Georgia, serif",
              fontSize: 'clamp(6rem,18vw,18rem)', fontWeight: 300,
              color: 'rgba(26,26,26,0.04)', whiteSpace: 'nowrap', pointerEvents: 'none',
              userSelect: 'none',
            }}
          >
            JALECA
          </span>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>Pronto para começar?</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 400, lineHeight: 1.1, maxWidth: 700, margin: '0 auto 1rem', color: '#1a1a1a' }}>
              O jaleco certo<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>faz a diferença</em>
            </h2>
            <p style={{ fontSize: '0.97rem', color: '#6b6b6b', maxWidth: 480, margin: '0 auto 2.5rem', fontWeight: 300, lineHeight: 1.8 }}>
              Do PP ao G3. Elastano para máximo conforto. 12 cores. Frete grátis no Sudeste acima de R$499.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Link href="/produtos?categoria=jalecos-femininos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Coleção Feminina
              </Link>
              <Link href="/produtos?categoria=jalecos-masculinos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Coleção Masculina
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}

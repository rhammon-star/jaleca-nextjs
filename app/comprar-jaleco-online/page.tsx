import type { Metadata } from 'next'
import Link from 'next/link'

// ISR — revalida a cada 1h. Permite Vercel servir HTML estático da CDN.
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Comprar Jaleco Online | Modelos Femininos e Masculinos — Jaleca',
  description: 'Comprar jaleco online com entrega para todo o Brasil. Tecido premium, do PP ao G3, 12 cores. Frete grátis SP/RJ/MG/ES acima de R$499. Devolução em 7 dias.',
  alternates: { canonical: 'https://jaleca.com.br/comprar-jaleco-online' },
  openGraph: {
    title: 'Comprar Jaleco Online | Modelos Exclusivos — Jaleca',
    description: 'Jalecos femininos e masculinos com tecido premium. Entrega rápida, devolução em 7 dias, frete grátis no Sudeste.',
    url: 'https://jaleca.com.br/comprar-jaleco-online',
    siteName: 'Jaleca',
    locale: 'pt_BR',
    type: 'website',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Início', item: 'https://jaleca.com.br' },
        { '@type': 'ListItem', position: 2, name: 'Comprar Jaleco Online', item: 'https://jaleca.com.br/comprar-jaleco-online' },
      ],
    },
    {
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'Quais tamanhos de jaleco estão disponíveis?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A Jaleca oferece jalecos do PP ao G3, com tabela de medidas detalhada disponível no site para ajudar na escolha certa.',
          },
        },
        {
          '@type': 'Question',
          name: 'O frete é grátis para todo o Brasil?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Frete grátis (PAC) para SP, RJ, MG e ES em compras acima de R$499. Para os demais estados, simule o valor no carrinho.',
          },
        },
        {
          '@type': 'Question',
          name: 'Posso trocar meu jaleco se não servir?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Sim, você tem 7 dias a partir do recebimento para devolução por arrependimento (CDC). Para defeito de fabricação, o prazo é de 30 dias, produto sem uso e com etiqueta.',
          },
        },
        {
          '@type': 'Question',
          name: 'Qual o prazo de entrega do jaleco?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'O prazo varia conforme o CEP e a modalidade de frete escolhida. Simule no carrinho antes de fechar o pedido. Temos estoque próprio, com envio no mesmo dia para pedidos até às 14h.',
          },
        },
        {
          '@type': 'Question',
          name: 'O jaleco desbota ou encolhe na lavagem?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Não. Os jalecos Jaleca são feitos com tecido premium antimicrobiano, que mantém a cor e o caimento mesmo após muitas lavagens.',
          },
        },
      ],
    },
  ],
}

export default function ComprarJalecoOnlinePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Comprar Jaleco Online', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* ── HERO ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(5rem,10vw,9rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
          <span aria-hidden="true" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(6rem,18vw,18rem)', fontWeight: 300, color: 'rgba(26,26,26,0.04)', whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none' }}>
            JALECA
          </span>
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 800, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
              Frete grátis · Devolução em 7 dias · Tecido premium
            </div>
            <h1 style={{
              fontFamily: "'Cormorant', Georgia, serif",
              fontSize: 'clamp(2.8rem,5.5vw,5.2rem)',
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: '-0.01em',
              color: '#1a1a1a',
              marginBottom: '1.5rem',
            }}>
              Comprar Jaleco Online<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>na Jaleca</em>
            </h1>
            <p style={{ fontSize: '1.05rem', fontWeight: 300, color: '#6b6b6b', maxWidth: 560, margin: '0 auto 2.5rem', lineHeight: 1.8 }}>
              Jalecos femininos e masculinos com tecido premium antimicrobiano, do PP ao G3 e 12 cores exclusivas. Entrega rápida para todo o Brasil — frete grátis no Sudeste acima de R$499.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=jalecos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Ver Coleção Completa ↘
              </Link>
              <Link href="/medidas" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}>
                Guia de Tamanhos
              </Link>
            </div>
          </div>
        </section>

        {/* ── DIFERENCIAIS ── */}
        <section style={{ background: '#fff', borderTop: '1px solid #e5e0d8', borderBottom: '1px solid #e5e0d8', padding: 'clamp(3rem,6vw,5rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.6rem,2.8vw,2.4rem)', fontWeight: 400, color: '#1a1a1a' }}>
                Por que comprar jaleco online na Jaleca?
              </h2>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(1.5rem,3vw,3rem)' }}>
              {[
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 28, height: 28 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>,
                  title: 'Frete Grátis no Sudeste',
                  sub: 'SP · RJ · MG · ES acima de R$499',
                },
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 28, height: 28 }}><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" /><path d="m9 12 2 2 4-4" /></svg>,
                  title: 'Troca em 7 dias',
                  sub: 'Direito do consumidor',
                },
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 28, height: 28 }}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" /></svg>,
                  title: 'Do PP ao G3',
                  sub: 'Grade completa para todos os corpos',
                },
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 28, height: 28 }}><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></svg>,
                  title: '12 Cores Exclusivas',
                  sub: 'Branco, preto, azul, verde, bordô…',
                },
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 28, height: 28 }}><path d="M4 6h16M4 12h16M4 18h16" /></svg>,
                  title: 'Tecido Premium',
                  sub: 'Antimicrobiano · Não amassa · Easy care',
                },
                {
                  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 28, height: 28 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
                  title: 'Compra 100% segura',
                  sub: 'Pagamento criptografado, dados protegidos',
                },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem', padding: 'clamp(1.5rem,2vw,2rem)' }}>
                  <div style={{ color: '#c8c4bc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.icon}
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.9rem', color: '#1a1a1a', display: 'block', marginBottom: '0.25rem' }}>{item.title}</strong>
                    <span style={{ fontSize: '0.78rem', color: '#6b6b6b', fontWeight: 300 }}>{item.sub}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CATEGORIAS POR PROFISSÃO ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
                Encontre o jaleco certo para você
              </div>
              <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 400, color: '#1a1a1a', lineHeight: 1.15 }}>
                Jalecos por especialidade
              </h2>
              <p style={{ fontSize: '0.92rem', color: '#6b6b6b', fontWeight: 300, maxWidth: 520, margin: '1rem auto 0', lineHeight: 1.7 }}>
                Do modelo slim para médicas ao scrub para enfermeiras — cada jaleco foi pensado para a rotina real de quem o usa.
              </p>
            </div>
            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'clamp(1.5rem,3vw,2.5rem)' }}>
              {[
                { href: '/produtos?categoria=jalecos-femininos', label: 'Jaleco para Médica', desc: 'Slim, Princess cut, bolsos funcionais. Caimento impecável para atendimentos longos.', cor: '#c8a96e', h3: true },
                { href: '/produtos?categoria=conjuntos', label: 'Jaleco para Enfermeira', desc: 'Conjuntos scrub e jalecos leves. Tecido resistente às lavagens frequentes.', cor: '#9e7a8e', h3: true },
                { href: '/produtos?categoria=jalecos-femininos', label: 'Jaleco para Dentista', desc: 'Modelagem prática com liberdade de movimento. Ideal para procedimentos.', cor: '#7a9e9a', h3: true },
                { href: '/produtos?categoria=jalecos-femininos', label: 'Jaleco para Nutricionista', desc: 'Elegante e profissional. Transmite confiança em cada consulta.', cor: '#9e9e7a', h3: true },
                { href: '/produtos?categoria=jalecos-masculinos', label: 'Jaleco Masculino', desc: 'Corte clássico ou slim. Do PP ao G3, tecido premium que não amassa.', cor: '#7a9e7e', h3: true },
                { href: '/produtos?categoria=dolmas', label: 'Dólmã Profissional', desc: 'Para cozinheiros, sushiman e churrasqueiros. Resistente e prático.', cor: '#8e9ea7', h3: true },
              ].map(cat => (
                <Link key={cat.href + cat.label} href={cat.href} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: 'clamp(1.5rem,3vw,2rem)', textDecoration: 'none', display: 'block' }}>
                  <div style={{ width: 4, height: 40, background: cat.cor, marginBottom: '1rem', borderRadius: 2 }} />
                  <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.25rem', fontWeight: 400, color: '#1a1a1a', marginBottom: '0.5rem' }}>
                    {cat.label}
                  </h3>
                  <p style={{ fontSize: '0.82rem', color: '#6b6b6b', fontWeight: 300, lineHeight: 1.6 }}>{cat.desc}</p>
                  <span style={{ display: 'inline-block', marginTop: '1rem', fontSize: '0.72rem', color: '#1a1a1a', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                    Ver modelos →
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST BAR ── */}
        <div style={{ background: '#1a1a1a', padding: '2rem clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', alignItems: 'center' }}>
            {[
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18 }}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>, label: 'Compra 100% segura' },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18 }}><path d="M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0" /><path d="m9 12 2 2 4-4" /></svg>, label: 'Troca em 7 dias' },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>, label: 'Frete grátis acima de R$499' },
              { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 18, height: 18 }}><rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18M9 3v18" /></svg>, label: 'Estoque próprio' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3" style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem' }}>
                {item.icon}
                <span>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── CONTEÚDO SEO — O QUE É JALECO ── */}
        <section style={{ background: '#fff', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem', lineHeight: 1.2 }}>
              O que faz um bom jaleco profissional?
            </h2>
            <div style={{ fontSize: '0.95rem', color: '#4a4a4a', lineHeight: 1.85, fontWeight: 300 }}>
              <p style={{ marginBottom: '1.2rem' }}>
                Antes de comprar jaleco online, vale saber o que diferencia um jaleco de qualidade de um que decepciona na segunda semana de uso. O tecido é o primeiro ponto: um bom jaleco precisa ser antimicrobiano, resistente a lavagens frequentes e manter o caimento mesmo depois de muitas passagens pela máquina.
              </p>
              <p style={{ marginBottom: '1.2rem' }}>
                O segundo ponto é o modelagem. Um jaleco que aperta nos ombros ou fica largo demais na cintura cria desconforto ao longo de um dia inteiro de trabalho. Na Jaleca, cada modelo passa por ajuste fino de modelagem antes de ir para a produção — por isso o caimento é um diferencial que nossos clientes sempre mencionam.
              </p>
              <p>
                Por fim: os bolsos. Médicas, enfermeiras e dentistas precisam de bolsos práticos, na altura certa, que não estufam e não deformam. Todos os jalecos da nossa coleção foram desenhados com isso em mente.
              </p>
            </div>
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid #e5e0d8', display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <Link href="/produtos?categoria=jalecos-femininos" style={{ fontSize: '0.78rem', color: '#1a1a1a', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid #1a1a1a', paddingBottom: '2px' }}>
                Jalecos Femininos →
              </Link>
              <Link href="/produtos?categoria=jalecos-masculinos" style={{ fontSize: '0.78rem', color: '#1a1a1a', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid #1a1a1a', paddingBottom: '2px' }}>
                Jalecos Masculinos →
              </Link>
              <Link href="/medidas" style={{ fontSize: '0.78rem', color: '#1a1a1a', letterSpacing: '0.1em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid #1a1a1a', paddingBottom: '2px' }}>
                Guia de Tamanhos →
              </Link>
            </div>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
                Dúvidas frequentes
              </div>
              <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a' }}>
                Perguntas sobre comprar jaleco online
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {[
                {
                  q: 'Quais tamanhos de jaleco estão disponíveis?',
                  a: 'A Jaleca oferece jalecos do PP ao G3, com tabela de medidas detalhada no site. Se tiver dúvida entre dois tamanhos, nossa equipe pode te ajudar pelo WhatsApp antes de fechar o pedido.',
                },
                {
                  q: 'O frete é grátis para todo o Brasil?',
                  a: 'Frete grátis via PAC para SP, RJ, MG e ES em compras acima de R$499. Para outros estados, simule o valor no carrinho antes de finalizar. SEDEX e Jadlog estão disponíveis em todo o Brasil.',
                },
                {
                  q: 'Posso trocar meu jaleco se não servir?',
                  a: 'Arrependimento: até 7 dias após o recebimento, produto sem uso e com etiqueta. Garantia Jaleca: 30 dias, sem marca de uso e com etiqueta. Basta nos contatar pelo WhatsApp ou email.',
                },
                {
                  q: 'Qual o prazo de entrega?',
                  a: 'Temos estoque próprio com envio no mesmo dia para pedidos feitos até às 14h. O prazo varia conforme o CEP e o frete escolhido — PAC entre 3 e 10 dias úteis, SEDEX entre 1 e 3 dias úteis.',
                },
                {
                  q: 'O jaleco desbota ou encolhe depois de lavar?',
                  a: 'Não. O tecido usado na Jaleca é premium, antimicrobiano e testado para manter cor, forma e caimento mesmo após muitas lavagens. Siga as instruções na etiqueta para prolongar ainda mais a vida do jaleco.',
                },
              ].map((faq, i) => (
                <details key={i} style={{ borderTop: '1px solid #e5e0d8', padding: '1.5rem 0' }}>
                  <summary style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: '1.15rem', fontWeight: 400, color: '#1a1a1a', cursor: 'pointer', listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    {faq.q}
                    <span style={{ fontSize: '1.2rem', color: '#c8c4bc', flexShrink: 0 }}>+</span>
                  </summary>
                  <p style={{ marginTop: '1rem', fontSize: '0.92rem', color: '#4a4a4a', fontWeight: 300, lineHeight: 1.8 }}>
                    {faq.a}
                  </p>
                </details>
              ))}
              <div style={{ borderTop: '1px solid #e5e0d8' }} />
            </div>
          </div>
        </section>

        {/* ── CTA FINAL ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.15, marginBottom: '1rem' }}>
              Pronta para comprar<br /><em style={{ fontStyle: 'italic', fontWeight: 300 }}>seu jaleco online?</em>
            </h2>
            <p style={{ fontSize: '0.97rem', color: 'rgba(255,255,255,0.55)', fontWeight: 300, marginBottom: '2.5rem' }}>
              Mais de 30 modelos disponíveis. Frete grátis no Sudeste acima de R$499. Devolução em 7 dias por arrependimento.
            </p>
            <div className="flex gap-4 flex-wrap justify-center">
              <Link href="/produtos?categoria=jalecos" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: '#fff', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none' }}>
                Ver Todos os Jalecos ↘
              </Link>
              <Link href="/faq" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.9rem 2.5rem', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.14em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.2)' }}>
                Central de Ajuda
              </Link>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}

// components/ProductDetailSection.tsx
// Server Component — não precisa de "use client"
// Usa inline styles para manter consistência com o design system do site

interface ProductDetailSectionProps {
  productType?: 'jaleco' | 'conjunto' | 'dolma'
}

const ProductDetailSection: React.FC<ProductDetailSectionProps> = ({ productType = 'jaleco' }) => {
  const isDolma = productType === 'dolma'
  const isConjunto = productType === 'conjunto'

  return (
    <section style={{ background: '#f9f7f4', padding: 'clamp(4rem,8vw,7rem) clamp(1.5rem,5vw,4rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Título */}
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
          Características
        </div>
        <h2 style={{
          fontFamily: "'Cormorant', Georgia, serif",
          fontSize: 'clamp(2rem,3.5vw,3rem)',
          fontWeight: 400,
          color: '#1a1a1a',
          marginBottom: '3rem',
          lineHeight: 1.15,
        }}>
          Detalhamento do Produto
        </h2>

        {/* Grid de tecido + caimento */}
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'clamp(2rem,4vw,4rem)', marginBottom: '3rem' }}>
          {/* Tecido Premium */}
          <div style={{ background: '#fff', padding: 'clamp(1.5rem,3vw,2.5rem)', border: '1px solid #e5e0d8' }}>
            <h3 style={{
              fontFamily: "'Cormorant', Georgia, serif",
              fontSize: '1.6rem',
              fontWeight: 400,
              color: '#1a1a1a',
              marginBottom: '1rem',
            }}>
              Tecido Premium
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
              {isDolma
                ? 'Dólmã com tecido de alta resistência, desenvolvido para suportar altas temperaturas de cozinha e lavagens frequentes.'
                : 'Confeccionados com polyester 65% + viscose 30% + elastano 5% — o equilíbrio ideal entre conforto, durabilidade e fácil cuidado.'}
            </p>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { label: 'Antimicrobiano', desc: 'Reduz colonização bacteriana entre lavagens' },
                { label: 'Não amassa', desc: 'Sempre impecável durante o expediente' },
                { label: 'Lavagem 60°C', desc: 'Higienização profunda sem danificar o tecido' },
                { label: 'Easy care', desc: 'Manutenção simples no dia a dia' },
              ].map(item => (
                <li key={item.label} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.85rem', alignItems: 'flex-start' }}>
                  <span style={{ color: '#c8a96e', fontSize: '1rem', lineHeight: 1.5, flexShrink: 0 }}>●</span>
                  <div>
                    <strong style={{ fontSize: '0.88rem', color: '#1a1a1a', display: 'block', marginBottom: '0.1rem' }}>{item.label}</strong>
                    <span style={{ fontSize: '0.82rem', color: '#6b6b6b', fontWeight: 300 }}>{item.desc}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Caimento Perfeito */}
          <div style={{ background: '#fff', padding: 'clamp(1.5rem,3vw,2.5rem)', border: '1px solid #e5e0d8' }}>
            <h3 style={{
              fontFamily: "'Cormorant', Georgia, serif",
              fontSize: '1.6rem',
              fontWeight: 400,
              color: '#1a1a1a',
              marginBottom: '1rem',
            }}>
              Caimento Perfeito
            </h3>
            <p style={{ fontSize: '0.95rem', color: '#444', lineHeight: 1.85, marginBottom: '1.2rem', fontWeight: 300 }}>
              {isDolma
                ? 'Modelagem que valoriza o corpo sem limitar movimentos. Ideal para ambientes de cozinha profissional.'
                : 'Cortes pensados para profissionais que passam horas em movimento. Sem apertar, sem limiting.'}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {isDolma ? (
                <>
                  <div style={{ borderBottom: '1px solid #e5e0d8', paddingBottom: '1rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#1a1a1a', display: 'block', marginBottom: '0.3rem' }}>Dólmã Feminina</strong>
                    <span style={{ fontSize: '0.85rem', color: '#6b6b6b', fontWeight: 300 }}>Caimento slim com abertura frontal por zíper + avental integrado. Elegante e funcional.</span>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#1a1a1a', display: 'block', marginBottom: '0.3rem' }}>Dólmã Masculina</strong>
                    <span style={{ fontSize: '0.85rem', color: '#6b6b6b', fontWeight: 300 }}>Corte mais amplo com ótimo caimento. Ideal para churrasqueiros e cozinheiros profissionais.</span>
                  </div>
                </>
              ) : isConjunto ? (
                <>
                  <div style={{ borderBottom: '1px solid #e5e0d8', paddingBottom: '1rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#1a1a1a', display: 'block', marginBottom: '0.3rem' }}>Modelo Feminino</strong>
                    <span style={{ fontSize: '0.85rem', color: '#6b6b6b', fontWeight: 300 }}>Calça com cós elastizado + blouse com caimento полу-fit. Conforto o dia todo.</span>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#1a1a1a', display: 'block', marginBottom: '0.3rem' }}>Modelo Masculino</strong>
                    <span style={{ fontSize: '0.85rem', color: '#6b6b6b', fontWeight: 300 }}>Calça semi-reta + blouse com caimento confortável. Movimentação livre.</span>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ borderBottom: '1px solid #e5e0d8', paddingBottom: '1rem' }}>
                    <strong style={{ fontSize: '0.95rem', color: '#1a1a1a', display: 'block', marginBottom: '0.3rem' }}>Modelo Slim</strong>
                    <span style={{ fontSize: '0.85rem', color: '#6b6b6b', fontWeight: 300 }}>Corte ajustado ao corpo — valoriza a silhueta com visual moderno e elegante.</span>
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.95rem', color: '#1a1a1a', display: 'block', marginBottom: '0.3rem' }}>Modelo Profissional</strong>
                    <span style={{ fontSize: '0.85rem', color: '#6b6b6b', fontWeight: 300 }}>Corte mais amplo e estruturado — máxima liberdade de movimento.</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Diferenciais */}
        <div style={{ background: '#fff', padding: 'clamp(1.5rem,3vw,2.5rem)', border: '1px solid #e5e0d8' }}>
          <h3 style={{
            fontFamily: "'Cormorant', Georgia, serif",
            fontSize: '1.6rem',
            fontWeight: 400,
            color: '#1a1a1a',
            marginBottom: '2rem',
            textAlign: 'center',
          }}>
            Por que escolher a Jaleca
          </h3>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'clamp(1.5rem,3vw,3rem)' }}>
            {[
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 28, height: 28 }}><path d="M4 6h16M4 12h16M4 18h16" /></svg>,
                title: 'Tamanho PP ao G3',
                sub: 'Grade completa para todos os tipos de corpo',
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 28, height: 28 }}><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18" /></svg>,
                title: '12 Cores Exclusivas',
                sub: 'Variedade para combinar com sua identidade',
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 28, height: 28 }}><path d="M4 6a2 2 0 012-2h2v2a2 2 0 01-2 2H4V6zm12 0a2 2 0 012-2h2v2a2 2 0 01-2 2h-2V6zM4 16a2 2 0 012-2h2v2a2 2 0 01-2 2H4v-2zm12 0a2 2 0 012-2h2v2a2 2 0 01-2 2h-2v-2z" /></svg>,
                title: 'Estoque Próprio',
                sub: 'Fabricação própria, disponibilidade imediata',
              },
              {
                icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 28, height: 28 }}><path d="M5 12h14M12 5l7 7-7 7" /></svg>,
                title: 'Entrega Rápida',
                sub: 'Frete grátis SP · RJ · MG · ES acima de R$499',
              },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: '0.75rem' }}>
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
      </div>
    </section>
  )
}

export default ProductDetailSection

import { Suspense } from 'react'
import { InstagramGallery } from '@/components/InstagramGallery'

export default function InstagramLazy() {
  return (
    <section style={{ background: '#fff', padding: 'clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,4rem)', borderTop: '1px solid #f0ece5' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ width: 30, height: 30, background: 'linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.85rem', flexShrink: 0 }}>
            IG
          </div>
          <div>
            <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1a1a1a' }}>@jaleca.uniformes</strong>
            <span style={{ fontSize: '0.72rem', color: '#888' }}>Clientes reais · Marque #jaleca</span>
          </div>
        </div>
        <Suspense fallback={<div style={{ height: 200, background: '#f5f5f5', borderRadius: 4 }} />}>
          <InstagramGallery />
        </Suspense>
      </div>
    </section>
  )
}

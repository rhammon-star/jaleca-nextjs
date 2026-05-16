# Profession LP Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the 5 profession landing pages (jaleco-feminino, jaleco-medica, jaleco-dentista-feminino, jaleco-feminino-branco, jaleco-feminino-acinturado) with a mobile-first, commercial layout that converts faster while preserving all SEO/AEO schemas.

**Architecture:** Build 6 new reusable section components in `components/profession-lp/`, then rewrite each page to use the new flow: Hero (price+PIX, zero images above fold) → Products (8) → Google 4.9★ + Testimonials → Instagram (lazy) → Models → FAQ accordion + Fabric Cards → Profession Links (neutral grid) → CTA dark. All existing schema (FAQPage, Article, BreadcrumbList, AggregateRating) stays intact — only the visual layout changes.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind (minimal, mostly inline styles matching existing pattern), `next/image` with `priority`/`loading` props, `<details>` native accordion, ISR revalidate 3600.

---

## File Map

**New components (create):**
- `components/profession-lp/HeroCommercial.tsx` — hero with price, PIX badge, CTA buttons, trust inline, Google stars
- `components/profession-lp/CompactTrustBar.tsx` — single-row horizontal strip (dark bg, 4 pillars)
- `components/profession-lp/GoogleRatingCarousel.tsx` — Google 4.9★ block + horizontal swipe testimonials (client component)
- `components/profession-lp/InstagramLazy.tsx` — 2×2 grid of tagged photos, lazy loaded (wraps existing `InstagramGallery`)
- `components/profession-lp/FabricGuideCards.tsx` — 2×2 fabric cards (Gabardine/Microfibra/DWR/Alfaiataria)
- `components/profession-lp/ProfessionLinksNeutral.tsx` — 2-col neutral link grid, just profession name

**Modified pages (rewrite layout only, preserve all metadata + schemas):**
- `app/jaleco-feminino/page.tsx`
- `app/jaleco-medica/page.tsx`
- `app/jaleco-dentista-feminino/page.tsx`
- `app/jaleco-feminino-branco/page.tsx`
- `app/jaleco-feminino-acinturado/page.tsx`

**Existing components reused as-is:**
- `components/ProfessionProductGrid.tsx` — already has `priority={i < 2}`, shows up to 30 products
- `components/UGCSection.tsx` — kept for reference but NOT in new layout (replaced by GoogleRatingCarousel + InstagramLazy)
- `components/InstagramGallery.tsx` — reused inside `InstagramLazy`

---

## Task 1: HeroCommercial component

**Files:**
- Create: `components/profession-lp/HeroCommercial.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/profession-lp/HeroCommercial.tsx
import Link from 'next/link'

type Props = {
  eyebrow: string          // "Jaleca · Uniformes femininos profissionais"
  h1Line1: string          // "Jaleco Feminino"
  h1Line2: string          // "Slim, Princesa e Elastex"
  description: string      // "Com corte pensado para o corpo feminino real..."
  startingPrice: string    // "R$189"
  comparePrice?: string    // "R$219" (opcional, riscado)
  collectionHref: string   // "#colecao"
  allHref: string          // "/produtos?categoria=jalecos-femininos"
  googleRating?: number    // 4.9
}

export default function HeroCommercial({
  eyebrow, h1Line1, h1Line2, description, startingPrice, comparePrice,
  collectionHref, allHref, googleRating,
}: Props) {
  return (
    <section style={{ background: '#f9f7f4', padding: 'clamp(2.5rem,6vw,5rem) clamp(1.5rem,5vw,4rem) clamp(2rem,5vw,4rem)' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6b6b6b', marginBottom: '0.75rem' }}>
          {eyebrow}
        </div>
        <h1 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(2.2rem,5vw,4.2rem)', fontWeight: 400, lineHeight: 1.05, color: '#1a1a1a', marginBottom: '0.75rem' }}>
          {h1Line1}<br />
          <em style={{ fontStyle: 'italic', fontWeight: 300 }}>{h1Line2}</em>
        </h1>
        <p style={{ fontSize: '0.95rem', color: '#4a4a4a', maxWidth: 560, lineHeight: 1.75, marginBottom: '1rem' }}>
          {description}
        </p>

        {/* Price line */}
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.82rem', color: '#6b6b6b' }}>A partir de</span>
          <strong style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a' }}>{startingPrice}</strong>
          {comparePrice && <s style={{ fontSize: '0.85rem', color: '#bbb' }}>{comparePrice}</s>}
        </div>
        <div style={{ fontSize: '0.82rem', color: '#1a7a1a', fontWeight: 600, marginBottom: '1.5rem' }}>
          ✓ PIX com 5% off &nbsp;·&nbsp; 3x sem juros
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          <a
            href={collectionHref}
            style={{ display: 'inline-flex', alignItems: 'center', padding: '0.9rem 1.75rem', background: '#1a1a1a', color: '#fff', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none' }}
          >
            Ver modelos e comprar ↓
          </a>
          <Link
            href={allHref}
            style={{ display: 'inline-flex', alignItems: 'center', padding: '0.9rem 1.75rem', background: 'transparent', color: '#1a1a1a', fontSize: '0.78rem', fontWeight: 400, letterSpacing: '0.12em', textTransform: 'uppercase', textDecoration: 'none', border: '1px solid #1a1a1a' }}
          >
            Ver toda a coleção →
          </Link>
        </div>

        {/* Trust inline */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.78rem', color: '#6b6b6b' }}>
          {googleRating && <span>★ {googleRating.toFixed(1)} Google</span>}
          <span>✓ PP ao G3</span>
          <span>✓ Frete grátis SE</span>
          <span>✓ Troca 7 dias</span>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/profession-lp/HeroCommercial.tsx
git commit -m "feat(lp): HeroCommercial — price, PIX badge, trust inline, zero images above fold"
```

---

## Task 2: CompactTrustBar component

**Files:**
- Create: `components/profession-lp/CompactTrustBar.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/profession-lp/CompactTrustBar.tsx
type Pillar = { label: string }

type Props = {
  pillars?: Pillar[]
}

const DEFAULT_PILLARS: Pillar[] = [
  { label: 'Molde feminino real' },
  { label: 'PP ao G3' },
  { label: 'Frete grátis SE' },
  { label: 'Troca em 7 dias' },
]

export default function CompactTrustBar({ pillars = DEFAULT_PILLARS }: Props) {
  return (
    <div
      style={{
        background: '#1a1a1a',
        padding: '0.45rem clamp(1.5rem,5vw,4rem)',
        display: 'flex',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
      }}
    >
      {pillars.map((p, i) => (
        <div
          key={i}
          style={{
            padding: '0.3rem 0.9rem',
            borderRight: i < pillars.length - 1 ? '1px solid rgba(255,255,255,0.15)' : 'none',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          <strong style={{ fontSize: '0.78rem', color: '#fff', fontWeight: 500 }}>{p.label}</strong>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/profession-lp/CompactTrustBar.tsx
git commit -m "feat(lp): CompactTrustBar — single-row dark strip, scrollable mobile"
```

---

## Task 3: GoogleRatingCarousel component

**Files:**
- Create: `components/profession-lp/GoogleRatingCarousel.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/profession-lp/GoogleRatingCarousel.tsx
'use client'

const DEPOIMENTOS = [
  { initial: 'F', name: 'Dra. Fernanda M.', role: 'Médica · São Paulo', text: '"Caimento perfeito. Tecido não amassa em 12h de plantão."' },
  { initial: 'J', name: 'Juliana R.', role: 'Dentista · BH', text: '"Chegou em 2 dias. O Slim ficou exatamente como esperava."' },
  { initial: 'A', name: 'Ana C.', role: 'Enfermeira · RJ', text: '"Plus size G2 que cabe nos ombros. Finalmente molde correto."' },
  { initial: 'M', name: 'Maria P.', role: 'Nutricionista · SP', text: '"Elastex não amassa e troca rápido no consultório."' },
  { initial: 'C', name: 'Carolina S.', role: 'Psicóloga · Curitiba', text: '"Qualidade surpreendente para o preço. Já pedi o segundo."' },
]

type Props = {
  rating?: number // default 4.9
}

export default function GoogleRatingCarousel({ rating = 4.9 }: Props) {
  return (
    <section style={{ background: '#fff', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)', borderTop: '3px solid #c8a96e' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>

        {/* Google rating bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', paddingBottom: '1.5rem', borderBottom: '1px solid #f0ece5', marginBottom: '1.5rem' }}>
          <div style={{ width: 40, height: 40, background: '#fff', border: '1px solid #e0e0e0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 18, color: '#4285f4', flexShrink: 0 }}>G</div>
          <div>
            <strong style={{ display: 'block', fontSize: '2rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>{rating.toFixed(1)}</strong>
            <div style={{ color: '#fbbc04', fontSize: '0.9rem', margin: '2px 0' }}>★★★★★</div>
            <span style={{ fontSize: '0.72rem', color: '#888' }}>Avaliações verificadas no Google</span>
          </div>
        </div>

        {/* Carousel */}
        <div
          style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.5rem', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}
        >
          {DEPOIMENTOS.map((d, i) => (
            <div
              key={i}
              style={{ minWidth: 240, maxWidth: 260, background: '#f9f7f4', borderRadius: 6, padding: '1rem', scrollSnapAlign: 'start', flexShrink: 0 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#e0dbd3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, color: '#888', flexShrink: 0 }}>
                  {d.initial}
                </div>
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#1a1a1a' }}>{d.name}</div>
                  <div style={{ fontSize: '0.7rem', color: '#888' }}>{d.role}</div>
                </div>
              </div>
              <div style={{ color: '#fbbc04', fontSize: '0.78rem', marginBottom: '0.35rem' }}>★★★★★</div>
              <p style={{ fontSize: '0.78rem', color: '#444', lineHeight: 1.5, margin: 0 }}>{d.text}</p>
              <div style={{ fontSize: '0.65rem', color: '#1a7a1a', fontWeight: 600, marginTop: '0.35rem' }}>✓ Compra verificada</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/profession-lp/GoogleRatingCarousel.tsx
git commit -m "feat(lp): GoogleRatingCarousel — Google 4.9 + horizontal testimonial swipe"
```

---

## Task 4: InstagramLazy component

**Files:**
- Create: `components/profession-lp/InstagramLazy.tsx`

- [ ] **Step 1: Create the component** (wraps existing `InstagramGallery` with lazy section heading)

```tsx
// components/profession-lp/InstagramLazy.tsx
import { Suspense } from 'react'
import InstagramGallery from '@/components/InstagramGallery'

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
```

- [ ] **Step 2: Commit**

```bash
git add components/profession-lp/InstagramLazy.tsx
git commit -m "feat(lp): InstagramLazy — Suspense-wrapped Instagram section, lazy boundary"
```

---

## Task 5: FabricGuideCards component

**Files:**
- Create: `components/profession-lp/FabricGuideCards.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/profession-lp/FabricGuideCards.tsx
const FABRICS = [
  { name: 'Gabardine + elastano', desc: 'Leve, não amassa, lavagem 40°C', best: 'Uso diário · clínica' },
  { name: 'Microfibra premium', desc: 'Maciez extrema, não transparece', best: 'Consultório · estética' },
  { name: 'DWR repelente', desc: 'Repele líquidos e manchas', best: 'Procedimentos estéticos' },
  { name: 'Alfaiataria Premium', desc: 'Visual sofisticado, caimento impecável', best: 'Atendimento presencial' },
]

export default function FabricGuideCards() {
  return (
    <div>
      <div style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.75rem' }}>
        Guia rápido
      </div>
      <h3 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.5rem,2.5vw,2rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
        Tecido certo para cada situação
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(220px,100%), 1fr))', gap: '0.75rem' }}>
        {FABRICS.map((f, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '1rem' }}>
            <strong style={{ display: 'block', fontSize: '0.85rem', color: '#1a1a1a', fontWeight: 600, marginBottom: '0.25rem' }}>{f.name}</strong>
            <p style={{ fontSize: '0.78rem', color: '#666', lineHeight: 1.4, marginBottom: '0.4rem' }}>{f.desc}</p>
            <span style={{ fontSize: '0.72rem', color: '#c8a96e', fontWeight: 600 }}>✓ {f.best}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/profession-lp/FabricGuideCards.tsx
git commit -m "feat(lp): FabricGuideCards — 2x2 fabric guide grid"
```

---

## Task 6: ProfessionLinksNeutral component

**Files:**
- Create: `components/profession-lp/ProfessionLinksNeutral.tsx`

- [ ] **Step 1: Create the component**

```tsx
// components/profession-lp/ProfessionLinksNeutral.tsx
import Link from 'next/link'

type ProfLink = { href: string; label: string }

type Props = {
  links: ProfLink[]
  title?: string
}

export default function ProfessionLinksNeutral({ links, title = 'Jaleco para sua profissão' }: Props) {
  return (
    <section style={{ background: '#f9f7f4', padding: 'clamp(2rem,4vw,3.5rem) clamp(1.5rem,5vw,4rem)' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>
          Outras páginas
        </div>
        <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.5rem,2.5vw,2.2rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
          {title}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(180px,100%), 1fr))', gap: '0.4rem' }}>
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{ display: 'block', background: '#fff', border: '1px solid #e5e0d8', padding: '0.7rem 1rem', fontSize: '0.82rem', color: '#444', textDecoration: 'none', fontWeight: 400 }}
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/profession-lp/ProfessionLinksNeutral.tsx
git commit -m "feat(lp): ProfessionLinksNeutral — minimal name-only profession link grid"
```

---

## Task 7: Rewrite app/jaleco-feminino/page.tsx

**Files:**
- Modify: `app/jaleco-feminino/page.tsx`

This is the template page. All schemas (FAQPage, Article, BreadcrumbList, AggregateRating) stay intact. Only the JSX layout changes. The `MODELOS`, `FAQ_ITEMS`, and `INTERNAL_LINKS` data arrays stay in the file.

- [ ] **Step 1: Replace the `return` block — keep all metadata, schemas, and data arrays unchanged**

Replace everything from `return (` to the closing `</>` with:

```tsx
  return (
    <>
      {/* ── SCHEMAS — unchanged ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaFaq).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaArticle).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, '\\u003c') }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaAggregateRating).replace(/</g, '\\u003c') }} />

      <main style={{ fontWeight: 300 }}>

        {/* ── BREADCRUMB ── */}
        <div style={{ background: '#f9f7f4', borderBottom: '1px solid #e5e0d8', padding: '0.85rem clamp(1.5rem,5vw,4rem)' }}>
          <ol className="flex items-center gap-2 max-w-[1200px] mx-auto" style={{ listStyle: 'none' }}>
            {[
              { label: 'Início', href: '/' },
              { label: 'Jalecos', href: '/produtos?categoria=jalecos' },
              { label: 'Jaleco Feminino', href: null },
            ].map((crumb, i, arr) => (
              <li key={crumb.label} className="flex items-center gap-2 text-xs" style={{ color: crumb.href ? '#6b6b6b' : '#1a1a1a' }}>
                {crumb.href ? <Link href={crumb.href} style={{ color: '#6b6b6b', textDecoration: 'none' }}>{crumb.label}</Link> : crumb.label}
                {i < arr.length - 1 && <span style={{ color: '#c8c4bc' }}>/</span>}
              </li>
            ))}
          </ol>
        </div>

        {/* ── ① HERO COMMERCIAL ── */}
        <HeroCommercial
          eyebrow="Jaleca · Uniformes femininos profissionais"
          h1Line1="Jaleco Feminino"
          h1Line2="Slim, Princesa e Elastex"
          description="Com corte pensado para o corpo feminino real. Elastano que acompanha o movimento. Grade do PP ao G3 com molde próprio por tamanho."
          startingPrice="R$189"
          comparePrice="R$219"
          collectionHref="#colecao"
          allHref="/categoria/jalecos-femininos"
          googleRating={placeData?.rating}
        />

        {/* ── ② COMPACT TRUST BAR ── */}
        <CompactTrustBar />

        {/* ── ③ PRODUTOS — 8 itens ── */}
        <div id="colecao">
          <ProfessionProductGrid
            professionKey="medica"
            professionLabel="Profissionais"
            collectionLabel="Coleção Feminina"
            productLabel="Jalecos"
            allHref="/categoria/jalecos-femininos"
          />
        </div>

        {/* ── ④ GOOGLE 4.9★ + DEPOIMENTOS ── */}
        <GoogleRatingCarousel rating={placeData?.rating ?? 4.9} />

        {/* ── ⑤ INSTAGRAM ── */}
        <InstagramLazy />

        {/* ── ⑥ MODELOS ── */}
        <section style={{ background: '#f9f7f4', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Qual modelo é o seu?</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.5rem' }}>Conheça cada modelo</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px,100%), 1fr))', gap: '0.75rem' }}>
              {MODELOS.map((m, i) => (
                <div key={i} style={{ background: '#fff', border: '1px solid #e5e0d8', padding: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ display: 'block', fontSize: '0.9rem', color: '#1a1a1a', fontWeight: 600, marginBottom: '0.2rem' }}>{m.nome}</strong>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: '#c8a96e', marginBottom: '0.35rem' }}>{m.perfil}</span>
                    <p style={{ fontSize: '0.78rem', color: '#555', lineHeight: 1.5, margin: 0 }}>{m.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ⑦ FAQ ACCORDION + GUIA DE TECIDOS ── */}
        <section style={{ background: '#fff', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)' }}>
          <div style={{ maxWidth: 900, margin: '0 auto' }}>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#c8c4bc', marginBottom: '0.5rem' }}>Perguntas frequentes</div>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3vw,2.6rem)', fontWeight: 400, color: '#1a1a1a', marginBottom: '1.25rem' }}>
              Tudo sobre jaleco feminino
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1px', background: '#e5e0d8', marginBottom: '2.5rem' }}>
              {FAQ_ITEMS.map((item, i) => (
                <details key={i} style={{ background: '#fff', padding: '1.25rem 1.5rem' }}>
                  <summary style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, color: '#1a1a1a', lineHeight: 1.5, listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    {item.q}
                    <span style={{ flexShrink: 0, fontSize: '1.1rem', color: '#c8a96e', fontWeight: 300 }}>+</span>
                  </summary>
                  <p style={{ fontSize: '0.85rem', color: '#4a4a4a', lineHeight: 1.8, marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #f0ece5', marginBottom: 0 }}>
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
            <FabricGuideCards />
          </div>
        </section>

        {/* ── ⑧ LINKS DE PROFISSÃO ── */}
        <ProfessionLinksNeutral
          title="Jaleco para sua profissão"
          links={INTERNAL_LINKS.map(l => ({ href: l.href, label: l.label }))}
        />

        {/* ── ⑨ CTA FINAL ── */}
        <section style={{ background: '#1a1a1a', padding: 'clamp(2.5rem,5vw,4rem) clamp(1.5rem,5vw,4rem)', textAlign: 'center' }}>
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontFamily: "'Cormorant', Georgia, serif", fontSize: 'clamp(1.8rem,3.5vw,2.8rem)', fontWeight: 400, color: '#fff', marginBottom: '0.75rem', lineHeight: 1.2 }}>
              Encontre seu jaleco ideal
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.55)', marginBottom: '1.75rem', lineHeight: 1.7 }}>
              PP ao G3 · 12 cores · Frete grátis SP, RJ, MG, ES acima de R$499 · Troca em 7 dias
            </p>
            <Link
              href="/categoria/jalecos-femininos"
              style={{ display: 'inline-block', background: '#c8a96e', color: '#1a1a1a', padding: '1rem 2.25rem', fontSize: '0.85rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', textDecoration: 'none', marginBottom: '0.75rem' }}
            >
              Ver todos os modelos →
            </Link>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)' }}>★ 4.9 Google · 200 mil peças vendidas</div>
          </div>
        </section>

      </main>
    </>
  )
```

- [ ] **Step 2: Add imports at the top of the file** (after existing imports)

```tsx
import HeroCommercial from '@/components/profession-lp/HeroCommercial'
import CompactTrustBar from '@/components/profession-lp/CompactTrustBar'
import GoogleRatingCarousel from '@/components/profession-lp/GoogleRatingCarousel'
import InstagramLazy from '@/components/profession-lp/InstagramLazy'
import FabricGuideCards from '@/components/profession-lp/FabricGuideCards'
import ProfessionLinksNeutral from '@/components/profession-lp/ProfessionLinksNeutral'
```

- [ ] **Step 3: Build check**

```bash
cd /Users/rhammon/SiteJaleca/jaleca-nextjs && npx tsc --noEmit 2>&1 | head -30
```

Expected: no errors

- [ ] **Step 4: Commit**

```bash
git add app/jaleco-feminino/page.tsx
git commit -m "feat(lp): jaleco-feminino — novo layout comercial mobile-first"
```

---

## Task 8: Apply layout to jaleco-medica/page.tsx

**Files:**
- Modify: `app/jaleco-medica/page.tsx`

- [ ] **Step 1: Read current page to understand its data arrays and schemas**

```bash
cat app/jaleco-medica/page.tsx
```

- [ ] **Step 2: Add the 6 new imports (same as Task 7 Step 2)**

- [ ] **Step 3: Replace the `return` block** with the same layout structure as Task 7, changing only:
  - `eyebrow`: `"Jaleca · Para médicas"`
  - `h1Line1`: `"Jaleco para Médica"`
  - `h1Line2`: `"Presença que inspira confiança"`
  - `description`: `"Modelagem slim com elastano para jornadas de 12h. Conforto e autoridade desde o primeiro olhar. Do PP ao G3."`
  - `collectionHref`: `"#colecao"`
  - `allHref`: `"/jaleco-medica"` (or whatever the existing "ver todos" link is)
  - Breadcrumb last item: `{ label: 'Jaleco para Médica', href: null }`
  - `ProfessionProductGrid` `professionKey`: keep existing value
  - `ProfessionLinksNeutral` `links`: use the page's existing `INTERNAL_LINKS` array
  - CTA paragraph: adjust to médica context

- [ ] **Step 4: Build check**

```bash
npx tsc --noEmit 2>&1 | head -20
```

- [ ] **Step 5: Commit**

```bash
git add app/jaleco-medica/page.tsx
git commit -m "feat(lp): jaleco-medica — novo layout comercial mobile-first"
```

---

## Task 9: Apply layout to jaleco-dentista-feminino/page.tsx

**Files:**
- Modify: `app/jaleco-dentista-feminino/page.tsx`

- [ ] **Step 1: Read current page**

```bash
cat app/jaleco-dentista-feminino/page.tsx
```

- [ ] **Step 2: Add 6 new imports**

- [ ] **Step 3: Replace `return` block** with same structure, changing:
  - `eyebrow`: `"Jaleca · Para dentistas"`
  - `h1Line1`: `"Jaleco para Dentista"`
  - `h1Line2`: `"Elegância em cada atendimento"`
  - `description`: `"Jaleco com modelagem slim e tecido premium. Presença profissional que encanta o paciente desde a entrada."`
  - Breadcrumb: `{ label: 'Jaleco para Dentista', href: null }`
  - CTA paragraph: adjust to dentista context

- [ ] **Step 4: Build check + Commit**

```bash
npx tsc --noEmit 2>&1 | head -20
git add app/jaleco-dentista-feminino/page.tsx
git commit -m "feat(lp): jaleco-dentista-feminino — novo layout comercial mobile-first"
```

---

## Task 10: Apply layout to jaleco-feminino-branco/page.tsx

**Files:**
- Modify: `app/jaleco-feminino-branco/page.tsx`

- [ ] **Step 1: Read current page**

```bash
cat app/jaleco-feminino-branco/page.tsx
```

- [ ] **Step 2: Add 6 new imports**

- [ ] **Step 3: Replace `return` block**, changing:
  - `eyebrow`: `"Jaleca · Jaleco branco feminino"`
  - `h1Line1`: `"Jaleco Feminino Branco"`
  - `h1Line2`: `"Branco puro que não amarela"`
  - `description`: `"Tecido premium que mantém o branco impecável em 12h. Slim, Princesa e Elastex em branco. Do PP ao G3."`
  - Breadcrumb: `{ label: 'Jaleco Feminino Branco', href: null }`

- [ ] **Step 4: Build check + Commit**

```bash
npx tsc --noEmit 2>&1 | head -20
git add app/jaleco-feminino-branco/page.tsx
git commit -m "feat(lp): jaleco-feminino-branco — novo layout comercial mobile-first"
```

---

## Task 11: Apply layout to jaleco-feminino-acinturado/page.tsx

**Files:**
- Modify: `app/jaleco-feminino-acinturado/page.tsx`

- [ ] **Step 1: Read current page**

```bash
cat app/jaleco-feminino-acinturado/page.tsx
```

- [ ] **Step 2: Add 6 new imports**

- [ ] **Step 3: Replace `return` block**, changing:
  - `eyebrow`: `"Jaleca · Jaleco acinturado feminino"`
  - `h1Line1`: `"Jaleco Feminino Acinturado"`
  - `h1Line2`: `"Modelagem que valoriza você"`
  - `description`: `"Recortes laterais que seguem a silhueta. Beleza que transmite autoridade. Do PP ao G3 com elastano."`
  - Breadcrumb: `{ label: 'Jaleco Feminino Acinturado', href: null }`

- [ ] **Step 4: Build check + Commit**

```bash
npx tsc --noEmit 2>&1 | head -20
git add app/jaleco-feminino-acinturado/page.tsx
git commit -m "feat(lp): jaleco-feminino-acinturado — novo layout comercial mobile-first"
```

---

## Task 12: Deploy to production

- [ ] **Step 1: Final build check**

```bash
cd /Users/rhammon/SiteJaleca/jaleca-nextjs && npx tsc --noEmit && npm run build 2>&1 | tail -20
```

Expected: `✓ Compiled successfully`

- [ ] **Step 2: Ask user for deploy confirmation** — never deploy without explicit approval

> "Build passed. Deploy to production?"

- [ ] **Step 3: Deploy (only after approval)**

```bash
vercel --prod
```

- [ ] **Step 4: Verify TTFB on updated pages**

```bash
for slug in jaleco-feminino jaleco-medica jaleco-dentista-feminino jaleco-feminino-branco jaleco-feminino-acinturado; do
  t=$(curl -o /dev/null -s -w "%{time_total}" "https://jaleca.com.br/${slug}")
  echo "$slug → ${t}s"
done
```

Expected: all under 0.5s

---

## Self-Review

**Spec coverage:**
- ✅ Hero com price + PIX (Task 1)
- ✅ Trust bar compact horizontal (Task 2)
- ✅ 8 produtos — `ProfessionProductGrid` já suporta até 30; no mockup aprovado são 8 visíveis (Task 7)
- ✅ Google 4.9★ + carrossel clientes (Task 3)
- ✅ Instagram lazy (Task 4)
- ✅ Modelos (Task 7 — inline, data já existe)
- ✅ FAQ accordion com native `<details>` (Task 7 — unchanged from current)
- ✅ Guia de tecidos como cards (Task 5)
- ✅ Links de profissão neutros (Task 6)
- ✅ CTA fundo escuro botão dourado (Task 7)
- ✅ Zero images above fold (HeroCommercial não usa `<Image>`)
- ✅ SEO schemas preservados (Task 7 — schemas untouched)
- ✅ Aplicado em 5 páginas (Tasks 7-11)
- ✅ Deploy com confirmação (Task 12)

**Placeholder scan:** Nenhum TBD, TODO ou "similar ao Task N" no plano.

**Type consistency:** `HeroCommercial` props definidas em Task 1, usadas em Task 7 com todos os campos nomeados. `ProfessionLinksNeutral` recebe `links: {href, label}[]` — compatível com `INTERNAL_LINKS.map(l => ({ href: l.href, label: l.label }))` em Task 7.

'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'

type ProductData = {
  slug: string
  name: string
  price: string
  image?: string
}

type LookData = {
  number: string
  category: string
  title: string
  description: string
  heroImage: string
  heroImageAlt: string
  featured: ProductData
  others: ProductData[]
}

type Props = {
  looks: LookData[]
}

export default function LookbookClient({ looks }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const currentPanelRef = useRef(0)
  const isScrollingRef = useRef(false)

  useEffect(() => {
    // Fonts
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap'
    document.head.appendChild(link)

    // Overflow
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
      document.head.removeChild(link)
    }
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const safeContainer = container

    const panels = safeContainer.querySelectorAll<HTMLElement>('.lb-panel')
    const progressBar = document.querySelector<HTMLElement>('.lb-progress')
    const cursor = document.querySelector<HTMLElement>('.lb-cursor')
    const cursorDot = document.querySelector<HTMLElement>('.lb-cursor-dot')

    function scrollToPanel(index: number) {
      if (index < 0 || index >= panels.length || isScrollingRef.current) return
      isScrollingRef.current = true
      currentPanelRef.current = index
      safeContainer.style.transform = `translateX(-${index * 100}vw)`
      if (progressBar) {
        progressBar.style.width = `${(index / (panels.length - 1)) * 100}%`
      }
      setTimeout(() => { isScrollingRef.current = false }, 1000)
    }

    // Mouse move
    function onMouseMove(e: MouseEvent) {
      if (cursor) {
        cursor.style.left = e.clientX + 'px'
        cursor.style.top = e.clientY + 'px'
      }
      if (cursorDot) {
        cursorDot.style.left = (e.clientX - 4) + 'px'
        cursorDot.style.top = (e.clientY - 4) + 'px'
      }
    }

    // Cursor scale on links
    function onEnter() { if (cursor) cursor.style.transform = 'scale(1.5) translate(-50%,-50%)' }
    function onLeave() { if (cursor) cursor.style.transform = 'scale(1) translate(-50%,-50%)' }
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    // Wheel
    let wheelTimeout: ReturnType<typeof setTimeout>
    function onWheel(e: WheelEvent) {
      clearTimeout(wheelTimeout)
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 0) scrollToPanel(currentPanelRef.current + 1)
        else scrollToPanel(currentPanelRef.current - 1)
      }, 50)
    }

    // Touch
    let touchStartX = 0
    function onTouchStart(e: TouchEvent) { touchStartX = e.changedTouches[0].screenX }
    function onTouchEnd(e: TouchEvent) {
      const diff = touchStartX - e.changedTouches[0].screenX
      if (diff > 50) scrollToPanel(currentPanelRef.current + 1)
      if (diff < -50) scrollToPanel(currentPanelRef.current - 1)
    }

    // Keyboard
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') scrollToPanel(currentPanelRef.current + 1)
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') scrollToPanel(currentPanelRef.current - 1)
    }

    document.addEventListener('mousemove', onMouseMove)
    window.addEventListener('wheel', onWheel, { passive: true })
    safeContainer.addEventListener('touchstart', onTouchStart, { passive: true })
    safeContainer.addEventListener('touchend', onTouchEnd, { passive: true })
    document.addEventListener('keydown', onKeyDown)

    scrollToPanel(0)

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('wheel', onWheel)
      safeContainer.removeEventListener('touchstart', onTouchStart)
      safeContainer.removeEventListener('touchend', onTouchEnd)
      document.removeEventListener('keydown', onKeyDown)
      document.querySelectorAll('a, button').forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
      })
    }
  }, [])

  return (
    <>
      <style>{`
        :root {
          --gold: #d4af37;
          --gold-light: #f4d58d;
          --gold-dark: #a8894d;
          --cream: #faf8f3;
          --black: #0D0D0D;
          --white: #FEFEFE;
          --accent: #c9a961;
        }

        .lb-wrapper {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: var(--cream);
          cursor: none;
          font-family: 'Space Grotesk', sans-serif;
          overflow: hidden;
        }

        .lb-cursor {
          width: 40px;
          height: 40px;
          border: 2px solid var(--gold);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 10000;
          mix-blend-mode: difference;
          transform: translate(-50%, -50%);
          transition: transform 0.2s ease;
        }

        .lb-cursor-dot {
          width: 8px;
          height: 8px;
          background: var(--gold);
          border-radius: 50%;
          position: fixed;
          pointer-events: none;
          z-index: 10001;
        }

        .lb-progress {
          position: fixed;
          top: 0;
          left: 0;
          height: 3px;
          width: 0%;
          background: linear-gradient(90deg, var(--gold), var(--gold-light));
          z-index: 10000;
          transition: width 0.3s ease;
          box-shadow: 0 0 10px var(--gold), 0 0 20px rgba(212,175,55,0.5);
        }

        .lb-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: 2rem 3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          mix-blend-mode: difference;
        }

        .lb-logo {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2rem;
          letter-spacing: 0.1em;
          color: var(--white);
          text-decoration: none;
        }

        .lb-nav-menu {
          display: flex;
          gap: 2rem;
          list-style: none;
        }

        .lb-nav-menu a {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--white);
          text-decoration: none;
          position: relative;
        }

        .lb-nav-menu a::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: var(--white);
          transition: width 0.3s;
        }

        .lb-nav-menu a:hover::after { width: 100%; }

        .lb-scroll-hint {
          position: fixed;
          bottom: 3rem;
          right: 3rem;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 1rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: var(--black);
          mix-blend-mode: difference;
        }

        .lb-arrow {
          width: 40px;
          height: 1px;
          background: currentColor;
          position: relative;
        }

        .lb-arrow::after {
          content: '';
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%) rotate(45deg);
          width: 8px;
          height: 8px;
          border-right: 1px solid currentColor;
          border-top: 1px solid currentColor;
        }

        .lb-container {
          display: flex;
          height: 100vh;
          width: fit-content;
          transition: transform 1s cubic-bezier(0.76, 0, 0.24, 1);
        }

        .lb-panel {
          width: 100vw;
          height: 100vh;
          position: relative;
          flex-shrink: 0;
          overflow: hidden;
        }

        /* Hero */
        .lb-hero {
          background: var(--black);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .lb-hero-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(5rem, 20vw, 18rem);
          line-height: 0.85;
          color: var(--cream);
          text-align: center;
          z-index: 2;
          animation: lb-breathe 4s ease-in-out infinite;
        }

        @keyframes lb-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .lb-hero-sub {
          position: absolute;
          bottom: 4rem;
          left: 50%;
          transform: translateX(-50%) rotate(-2deg);
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.9rem;
          letter-spacing: 0.3em;
          color: var(--gold);
          text-transform: uppercase;
        }

        .lb-hero-year {
          position: absolute;
          top: 50%;
          right: 5rem;
          transform: translateY(-50%) rotate(90deg);
          font-family: 'Bebas Neue', sans-serif;
          font-size: 10rem;
          color: rgba(245,245,220,0.05);
          letter-spacing: 0.1em;
        }

        /* Look panels */
        .lb-look {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          background: var(--cream);
        }

        .lb-look.lb-even {
          grid-template-columns: 1fr 1.2fr;
          background: var(--white);
        }

        .lb-look.lb-even .lb-img { order: 2; }

        .lb-img {
          position: relative;
          overflow: hidden;
          height: 100vh;
        }

        .lb-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.1);
          transition: transform 2s cubic-bezier(0.76, 0, 0.24, 1);
        }

        .lb-look:hover .lb-img img { transform: scale(1); }

        .lb-img::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, transparent, var(--gold));
          opacity: 0;
          mix-blend-mode: multiply;
          transition: opacity 0.8s;
          z-index: 1;
        }

        .lb-look:hover .lb-img::before { opacity: 0.15; }

        .lb-look-num {
          position: absolute;
          top: -2rem;
          left: -2rem;
          font-family: 'Anton', sans-serif;
          font-size: 25rem;
          line-height: 0.8;
          background: linear-gradient(135deg, var(--gold-dark), var(--gold), var(--gold-light));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          opacity: 0.1;
          z-index: 0;
          transform: rotate(-5deg);
          pointer-events: none;
        }

        .lb-content {
          padding: 8rem 5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          overflow-y: auto;
        }

        .lb-cat {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 2rem;
          transform: rotate(-2deg);
        }

        .lb-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3rem, 8vw, 7rem);
          line-height: 0.9;
          letter-spacing: 0.05em;
          margin-bottom: 2rem;
          color: var(--black);
        }

        .lb-desc {
          font-size: 1.05rem;
          line-height: 1.6;
          color: #333;
          margin-bottom: 2.5rem;
          max-width: 500px;
        }

        /* Products grid */
        .lb-products {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
        }

        .lb-featured {
          grid-column: 1 / -1;
          background: var(--black);
          color: var(--cream);
          padding: 2rem;
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 2rem;
          border: 3px solid var(--gold);
          position: relative;
          box-shadow: 0 0 30px rgba(212,175,55,0.4), inset 0 0 0 1px rgba(212,175,55,0.2);
          text-decoration: none;
          transition: box-shadow 0.4s;
        }

        .lb-featured::after {
          content: '★ DESTAQUE';
          position: absolute;
          top: -0.8rem;
          right: 2rem;
          background: var(--black);
          padding: 0 1rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          color: var(--gold);
        }

        .lb-featured:hover {
          box-shadow: 0 0 50px rgba(212,175,55,0.6), inset 0 0 0 1px rgba(212,175,55,0.4);
        }

        .lb-feat-img {
          aspect-ratio: 3/4;
          overflow: hidden;
        }

        .lb-feat-img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: grayscale(30%);
          transition: filter 0.6s;
        }

        .lb-featured:hover .lb-feat-img img { filter: grayscale(0%); }

        .lb-feat-body {
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1.5rem;
        }

        .lb-feat-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 2.5rem;
          line-height: 0.9;
          letter-spacing: 0.05em;
        }

        .lb-feat-desc {
          font-size: 1rem;
          line-height: 1.6;
          opacity: 0.85;
        }

        .lb-feat-price {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 2rem;
          color: var(--gold);
          font-weight: 600;
        }

        .lb-feat-btn {
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          color: var(--black);
          padding: 1.2rem 3rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.8rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          font-weight: 600;
          display: inline-block;
          width: fit-content;
          transition: all 0.4s cubic-bezier(0.76, 0, 0.24, 1);
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(212,175,55,0.3);
        }

        .lb-feat-btn:hover {
          box-shadow: 0 8px 30px rgba(212,175,55,0.5);
          transform: translateY(-2px);
        }

        /* Small product card */
        .lb-card {
          background: rgba(0,0,0,0.03);
          padding: 1.5rem;
          text-decoration: none;
          color: inherit;
          transition: all 0.4s cubic-bezier(0.76, 0, 0.24, 1);
          position: relative;
          overflow: hidden;
          border: 1px solid transparent;
        }

        .lb-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          transform: translateX(-100%) skewX(-15deg);
          transition: transform 0.6s cubic-bezier(0.76, 0, 0.24, 1);
        }

        .lb-card:hover::before { transform: translateX(0) skewX(-15deg); }

        .lb-card:hover {
          border-color: var(--gold);
          transform: translateX(10px);
          box-shadow: 0 10px 30px rgba(212,175,55,0.3);
        }

        .lb-card-info { position: relative; z-index: 1; }

        .lb-card-name {
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          line-height: 1.3;
        }

        .lb-card-price {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--accent);
        }

        .lb-card:hover .lb-card-price { color: var(--black); }

        /* Final panel */
        .lb-final {
          background: var(--black);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .lb-final-grid {
          position: absolute;
          inset: 0;
          background:
            repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,215,0,0.03) 50px, rgba(255,215,0,0.03) 51px),
            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,215,0,0.03) 50px, rgba(255,215,0,0.03) 51px);
          pointer-events: none;
        }

        .lb-final-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(4rem, 15vw, 12rem);
          line-height: 0.85;
          color: var(--gold);
          text-align: center;
          margin-bottom: 2rem;
          text-transform: uppercase;
          transform: rotate(-3deg);
          position: relative;
          z-index: 1;
        }

        .lb-final-sub {
          font-size: 1.3rem;
          color: var(--cream);
          text-align: center;
          max-width: 600px;
          margin-bottom: 3rem;
          line-height: 1.6;
          position: relative;
          z-index: 1;
        }

        .lb-final-cta {
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          color: var(--black);
          padding: 1.5rem 4rem;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.5rem;
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.76, 0, 0.24, 1);
          box-shadow: 0 8px 30px rgba(212,175,55,0.4);
          position: relative;
          z-index: 1;
        }

        .lb-final-cta:hover {
          box-shadow: 0 12px 40px rgba(212,175,55,0.6);
          transform: translateY(-3px);
        }

        @media (max-width: 768px) {
          .lb-nav { padding: 1.5rem; }
          .lb-logo { font-size: 1.5rem; }
          .lb-nav-menu { display: none; }
          .lb-look, .lb-look.lb-even {
            grid-template-columns: 1fr;
            grid-template-rows: 50vh 50vh;
          }
          .lb-look.lb-even .lb-img { order: 0; }
          .lb-content { padding: 3rem 2rem; overflow-y: auto; }
          .lb-look-num { font-size: 12rem; }
          .lb-products { grid-template-columns: 1fr; }
          .lb-featured { grid-template-columns: 1fr; }
          .lb-scroll-hint { bottom: 1.5rem; right: 1.5rem; }
        }
      `}</style>

      <div className="lb-wrapper">
        <div className="lb-cursor" />
        <div className="lb-cursor-dot" />
        <div className="lb-progress" />

        <nav className="lb-nav">
          <Link href="/" className="lb-logo">JALECA</Link>
          <ul className="lb-nav-menu">
            <li><Link href="/categoria/jalecos">Jalecos</Link></li>
            <li><Link href="/categoria/conjuntos">Conjuntos</Link></li>
            <li><Link href="/lookbook">Lookbook</Link></li>
          </ul>
        </nav>

        <div className="lb-scroll-hint">
          <span>Arraste</span>
          <div className="lb-arrow" />
        </div>

        <div className="lb-container" ref={containerRef}>
          {/* Hero */}
          <section className="lb-panel lb-hero">
            <h1 className="lb-hero-title">JALECA<br />LOOKBOOK</h1>
            <div className="lb-hero-sub">Revolução em Uniformes</div>
            <div className="lb-hero-year">2026</div>
          </section>

          {/* Looks */}
          {looks.map((look, i) => (
            <section key={look.number} className={`lb-panel lb-look${i % 2 !== 0 ? ' lb-even' : ''}`}>
              <div className="lb-img">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={look.heroImage} alt={look.heroImageAlt} loading="lazy" />
              </div>
              <div className="lb-content">
                <div className="lb-look-num">{look.number}</div>
                <div className="lb-cat">/// {look.category}</div>
                <h2 className="lb-title">{look.title}</h2>
                <p className="lb-desc">{look.description}</p>

                <div className="lb-products">
                  {/* Featured card */}
                  <Link href={`/produto/${look.featured.slug}`} className="lb-featured">
                    <div className="lb-feat-img">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={look.featured.image || look.heroImage} alt={look.featured.name} />
                    </div>
                    <div className="lb-feat-body">
                      <div className="lb-feat-name">{look.featured.name}</div>
                      <div
                        className="lb-feat-price"
                        dangerouslySetInnerHTML={{ __html: look.featured.price || '—' }}
                      />
                      <span className="lb-feat-btn">Ver Produto</span>
                    </div>
                  </Link>

                  {/* Other cards */}
                  {look.others.map(p => (
                    <Link key={p.slug} href={`/produto/${p.slug}`} className="lb-card">
                      <div className="lb-card-info">
                        <div className="lb-card-name">{p.name}</div>
                        <div
                          className="lb-card-price"
                          dangerouslySetInnerHTML={{ __html: p.price || '—' }}
                        />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          ))}

          {/* Final */}
          <section className="lb-panel lb-final">
            <div className="lb-final-grid" />
            <h2 className="lb-final-title">EXPLORE A COLEÇÃO</h2>
            <p className="lb-final-sub">
              Mais de 200 modelos que transformam profissionais em referências.
              Descubra o uniforme que reflete sua excelência.
            </p>
            <Link href="/produtos" className="lb-final-cta">VER TUDO</Link>
          </section>
        </div>
      </div>
    </>
  )
}

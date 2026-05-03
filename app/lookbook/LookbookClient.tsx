'use client'

import Link from 'next/link'
import { useEffect } from 'react'

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
  useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://fonts.googleapis.com/css2?family=Anton&family=Bebas+Neue&family=Space+Grotesk:wght@300;400;500;600;700&family=IBM+Plex+Mono:wght@400;600&display=swap'
    document.head.appendChild(link)
    return () => { if (document.head.contains(link)) document.head.removeChild(link) }
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

        .lb-wrap { font-family: 'Space Grotesk', sans-serif; background: var(--cream); }

        /* Progress bar top */
        .lb-progress-bar {
          position: fixed; top: 0; left: 0;
          height: 3px;
          background: linear-gradient(90deg, var(--gold), var(--gold-light));
          z-index: 9999;
          width: 0;
          box-shadow: 0 0 8px var(--gold);
          transition: width 0.1s;
        }

        /* Hero */
        .lb-hero {
          background: var(--black);
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .lb-hero-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(4rem, 18vw, 16rem);
          line-height: 0.85;
          color: var(--cream);
          text-align: center;
          animation: lb-breathe 4s ease-in-out infinite;
        }

        @keyframes lb-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.02); }
        }

        .lb-hero-sub {
          margin-top: 2rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: clamp(0.65rem, 2vw, 0.9rem);
          letter-spacing: 0.3em;
          color: var(--gold);
          text-transform: uppercase;
        }

        .lb-hero-scroll {
          position: absolute;
          bottom: 2.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.4);
        }

        .lb-hero-scroll-line {
          width: 1px;
          height: 40px;
          background: linear-gradient(to bottom, var(--gold), transparent);
          animation: lb-scroll-line 1.5s ease-in-out infinite;
        }

        @keyframes lb-scroll-line {
          0% { transform: scaleY(0); transform-origin: top; }
          50% { transform: scaleY(1); transform-origin: top; }
          51% { transform: scaleY(1); transform-origin: bottom; }
          100% { transform: scaleY(0); transform-origin: bottom; }
        }

        /* Look section — grid desktop, stack mobile */
        .lb-look {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 100svh;
        }

        .lb-look.lb-even { direction: rtl; }
        .lb-look.lb-even > * { direction: ltr; }

        .lb-look-img {
          position: sticky;
          top: 0;
          height: 100svh;
          overflow: hidden;
        }

        .lb-look-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: top center;
          transition: transform 8s ease;
        }

        .lb-look:hover .lb-look-img img { transform: scale(1.04); }

        .lb-look-body {
          padding: clamp(3rem, 6vw, 8rem) clamp(2rem, 5vw, 6rem);
          display: flex;
          flex-direction: column;
          justify-content: center;
          background: var(--cream);
        }

        .lb-look.lb-even .lb-look-body { background: var(--white); }

        .lb-num {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 0.3em;
          color: var(--accent);
          margin-bottom: 0.5rem;
          text-transform: uppercase;
        }

        .lb-cat {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 0.25em;
          color: rgba(0,0,0,0.35);
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }

        .lb-look-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(3rem, 7vw, 7rem);
          line-height: 0.9;
          color: var(--black);
          margin-bottom: 1.5rem;
        }

        .lb-desc {
          font-size: clamp(0.9rem, 1.5vw, 1.05rem);
          line-height: 1.7;
          color: #444;
          margin-bottom: 2.5rem;
          max-width: 480px;
        }

        /* Products */
        .lb-products { display: flex; flex-direction: column; gap: 1rem; }

        .lb-featured {
          background: var(--black);
          color: var(--cream);
          border: 2px solid var(--gold);
          box-shadow: 0 0 24px rgba(212,175,55,0.25);
          text-decoration: none;
          display: grid;
          grid-template-columns: 1fr 1.6fr;
          position: relative;
          transition: box-shadow 0.4s;
          overflow: hidden;
        }

        .lb-featured:hover { box-shadow: 0 0 40px rgba(212,175,55,0.45); }

        .lb-featured::before {
          content: '★ DESTAQUE';
          position: absolute;
          top: -0.7rem; right: 1.5rem;
          background: var(--black);
          padding: 0 0.75rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 0.2em;
          color: var(--gold);
          z-index: 2;
        }

        .lb-feat-img {
          aspect-ratio: 3/4;
          overflow: hidden;
        }

        .lb-feat-img img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: top center;
          filter: grayscale(20%);
          transition: filter 0.5s, transform 0.8s;
        }

        .lb-featured:hover .lb-feat-img img {
          filter: grayscale(0%);
          transform: scale(1.04);
        }

        .lb-feat-body {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 1rem;
        }

        .lb-feat-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: clamp(1.4rem, 3vw, 2.2rem);
          line-height: 0.95;
        }

        .lb-feat-price {
          font-family: 'IBM Plex Mono', monospace;
          font-size: clamp(1.2rem, 2.5vw, 1.8rem);
          color: var(--gold);
          font-weight: 600;
        }

        .lb-feat-btn {
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          color: var(--black);
          padding: 0.9rem 1.5rem;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          font-weight: 600;
          display: block;
          text-align: center;
          transition: box-shadow 0.3s, transform 0.3s;
        }

        .lb-featured:hover .lb-feat-btn {
          box-shadow: 0 4px 16px rgba(212,175,55,0.5);
          transform: translateY(-1px);
        }

        .lb-card {
          background: rgba(0,0,0,0.03);
          border: 1px solid rgba(212,175,55,0.2);
          padding: 1rem 1.25rem;
          text-decoration: none;
          color: inherit;
          display: flex;
          justify-content: space-between;
          align-items: center;
          transition: background 0.3s, border-color 0.3s, transform 0.3s;
        }

        .lb-card:hover {
          background: rgba(212,175,55,0.08);
          border-color: var(--gold);
          transform: translateX(4px);
        }

        .lb-card-name {
          font-size: 0.88rem;
          font-weight: 600;
          flex: 1;
        }

        .lb-card-price {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--accent);
          margin-left: 1rem;
          white-space: nowrap;
        }

        /* Final panel */
        .lb-final {
          background: var(--black);
          min-height: 80svh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          padding: 4rem 2rem;
          text-align: center;
        }

        .lb-final-grid {
          position: absolute; inset: 0;
          background:
            repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,215,0,0.025) 50px, rgba(255,215,0,0.025) 51px),
            repeating-linear-gradient(90deg, transparent, transparent 50px, rgba(255,215,0,0.025) 50px, rgba(255,215,0,0.025) 51px);
          pointer-events: none;
        }

        .lb-final-title {
          font-family: 'Anton', sans-serif;
          font-size: clamp(3.5rem, 12vw, 10rem);
          line-height: 0.85;
          color: var(--gold);
          margin-bottom: 1.5rem;
          transform: rotate(-2deg);
          position: relative; z-index: 1;
        }

        .lb-final-sub {
          font-size: clamp(0.9rem, 2vw, 1.2rem);
          color: rgba(255,255,255,0.8);
          max-width: 560px;
          line-height: 1.7;
          margin-bottom: 2.5rem;
          position: relative; z-index: 1;
        }

        .lb-final-cta {
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          color: var(--black);
          padding: 1.3rem 4rem;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 1.4rem;
          letter-spacing: 0.1em;
          text-decoration: none;
          transition: all 0.4s;
          box-shadow: 0 6px 24px rgba(212,175,55,0.35);
          position: relative; z-index: 1;
        }

        .lb-final-cta:hover {
          box-shadow: 0 10px 36px rgba(212,175,55,0.55);
          transform: translateY(-2px);
        }

        /* Mobile */
        @media (max-width: 767px) {
          .lb-look {
            grid-template-columns: 1fr;
            min-height: unset;
          }

          .lb-look-img {
            position: relative;
            height: 75vw;
            top: 0;
          }

          .lb-look-body { padding: 2rem 1.5rem 3rem; }

          .lb-featured {
            grid-template-columns: 1fr;
          }

          .lb-feat-img { aspect-ratio: 16/9; }
        }
      `}</style>

      {/* Barra de progresso scroll */}
      <script dangerouslySetInnerHTML={{ __html: `
        (function(){
          var bar = document.querySelector('.lb-progress-bar');
          if(!bar) return;
          window.addEventListener('scroll', function(){
            var pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
            bar.style.width = pct + '%';
          }, {passive:true});
        })();
      `}} />

      <div className="lb-wrap">
        <div className="lb-progress-bar" />

        {/* Hero */}
        <section className="lb-hero">
          <h1 className="lb-hero-title">JALECA<br />LOOKBOOK</h1>
          <p className="lb-hero-sub">Revolução em Uniformes · 2026</p>
          <div className="lb-hero-scroll">
            <span>scroll</span>
            <div className="lb-hero-scroll-line" />
          </div>
        </section>

        {/* Looks */}
        {looks.map((look, i) => (
          <section key={look.number} className={`lb-look${i % 2 !== 0 ? ' lb-even' : ''}`}>
            <div className="lb-look-img">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={look.heroImage} alt={look.heroImageAlt} loading="lazy" />
            </div>
            <div className="lb-look-body">
              <div className="lb-num">{look.number} / {String(looks.length).padStart(2, '0')}</div>
              <div className="lb-cat">/// {look.category}</div>
              <h2 className="lb-look-title">{look.title}</h2>
              <p className="lb-desc">{look.description}</p>

              <div className="lb-products">
                <Link href={`/produto/${look.featured.slug}`} className="lb-featured">
                  <div className="lb-feat-img">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={look.featured.image || look.heroImage} alt={look.featured.name} />
                  </div>
                  <div className="lb-feat-body">
                    <div className="lb-feat-name">{look.featured.name}</div>
                    <div className="lb-feat-price" dangerouslySetInnerHTML={{ __html: look.featured.price || '—' }} />
                    <span className="lb-feat-btn">Ver Produto →</span>
                  </div>
                </Link>

                {look.others.map(p => (
                  <Link key={p.slug} href={`/produto/${p.slug}`} className="lb-card">
                    <span className="lb-card-name">{p.name}</span>
                    <span className="lb-card-price" dangerouslySetInnerHTML={{ __html: p.price || '—' }} />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Final */}
        <section className="lb-final">
          <div className="lb-final-grid" />
          <h2 className="lb-final-title">EXPLORE A COLEÇÃO</h2>
          <p className="lb-final-sub">
            Mais de 200 modelos que transformam profissionais em referências.
            Descubra o uniforme que reflete sua excelência.
          </p>
          <Link href="/produtos" className="lb-final-cta">VER TUDO</Link>
        </section>
      </div>
    </>
  )
}

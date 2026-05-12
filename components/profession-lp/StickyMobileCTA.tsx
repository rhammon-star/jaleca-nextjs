'use client'

import { useEffect, useState } from 'react'

type Props = {
  href: string
  startingPrice?: string
  label?: string
}

export default function StickyMobileCTA({ href, startingPrice, label = 'Ver coleção' }: Props) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        setVisible(window.scrollY > 600)
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <a
      href={href}
      aria-label={label}
      data-visible={visible}
      style={{
        position: 'fixed',
        left: '1rem',
        right: '1rem',
        bottom: 'calc(env(safe-area-inset-bottom, 0) + 1rem)',
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '0.75rem',
        padding: '0.95rem 1.25rem',
        background: '#1a1a1a',
        color: '#fff',
        textDecoration: 'none',
        borderRadius: 4,
        boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
        fontSize: '0.85rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        fontWeight: 500,
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(120%)',
        transition: 'opacity 220ms ease, transform 220ms ease',
        pointerEvents: visible ? 'auto' : 'none',
      }}
      className="md:hidden"
    >
      <span>{label}</span>
      {startingPrice && (
        <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>
          {startingPrice}
        </span>
      )}
    </a>
  )
}

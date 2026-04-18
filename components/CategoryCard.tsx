'use client'

import Link from 'next/link'
import { useRef, useEffect, useState } from 'react'

interface CategoryCardProps {
  title: string
  subtitle: string
  href: string
  bg: string
  accent: string
  video?: string
}

export default function CategoryCard({ title, subtitle, href, bg, accent, video }: CategoryCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const cardRef = useRef<HTMLAnchorElement>(null)
  const [visible, setVisible] = useState(false)

  // Só carrega o vídeo quando o card entra na viewport
  useEffect(() => {
    if (!video || !cardRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    observer.observe(cardRef.current)
    return () => observer.disconnect()
  }, [video])

  // Autoplay suave quando vídeo carrega
  useEffect(() => {
    if (visible && videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [visible])

  return (
    <Link
      ref={cardRef}
      href={href}
      className={`group relative overflow-hidden ${video ? '' : bg} aspect-[2/1] md:aspect-[3/4] flex flex-col justify-end p-6 md:p-8`}
    >
      {video && (
        <>
          <div className={`absolute inset-0 ${bg}`} />

          {visible && (
            <video
              ref={videoRef}
              src={video}
              muted
              loop
              playsInline
              preload="none"
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 opacity-30 group-hover:opacity-100"
            />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent group-hover:from-black/65 transition-all duration-500" />

          {/* Ícone play discreto */}
          <div className="absolute top-4 right-4 opacity-40 group-hover:opacity-0 transition-opacity duration-300">
            <div className="w-8 h-8 rounded-full border border-white/60 flex items-center justify-center">
              <svg width="10" height="12" viewBox="0 0 10 12" fill="white">
                <path d="M0 0L10 6L0 12V0Z" />
              </svg>
            </div>
          </div>
        </>
      )}

      <div className="relative translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
        <p className={`text-[12px] md:text-[10px] font-semibold tracking-[0.2em] md:tracking-[0.3em] uppercase ${video ? 'text-white/70 group-hover:text-white/90' : accent} mb-1`}>
          {subtitle}
        </p>
        <h2 className={`font-display text-2xl md:text-3xl font-semibold ${video ? 'text-white' : accent} mb-3`}>
          {title}
        </h2>
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase ${video ? 'text-white' : accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
          Explorar →
        </span>
      </div>

      {!video && (
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
      )}
    </Link>
  )
}

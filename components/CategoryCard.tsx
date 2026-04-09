'use client'

import Link from 'next/link'
import { useRef } from 'react'

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

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <Link
      href={href}
      className={`group relative overflow-hidden ${video ? '' : bg} aspect-[4/3] md:aspect-[3/4] flex flex-col justify-end p-6 md:p-8`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {video && (
        <>
          {/* Background color fallback */}
          <div className={`absolute inset-0 ${bg}`} />
          {/* Video */}
          <video
            ref={videoRef}
            src={video}
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-500 opacity-0 group-hover:opacity-100"
          />
          {/* Gradient overlay para o texto ficar legível */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent group-hover:from-black/70 transition-all duration-300" />
        </>
      )}

      <div className="relative translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
        <p className={`text-[10px] font-semibold tracking-[0.3em] uppercase ${video ? 'text-white/70 group-hover:text-white/90' : accent} mb-1 opacity-70`}>
          {subtitle}
        </p>
        <h3 className={`font-display text-2xl md:text-3xl font-semibold ${video ? 'text-white' : accent} mb-3`}>
          {title}
        </h3>
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase ${video ? 'text-white' : accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
          Explorar →
        </span>
      </div>

      {/* Overlay shine */}
      {!video && (
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
      )}
    </Link>
  )
}

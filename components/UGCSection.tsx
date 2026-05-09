'use client'

import { useRef, useState } from 'react'

const ITEMS = [
  { type: 'foto', src: '/ugc/cliente-01.jpg', alt: 'Dentista usando jaleco Jaleca' },
  { type: 'foto', src: '/ugc/cliente-02.jpg', alt: 'Profissional de estética usando jaleco Jaleca' },
  { type: 'video', src: '/ugc/cliente-v1.mp4', thumb: '/ugc/cliente-v1-thumb.jpg', alt: 'Clientes usando jaleco Jaleca' },
  { type: 'foto', src: '/ugc/cliente-03.jpg', alt: 'Profissional de saúde usando jaleco Jaleca' },
  { type: 'foto', src: '/ugc/cliente-05.jpg', alt: 'Profissional usando jaleco rosa Jaleca' },
  { type: 'video', src: '/ugc/cliente-v2.mp4', thumb: '/ugc/cliente-v2-thumb.jpg', alt: 'Médica usando jaleco bege Jaleca' },
  { type: 'foto', src: '/ugc/cliente-06.jpg', alt: 'Dentista usando jaleco branco Jaleca' },
  { type: 'foto', src: '/ugc/cliente-07.jpg', alt: 'Médico usando jaleco masculino Jaleca' },
  { type: 'video', src: '/ugc/cliente-v3.mp4', thumb: '/ugc/cliente-v3-thumb.jpg', alt: 'Dentista usando jaleco masculino Jaleca' },
  { type: 'foto', src: '/ugc/cliente-09.jpg', alt: 'Profissional usando jaleco preto Jaleca' },
  { type: 'foto', src: '/ugc/cliente-04.jpg', alt: 'Profissional de saúde usando jaleco Jaleca' },
  { type: 'video', src: '/ugc/cliente-v4.mp4', thumb: '/ugc/cliente-v4-thumb.jpg', alt: 'Nutricionista usando jaleco Jaleca' },
  { type: 'foto', src: '/ugc/cliente-08.jpg', alt: 'Profissional de saúde usando jaleco Jaleca' },
  { type: 'foto', src: '/ugc/cliente-10.jpg', alt: 'Profissional usando jaleco Jaleca' },
  { type: 'foto', src: '/ugc/cliente-11.jpg', alt: 'Profissional usando jaleco Jaleca' },
]

function VideoThumb({ src, thumb, alt }: { src: string; thumb: string; alt: string }) {
  const [playing, setPlaying] = useState(false)
  const ref = useRef<HTMLVideoElement>(null)

  function handlePlay(e: React.MouseEvent) {
    e.stopPropagation()
    setPlaying(true)
    ref.current?.play()
  }

  return (
    <div
      className="relative h-full w-full cursor-pointer"
      onClick={handlePlay}
    >
      <video
        ref={ref}
        src={src}
        poster={thumb}
        preload="none"
        playsInline
        muted
        loop
        controls={playing}
        className="h-full w-full object-cover"
      />
      {!playing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow">
            <svg className="ml-0.5 h-4 w-4 text-gray-900" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  )
}

// Duplica os itens para o loop infinito
const TRACK = [...ITEMS, ...ITEMS]

export default function UGCSection() {
  return (
    <div className="mt-8 md:mt-16 overflow-hidden">
      <p className="mb-4 text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Profissionais de todo o Brasil
      </p>

      {/* Marquee — CSS puro, sem JS de animação */}
      <div className="relative">
        {/* fade nas bordas */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent md:w-16" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent md:w-16" />

        <div
          className="flex gap-2.5"
          style={{
            animation: 'ugc-scroll 28s linear infinite',
            width: 'max-content',
          }}
        >
          {TRACK.map((item, i) => (
            <div
              key={i}
              className="relative h-48 w-40 flex-shrink-0 overflow-hidden rounded-lg bg-muted md:h-52 md:w-44"
            >
              {item.type === 'video' ? (
                <VideoThumb src={item.src!} thumb={item.thumb!} alt={item.alt} />
              ) : (
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes ugc-scroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ugc-track:hover { animation-play-state: paused; }
      `}</style>
    </div>
  )
}

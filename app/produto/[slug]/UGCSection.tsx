'use client'

import { useRef, useState } from 'react'

const FOTOS = [
  { src: '/ugc/cliente-01.jpg', alt: 'Dentista usando jaleco Jaleca' },
  { src: '/ugc/cliente-02.jpg', alt: 'Profissional de estética usando jaleco Jaleca' },
  { src: '/ugc/cliente-03.jpg', alt: 'Profissional de saúde usando jaleco Jaleca' },
  { src: '/ugc/cliente-05.jpg', alt: 'Profissional usando jaleco rosa Jaleca' },
  { src: '/ugc/cliente-06.jpg', alt: 'Dentista usando jaleco branco Jaleca' },
  { src: '/ugc/cliente-07.jpg', alt: 'Médico usando jaleco masculino Jaleca' },
  { src: '/ugc/cliente-09.jpg', alt: 'Profissional usando jaleco preto Jaleca' },
]

const VIDEOS = [
  { src: '/ugc/cliente-v1.mp4', thumb: '/ugc/cliente-v1-thumb.jpg', alt: 'Casal usando jaleco Jaleca' },
  { src: '/ugc/cliente-v2.mp4', thumb: '/ugc/cliente-v2-thumb.jpg', alt: 'Médica usando jaleco bege Jaleca' },
  { src: '/ugc/cliente-v3.mp4', thumb: '/ugc/cliente-v3-thumb.jpg', alt: 'Dentista usando jaleco masculino Jaleca' },
  { src: '/ugc/cliente-v4.mp4', thumb: '/ugc/cliente-v4-thumb.jpg', alt: 'Nutricionista usando jaleco Jaleca' },
]

function VideoItem({ src, thumb, alt }: { src: string; thumb: string; alt: string }) {
  const [playing, setPlaying] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  function handlePlay() {
    setPlaying(true)
    videoRef.current?.play()
  }

  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted cursor-pointer" onClick={handlePlay}>
      <video
        ref={videoRef}
        src={src}
        poster={thumb}
        preload="none"
        playsInline
        controls={playing}
        className="w-full h-full object-cover"
      />
      {!playing && (
        <>
          <div className="absolute inset-0 bg-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-gray-900 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default function UGCSection() {
  const items: { type: 'foto' | 'video'; data: typeof FOTOS[0] | typeof VIDEOS[0] }[] = [
    { type: 'foto', data: FOTOS[0] },
    { type: 'foto', data: FOTOS[1] },
    { type: 'video', data: VIDEOS[0] },
    { type: 'foto', data: FOTOS[2] },
    { type: 'foto', data: FOTOS[3] },
    { type: 'video', data: VIDEOS[1] },
    { type: 'foto', data: FOTOS[4] },
    { type: 'video', data: VIDEOS[2] },
    { type: 'foto', data: FOTOS[5] },
    { type: 'foto', data: FOTOS[6] },
    { type: 'video', data: VIDEOS[3] },
  ]

  return (
    <div className="mt-12 md:mt-20">
      <h2 className="font-display text-2xl md:text-3xl font-semibold mb-2 text-center">Quem usa, aprova</h2>
      <p className="text-muted-foreground text-center mb-8 text-sm">Profissionais de todo o Brasil escolhem Jaleca</p>
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
        {items.map((item, i) =>
          item.type === 'video' ? (
            <VideoItem key={i} {...(item.data as typeof VIDEOS[0])} />
          ) : (
            <div key={i} className="relative aspect-square overflow-hidden rounded-lg bg-muted">
              <img
                src={(item.data as typeof FOTOS[0]).src}
                alt={(item.data as typeof FOTOS[0]).alt}
                loading="lazy"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          )
        )}
      </div>
    </div>
  )
}

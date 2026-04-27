'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import { X, Search, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { trackSearch } from '@/components/Analytics'
import type { SearchIndexEntry } from '@/app/api/search/index/route'

type Props = {
  isOpen: boolean
  onClose: () => void
}

let cachedIndex: SearchIndexEntry[] | null = null
let inflight: Promise<SearchIndexEntry[]> | null = null

function loadIndex(): Promise<SearchIndexEntry[]> {
  if (cachedIndex) return Promise.resolve(cachedIndex)
  if (inflight) return inflight
  inflight = fetch('/api/search/index')
    .then(r => r.json())
    .then((d: { entries: SearchIndexEntry[] }) => {
      cachedIndex = d.entries
      return cachedIndex
    })
    .catch(() => {
      inflight = null
      return [] as SearchIndexEntry[]
    })
  return inflight
}

function normalize(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState<SearchIndexEntry[] | null>(cachedIndex)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const trackedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    if (!isOpen) return
    setQuery('')
    setTimeout(() => inputRef.current?.focus(), 50)
    if (!cachedIndex) {
      setLoading(true)
      loadIndex().then(d => {
        setIndex(d)
        setLoading(false)
      })
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  const results = useMemo(() => {
    if (!index || query.length < 2) return []
    const nq = normalize(query)
    const tokens = nq.split(/\s+/).filter(Boolean)
    return index
      .filter(e => {
        const n = normalize(e.name)
        return tokens.every(t => n.includes(t))
      })
      .slice(0, 12)
  }, [index, query])

  useEffect(() => {
    if (query.length >= 2 && results.length > 0 && !trackedRef.current.has(query)) {
      trackedRef.current.add(query)
      trackSearch(query)
    }
  }, [query, results.length])

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose()
  }

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm flex items-start justify-center pt-[124px] px-4 animate-fade-in"
      aria-hidden="true"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Buscar produtos"
        className="bg-background w-full max-w-lg shadow-2xl border border-border"
        aria-hidden="false"
      >
        <div className="flex items-center px-4 py-3 border-b border-border gap-3">
          <Search size={18} className="text-muted-foreground flex-shrink-0" aria-hidden="true" />
          <label htmlFor="search-modal-input" className="sr-only">Buscar produtos</label>
          <input
            id="search-modal-input"
            ref={inputRef}
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar produtos..."
            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
            autoComplete="off"
          />
          {loading && <Loader2 size={16} className="animate-spin text-muted-foreground flex-shrink-0" />}
          <button
            onClick={onClose}
            className="p-1 text-muted-foreground hover:text-foreground transition-colors active:scale-95 flex-shrink-0"
            aria-label="Fechar busca"
          >
            <X size={18} />
          </button>
        </div>

        {query.length >= 2 && (
          <div className="max-h-[400px] overflow-y-auto">
            {results.length === 0 && !loading ? (
              <div className="px-4 py-8 text-center text-sm text-muted-foreground">
                Nenhum produto encontrado para &ldquo;{query}&rdquo;
              </div>
            ) : (
              <div>
                {results.map(product => (
                  <Link
                    key={product.id}
                    href={product.href}
                    onClick={onClose}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-secondary/30 transition-colors border-b border-border last:border-0"
                  >
                    <div className="w-14 h-16 flex-shrink-0 bg-secondary/20 overflow-hidden">
                      {product.image?.sourceUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.image.sourceUrl}
                          alt={product.image.altText || product.name}
                          width={56}
                          height={64}
                          loading="lazy"
                          decoding="async"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {product.name}
                      </p>
                      {product.price && (
                        <p className="text-sm text-muted-foreground mt-0.5">{product.price}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}

        {query.length < 2 && query.length > 0 && (
          <div className="px-4 py-6 text-center text-sm text-muted-foreground">
            Continue digitando para buscar...
          </div>
        )}

        {query.length === 0 && (
          <div className="px-4 py-5">
            <p className="text-xs font-semibold tracking-wider uppercase text-muted-foreground mb-3">Buscas populares</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: 'Jaleco feminino', href: '/categoria/jalecos-femininos' },
                { label: 'Jaleco masculino', href: '/categoria/jalecos-masculinos' },
                { label: 'Jaleco branco', href: '/jaleco-branco' },
                { label: 'Jaleco preto', href: '/jaleco-preto' },
                { label: 'Conjuntos', href: '/categoria/conjuntos' },
                { label: 'Mais vendidos', href: '/produtos?sort=mais-vendidos' },
              ].map(item => (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={onClose}
                  className="px-3 py-1.5 text-sm border border-border rounded-full text-foreground hover:bg-secondary/30 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </div>
            <p className="text-sm text-muted-foreground mt-4 text-center">ou digite para buscar</p>
          </div>
        )}
      </div>
    </div>
  )
}

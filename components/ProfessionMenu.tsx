'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Briefcase, X } from 'lucide-react'
import Link from 'next/link'
import { PROFESSION_MAP } from '@/lib/product-professions'

/**
 * Menu dropdown "Buscar por Profissão"
 * Desktop: megamenu com grid de profissões
 * Mobile: drawer com busca
 */
export default function ProfessionMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const menuRef = useRef<HTMLDivElement>(null)

  // Fecha ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  // Escuta evento da BottomNavBar (mobile)
  useEffect(() => {
    function handleOpenFromBottomNav() {
      setIsOpen(true)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('jaleca-open-profession-menu', handleOpenFromBottomNav)
      return () => window.removeEventListener('jaleca-open-profession-menu', handleOpenFromBottomNav)
    }
  }, [])

  // Agrupa profissões por área
  const professionsByArea = {
    saude: [
      'medica', 'medico', 'dentista', 'enfermeira', 'enfermeiro',
      'farmaceutica', 'farmaceutico', 'nutricionista', 'fisioterapeuta',
      'veterinaria', 'veterinario', 'biomedica', 'biomedico'
    ],
    beleza: [
      'esteticista', 'nail design', 'micropigmentadora', 'massagista',
      'podologo', 'podologa', 'tatuador', 'cabeleireira', 'cabeleireiro', 'barbeiro'
    ],
    saude_mental: ['psicologa'],
    educacao: ['professor', 'professora', 'aluno', 'universitario', 'estudante'],
    gastronomia: [
      'cozinheiro', 'cozinheira', 'churrasqueiro', 'churrasqueira',
      'sushiman', 'confeiteira', 'confeiteiro', 'buffet'
    ],
    outros: [
      'advogada', 'advogado', 'pastor', 'secretaria',
      'secretaria do lar', 'dona-de-casa'
    ],
  }

  // Profissões de saúde que aparecem primeiro no mobile
  const PRIORITY_KEYS = [
    'medica', 'medico', 'odontologia', 'dentista', 'dentista-feminino',
    'enfermagem', 'enfermeira', 'enfermeiro', 'farmaceutica', 'farmaceutico',
    'nutricionista', 'fisioterapeuta', 'biomedica', 'biomedico',
  ]

  const allProfessionsAlpha = Object.entries(PROFESSION_MAP)
    .filter(([key, info]) => info.hub)
    .sort((a, b) => a[1].label.localeCompare(b[1].label))

  const allProfessions = [
    ...PRIORITY_KEYS.map(k => [k, PROFESSION_MAP[k]] as [string, typeof PROFESSION_MAP[string]]).filter(([, info]) => info?.hub),
    ...allProfessionsAlpha.filter(([key]) => !PRIORITY_KEYS.includes(key)),
  ]

  const filteredProfessions = searchTerm
    ? allProfessionsAlpha.filter(([_, info]) =>
        info.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : allProfessions

  return (
    <div ref={menuRef} className="relative">
      {/* Botão Desktop */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="hidden md:flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium text-foreground/80 hover:text-foreground transition-colors"
      >
        <Briefcase size={16} />
        Profissões
        <ChevronDown
          size={14}
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Dropdown / Drawer */}
      {isOpen && (
        <>
          {/* Desktop: Megamenu */}
          <div className="hidden md:block absolute top-full left-0 mt-2 w-[600px] bg-white border border-border rounded-lg shadow-xl z-50">
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Buscar profissão..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
              </div>
            </div>

            {/* Grid de Profissões */}
            <div className="p-4 max-h-[400px] overflow-y-auto">
              {searchTerm ? (
                // Resultado da busca
                <div className="grid grid-cols-3 gap-2">
                  {filteredProfessions.map(([key, info]) => (
                    <Link
                      key={key}
                      href={info.hub}
                      onClick={() => setIsOpen(false)}
                      className="px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                    >
                      {info.label}
                    </Link>
                  ))}
                  {filteredProfessions.length === 0 && (
                    <p className="col-span-3 text-sm text-muted-foreground text-center py-8">
                      Nenhuma profissão encontrada
                    </p>
                  )}
                </div>
              ) : (
                // Agrupado por área
                <div className="space-y-4">
                  {/* Saúde */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Saúde
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {professionsByArea.saude.map((key) => {
                        const info = PROFESSION_MAP[key]
                        if (!info?.hub) return null
                        return (
                          <Link
                            key={key}
                            href={info.hub}
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                          >
                            {info.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  {/* Beleza & Estética */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Beleza & Estética
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {professionsByArea.beleza.map((key) => {
                        const info = PROFESSION_MAP[key]
                        if (!info?.hub) return null
                        return (
                          <Link
                            key={key}
                            href={info.hub}
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                          >
                            {info.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  {/* Gastronomia */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Gastronomia
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {professionsByArea.gastronomia.map((key) => {
                        const info = PROFESSION_MAP[key]
                        if (!info?.hub) return null
                        return (
                          <Link
                            key={key}
                            href={info.hub}
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                          >
                            {info.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>

                  {/* Outros */}
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Outras Áreas
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {[...professionsByArea.educacao, ...professionsByArea.saude_mental, ...professionsByArea.outros].map((key) => {
                        const info = PROFESSION_MAP[key]
                        if (!info?.hub) return null
                        return (
                          <Link
                            key={key}
                            href={info.hub}
                            onClick={() => setIsOpen(false)}
                            className="px-3 py-2 text-sm text-foreground/80 hover:text-foreground hover:bg-muted/50 rounded-md transition-colors"
                          >
                            {info.label}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile: Modal fullscreen */}
          <div className="md:hidden fixed inset-0 z-[300] bg-black/50" onClick={() => setIsOpen(false)} aria-hidden="true" />
          <div className="md:hidden fixed inset-x-0 top-0 bottom-14 z-[301] bg-background flex flex-col" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
            <div className="flex items-center justify-between px-4 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Briefcase size={18} className="text-foreground" />
                <span className="text-sm font-semibold tracking-wide uppercase text-foreground">Buscar por Profissão</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Fechar"
                className="p-2 text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="text"
                  placeholder="Buscar profissão..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-base border border-border rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="grid grid-cols-2 gap-2">
                {filteredProfessions.map(([key, info]) => (
                  <Link
                    key={key}
                    href={info.hub}
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-3 text-sm text-foreground bg-muted/30 hover:bg-muted/60 active:scale-95 rounded-md transition-all text-center"
                  >
                    {info.label}
                  </Link>
                ))}
                {filteredProfessions.length === 0 && (
                  <p className="col-span-2 text-sm text-muted-foreground text-center py-8">
                    Nenhuma profissão encontrada
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

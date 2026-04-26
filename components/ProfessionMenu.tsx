'use client'

import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, Briefcase } from 'lucide-react'
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

  // Filtra profissões por busca
  const allProfessions = Object.entries(PROFESSION_MAP)
    .filter(([key, info]) => info.hub) // Só profissões com hub
    .sort((a, b) => a[1].label.localeCompare(b[1].label))

  const filteredProfessions = searchTerm
    ? allProfessions.filter(([_, info]) =>
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

      {/* Botão Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden flex items-center gap-2 w-full py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors duration-150"
      >
        <Briefcase size={18} />
        Buscar por Profissão
        <ChevronDown
          size={16}
          className={`ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`}
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

          {/* Mobile: Lista simples */}
          <div className="md:hidden bg-white/5 border-t border-white/10">
            <div className="p-4 space-y-2">
              {/* Search */}
              <div className="relative mb-3">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  placeholder="Buscar profissão..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm border border-white/20 rounded-md bg-white/10 text-white placeholder:text-white/40"
                />
              </div>

              {/* Lista */}
              <div className="space-y-1 max-h-[300px] overflow-y-auto">
                {filteredProfessions.map(([key, info]) => (
                  <Link
                    key={key}
                    href={info.hub}
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/10 rounded-md transition-colors"
                  >
                    {info.label}
                  </Link>
                ))}
                {filteredProfessions.length === 0 && (
                  <p className="text-sm text-white/40 text-center py-8">
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

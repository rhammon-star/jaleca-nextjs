'use client'

import { useState } from 'react'
import ProfissionaisCarousel from '@/components/UGCSection'
import ClientesUGC from './UGCSection'

type Tab = 'profissionais' | 'clientes'

export default function ProductSocialProof() {
  const [tab, setTab] = useState<Tab>('profissionais')

  return (
    <section className="mt-12 md:mt-16 border-t border-border pt-10 md:pt-12">
      <div className="mb-6 flex justify-center">
        <div role="tablist" aria-label="Prova social" className="inline-flex gap-1 border-b border-border">
          {([
            { id: 'profissionais', label: 'Profissionais de todo o Brasil' },
            { id: 'clientes', label: 'Clientes usando Jaleca' },
          ] as { id: Tab; label: string }[]).map(t => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`px-4 md:px-6 py-3 text-[11px] md:text-[12px] font-semibold tracking-[0.18em] uppercase transition-all duration-200 border-b-2 -mb-px whitespace-nowrap ${
                tab === t.id
                  ? 'border-foreground text-foreground'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel">
        {tab === 'profissionais' && <ProfissionaisCarousel />}
        {tab === 'clientes' && <ClientesUGC />}
      </div>
    </section>
  )
}

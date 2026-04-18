'use client'

import { useState, useEffect } from 'react'
import { Loader2, Truck } from 'lucide-react'

export type ShippingOption = {
  id: string
  label: string
  cost: number
  delivery_time: string
}

type Props = {
  onShippingSelected: (shipping: ShippingOption) => void
  selectedId?: string
  initialCep?: string
  onCepCalculated?: (cep: string, state?: string) => void
  subtotal?: number
  itemCount?: number
}

function formatCEP(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 8)
  if (digits.length > 5) return `${digits.slice(0, 5)}-${digits.slice(5)}`
  return digits
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function ShippingCalculator({ onShippingSelected, selectedId, initialCep, onCepCalculated, subtotal = 0, itemCount = 1 }: Props) {
  const [cep, setCep] = useState(initialCep ? formatCEP(initialCep) : '')
  const [options, setOptions] = useState<ShippingOption[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [calculated, setCalculated] = useState(false)

  // Auto-calculate if initialCep is provided
  useEffect(() => {
    if (initialCep && initialCep.replace(/\D/g, '').length === 8) {
      calculate(initialCep.replace(/\D/g, ''))
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Recalculate when quantity or subtotal changes (only if already calculated)
  useEffect(() => {
    if (!calculated) return
    const clean = cep.replace(/\D/g, '')
    if (clean.length !== 8) return
    calculate(clean)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemCount, subtotal])

  async function calculate(clean: string) {
    setError('')
    setLoading(true)
    setOptions([])
    setCalculated(false)
    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cep: clean, subtotal, items: itemCount }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Erro ao calcular frete')
        return
      }
      setOptions(data.options)
      setCalculated(true)
      onCepCalculated?.(clean, data.address?.state)
    } catch {
      setError('Erro ao calcular frete. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  function handleCalculateClick() {
    const clean = cep.replace(/\D/g, '')
    if (clean.length !== 8) {
      setError('Digite um CEP válido')
      return
    }
    calculate(clean)
  }

  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
        <Truck size={13} />
        Calcular Frete
      </p>
      <div className="flex gap-2">
        <label htmlFor="shipping-cep-input" className="sr-only">CEP para calcular frete</label>
        <input
          id="shipping-cep-input"
          type="text"
          value={cep}
          onChange={e => setCep(formatCEP(e.target.value))}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); handleCalculateClick() } }}
          placeholder="00000-000"
          maxLength={9}
          autoComplete="postal-code"
          className="flex-1 border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground transition-colors"
        />
        <button
          type="button"
          onClick={handleCalculateClick}
          disabled={loading}
          aria-label="Calcular frete"
          className="px-4 py-2 bg-ink text-background text-[16px] md:text-xs font-semibold tracking-widest uppercase hover:bg-ink/90 active:scale-95 transition-all disabled:opacity-60 flex items-center gap-1.5 min-h-[44px]"
        >
          {loading ? <Loader2 size={12} className="animate-spin" aria-hidden="true" /> : 'OK'}
        </button>
      </div>

      {error && <p className="text-xs text-red-600" role="alert" aria-live="polite">{error}</p>}

      {calculated && options.length > 0 && (
        <div className="space-y-2">
          {options.map(opt => (
            <label
              key={opt.id}
              className={`flex items-center justify-between px-3 py-2.5 border cursor-pointer transition-colors ${
                selectedId === opt.id
                  ? 'border-foreground bg-secondary/20'
                  : 'border-border hover:border-foreground/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  name="shipping"
                  value={opt.id}
                  checked={selectedId === opt.id}
                  onChange={() => onShippingSelected(opt)}
                  className="accent-foreground"
                />
                <div>
                  <p className="text-xs font-medium text-foreground">{opt.label}</p>
                  <p className="text-[13px] md:text-[11px] text-muted-foreground">{opt.delivery_time}</p>
                </div>
              </div>
              <span className="text-xs font-semibold text-foreground">
                {opt.cost === 0 ? 'Grátis' : formatCurrency(opt.cost)}
              </span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

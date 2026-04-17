'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { X, ShoppingBag, Trash2, Plus, Minus, Tag, Loader2, Clock, Truck, Percent, ArrowRight } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import ShippingCalculator, { type ShippingOption } from '@/components/ShippingCalculator'
import Link from 'next/link'
import { trackInitiateCheckout } from '@/components/Analytics'

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^0-9,]/g, '').replace(',', '.')) || 0
}

function formatCurrency(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, closeCart, appliedCoupon, setAppliedCoupon } = useCart()
  const pathname = usePathname()

  const [couponCode, setCouponCode] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)
  const [selectedShipping, setSelectedShipping] = useState<ShippingOption | null>(null)

  // Close cart when navigating to a different page
  useEffect(() => {
    closeCart()
  }, [pathname]) // eslint-disable-line react-hooks/exhaustive-deps

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  const FREE_SHIPPING_THRESHOLD = 499
  const FREE_SHIPPING_STATES = ['SP', 'RJ', 'ES', 'MG']

  const [customerState, setCustomerState] = useState<string>('')

  // Load saved CEP and state from localStorage
  useEffect(() => {
    try {
      const savedCep = localStorage.getItem('jaleca-checkout-cep')
      const savedState = localStorage.getItem('jaleca-checkout-state')
      if (savedState) setCustomerState(savedState)
      else if (savedCep) {
        // Fallback: try to get state via ViaCEP if only CEP is saved
        fetch(`https://viacep.com.br/ws/${savedCep}/json/`).then(r => r.json()).then(data => {
          if (data.uf) {
            setCustomerState(data.uf)
            localStorage.setItem('jaleca-checkout-state', data.uf)
          }
        }).catch(() => {})
      }
    } catch {}
  }, [])

  const subtotal = items.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0)

  function calcDiscount(): number {
    if (!appliedCoupon) return 0
    if (appliedCoupon.discount_type === 'percent') {
      return subtotal * (parseFloat(appliedCoupon.amount) / 100)
    }
    return parseFloat(appliedCoupon.amount) || 0
  }

  const discount = calcDiscount()
  const shippingCost = selectedShipping?.cost ?? 0
  const total = Math.max(0, subtotal - discount + shippingCost)

  async function handleApplyCoupon() {
    if (!couponCode.trim()) return
    setCouponError('')
    setCouponLoading(true)
    try {
      const res = await fetch('/api/coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode.trim() }),
      })
      const data = await res.json()
      if (!res.ok || !data.valid) {
        setCouponError(data.error || 'Cupom inválido')
        return
      }
      const minAmount = parseFloat(data.minimum_amount || '0')
      if (minAmount > 0 && subtotal < minAmount) {
        setCouponError(`Pedido mínimo para este cupom: R$${minAmount.toFixed(2).replace('.', ',')}`)
        return
      }
      setAppliedCoupon({ code: data.code, discount_type: data.discount_type, amount: data.amount })
      setCouponCode('')
    } catch {
      setCouponError('Erro ao validar cupom')
    } finally {
      setCouponLoading(false)
    }
  }

  function handleRemoveCoupon() {
    setAppliedCoupon(null)
    setCouponError('')
  }

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Sacola de compras"
        className={`fixed top-0 right-0 z-50 h-full bg-background flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: 'min(420px, 100vw)' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <div className="flex items-center gap-2">
            <ShoppingBag size={18} />
            <span className="font-display text-lg font-semibold">Sacola</span>
            {totalItems > 0 && (
              <span
                className="w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
                aria-live="polite"
                aria-atomic="true"
                aria-label={`${totalItems} ${totalItems === 1 ? 'item' : 'itens'} na sacola`}
              >
                {totalItems}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-3 md:p-2 text-muted-foreground hover:text-foreground transition-colors active:scale-95"
            aria-label="Fechar sacola"
          >
            <X size={20} />
          </button>
        </div>


        {/* Expiration banner */}
        {items.some(i => i.addedAt && Date.now() - i.addedAt > 48 * 60 * 60 * 1000) && (
          <div className="flex items-start gap-2 px-6 py-3 bg-amber-50 border-b border-amber-200 text-amber-800">
            <Clock size={13} className="mt-0.5 flex-shrink-0" />
            <p className="text-[13px] md:text-[11px] leading-snug">
              Alguns itens foram adicionados há mais de 48h. Confirme a disponibilidade.
            </p>
          </div>
        )}

        {/* Scrollable area: items + footer */}
        <div className="flex-1 overflow-y-auto">

        {/* Items */}
        <div className="px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center gap-4">
              <ShoppingBag size={40} className="text-muted-foreground/40" />
              <p className="text-muted-foreground text-sm">Sua sacola está vazia</p>
              <div className="space-y-3 w-full px-4">
                <p className="text-[13px] md:text-[11px] text-muted-foreground">Veja algumas sugestões:</p>
                <Link
                  href="/produtos"
                  className="flex items-center justify-center gap-2 w-full border border-border py-3 text-xs font-semibold tracking-wide uppercase hover:bg-muted transition-colors"
                >
                  Ver produtos <ArrowRight size={13} />
                </Link>
                <Link
                  href="/produtos?cat=Jalecos"
                  className="flex items-center justify-center gap-2 w-full border border-border py-3 text-xs font-semibold tracking-wide uppercase hover:bg-muted transition-colors"
                >
                  Jalecos femininos
                </Link>
                <Link
                  href="/produtos?cat=Conjuntos"
                  className="flex items-center justify-center gap-2 w-full border border-border py-3 text-xs font-semibold tracking-wide uppercase hover:bg-muted transition-colors"
                >
                  Conjuntos
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {items.map((item) => (
                <div key={`${item.id}-${item.size}-${item.color}`} className="flex gap-4">
                  {/* Image */}
                  <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-secondary/20">
                    {item.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground leading-tight mb-1 truncate">
                      {item.name}
                    </h4>
                    <div className="flex gap-2 mb-2">
                      {item.color && (
                        <span className="text-[13px] md:text-[11px] text-muted-foreground">{item.color}</span>
                      )}
                      {item.size && (
                        <span className="text-[13px] md:text-[11px] text-muted-foreground uppercase">{item.size}</span>
                      )}
                    </div>
                    <p className="text-sm font-semibold mb-1">{item.price}</p>
                    {item.addedAt && Date.now() - item.addedAt > 48 * 60 * 60 * 1000 && (
                      <p className="text-[12px] md:text-[10px] text-amber-600 font-medium flex items-center gap-1 mb-2">
                        <Clock size={10} />
                        Disponibilidade não garantida
                      </p>
                    )}

                    {/* Quantity + Remove */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
                          className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Diminuir"
                        >
                          <Minus size={13} />
                        </button>
                        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          className="w-11 h-11 md:w-10 md:h-10 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                          aria-label="Aumentar"
                        >
                          <Plus size={13} />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id, item.size, item.color)}
                        className="p-2.5 md:p-1.5 min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                        aria-label="Remover"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {/* end items */}

        {/* Footer — inside scrollable area */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-border space-y-4">
            {/* Coupon */}
            <div className="space-y-2">
              <p className="text-xs font-semibold tracking-widest uppercase text-muted-foreground flex items-center gap-1.5">
                <Tag size={12} />
                Cupom de Desconto
              </p>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-green-50 border border-green-200 px-3 py-2">
                  <span className="text-xs text-green-700 font-medium uppercase">{appliedCoupon.code}</span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="min-h-[44px] min-w-[44px] md:min-h-0 md:min-w-0 flex items-center justify-center text-green-600 hover:text-green-800 transition-colors"
                    aria-label="Remover cupom"
                  >
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <label htmlFor="cart-coupon-input" className="sr-only">Código do cupom</label>
                  <input
                    id="cart-coupon-input"
                    type="text"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="CÓDIGO"
                    className="flex-1 border border-border bg-background px-3 py-2 text-xs focus:outline-none focus:border-foreground transition-colors uppercase"
                    onKeyDown={e => { if (e.key === 'Enter') handleApplyCoupon() }}
                  />
                  <button
                    onClick={handleApplyCoupon}
                    disabled={couponLoading || !couponCode.trim()}
                    className="px-3 py-3 md:py-2 border border-border text-xs font-semibold hover:bg-secondary/30 transition-colors disabled:opacity-50 flex items-center gap-1"
                  >
                    {couponLoading ? <Loader2 size={12} className="animate-spin" /> : 'Aplicar'}
                  </button>
                </div>
              )}
              {couponError && <p className="text-xs text-red-600">{couponError}</p>}
              {!appliedCoupon && !couponError && (
                <p className="text-[13px] md:text-[11px] text-muted-foreground">
                  Primeira compra?{' '}
                  <button
                    type="button"
                    onClick={() => setCouponCode('PRIMEIRACOMPRA5JALECA')}
                    className="underline underline-offset-2 hover:text-foreground transition-colors font-medium"
                  >
                    Use PRIMEIRACOMPRA5JALECA
                  </button>
                </p>
              )}
            </div>

            {/* Shipping calculator */}
            <ShippingCalculator
              onShippingSelected={opt => {
                setSelectedShipping(opt)
                try { localStorage.setItem('jaleca-selected-shipping', JSON.stringify(opt)) } catch {}
              }}
              selectedId={selectedShipping?.id}
              subtotal={subtotal}
              itemCount={totalItems}
              onCepCalculated={(cep, state) => {
                try {
                  localStorage.setItem('jaleca-checkout-cep', cep)
                  if (state) {
                    localStorage.setItem('jaleca-checkout-state', state)
                    setCustomerState(state)
                  }
                } catch {}
              }}
            />

            {/* Free shipping progress bar — only for SP, RJ, ES, MG */}
            {subtotal > 0 && customerState && !FREE_SHIPPING_STATES.includes(customerState) && (
              <div className="bg-muted/50 border border-border p-3 text-center">
                <p className="text-[13px] md:text-[11px] text-muted-foreground">
                  <Truck size={11} className="inline mr-1" />
                  Frete grátis para compras acima de <strong className="text-foreground">{formatCurrency(FREE_SHIPPING_THRESHOLD)}</strong> nas regiões SP, RJ, ES e MG
                </p>
              </div>
            )}
            {subtotal > 0 && (!customerState || FREE_SHIPPING_STATES.includes(customerState)) && subtotal < FREE_SHIPPING_THRESHOLD && (
              <div className="bg-muted/50 border border-border p-3 text-center">
                <p className="text-[13px] md:text-[11px] text-muted-foreground mb-1.5">
                  <Truck size={11} className="inline mr-1" />
                  Faltam <strong className="text-foreground">{formatCurrency(FREE_SHIPPING_THRESHOLD - subtotal)}</strong> para <strong className="text-green-600">frete grátis!</strong>
                </p>
                <div className="h-1.5 bg-border rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((subtotal / FREE_SHIPPING_THRESHOLD) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            {subtotal > 0 && (!customerState || FREE_SHIPPING_STATES.includes(customerState)) && subtotal >= FREE_SHIPPING_THRESHOLD && (
              <div className="bg-green-50 border border-green-200 p-3 text-center flex items-center justify-center gap-2">
                <Truck size={13} className="text-green-600" />
                <p className="text-xs text-green-700 font-semibold">Você ganhou frete grátis!</p>
              </div>
            )}

            {/* PIX discount badge */}
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-2">
              <Percent size={13} className="text-green-600 shrink-0" />
              <p className="text-xs text-green-700 font-medium">
                Pague via PIX e ganhe <strong>5% de desconto</strong>!
              </p>
            </div>

            {/* Price summary */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {appliedCoupon && discount > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">Desconto ({appliedCoupon.code})</span>
                  <span className="text-green-600">- {formatCurrency(discount)}</span>
                </div>
              )}
              {selectedShipping && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{selectedShipping.label}</span>
                  <span>{shippingCost === 0 ? 'Grátis' : formatCurrency(shippingCost)}</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-1.5 border-t border-border">
                <span className="text-sm font-semibold">Total</span>
                <span className="text-lg font-semibold">{formatCurrency(total)}</span>
              </div>
            </div>

          </div>
        )}
        </div>
        {/* end scrollable area */}

        {/* Sticky footer — always visible */}
        {items.length > 0 && (
          <div className="flex-shrink-0 px-6 pb-6 pt-3 border-t border-border bg-background space-y-2">
            <Link
              href="/finalizar-compra"
              onClick={() => {
                trackInitiateCheckout(total, items.length)
                closeCart()
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-ink text-background py-4 text-xs font-semibold tracking-widest uppercase transition-all hover:bg-ink/90 active:scale-[0.98]"
            >
              <ShoppingBag size={16} />
              Finalizar Compra
            </Link>
            <button
              onClick={closeCart}
              className="w-full inline-flex items-center justify-center gap-2 border border-border py-3 text-xs font-semibold tracking-widest uppercase transition-all hover:bg-secondary/30 active:scale-[0.98]"
            >
              Continuar Comprando
            </button>
            <button
              onClick={clearCart}
              className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4 text-center"
            >
              Limpar sacola
            </button>
          </div>
        )}
      </div>
    </>
  )
}

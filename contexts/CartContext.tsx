'use client'

import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { trackAddToCart } from '@/components/Analytics'

export type CouponData = {
  code: string
  discount_type: string
  amount: string
}

export type CartItem = {
  id: string
  databaseId: number
  variationId?: number
  slug: string
  name: string
  image?: string
  price: string
  size?: string
  color?: string
  quantity: number
  addedAt: number
}

type CartContextType = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity' | 'addedAt'>) => void
  removeItem: (id: string, size?: string, color?: string) => void
  updateQuantity: (id: string, size: string | undefined, color: string | undefined, quantity: number) => void
  clearCart: () => void
  totalItems: number
  totalPrice: string
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  appliedCoupon: CouponData | null
  setAppliedCoupon: (coupon: CouponData | null) => void
}

const CartContext = createContext<CartContextType | null>(null)

function parsePrice(price: string): number {
  return parseFloat(price.replace(/[^0-9,]/g, '').replace(',', '.')) || 0
}

function formatPrice(value: number): string {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function itemKey(id: string, size?: string, color?: string) {
  return `${id}__${size ?? ''}__${color ?? ''}`
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [appliedCoupon, setAppliedCouponState] = useState<CouponData | null>(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem('jaleca-cart')
      if (saved) setItems(JSON.parse(saved))
      const savedCoupon = localStorage.getItem('jaleca-coupon')
      if (savedCoupon) setAppliedCouponState(JSON.parse(savedCoupon))
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem('jaleca-cart', JSON.stringify(items))
  }, [items])

  const setAppliedCoupon = useCallback((coupon: CouponData | null) => {
    setAppliedCouponState(coupon)
    if (coupon) {
      localStorage.setItem('jaleca-coupon', JSON.stringify(coupon))
    } else {
      localStorage.removeItem('jaleca-coupon')
    }
  }, [])

  const addItem = useCallback((newItem: Omit<CartItem, 'quantity' | 'addedAt'>) => {
    setItems(prev => {
      const key = itemKey(newItem.id, newItem.size, newItem.color)
      const exists = prev.find(i => itemKey(i.id, i.size, i.color) === key)
      if (exists) {
        return prev.map(i =>
          itemKey(i.id, i.size, i.color) === key
            ? { ...i, quantity: i.quantity + 1 }
            : i
        )
      }
      return [...prev, { ...newItem, quantity: 1, addedAt: Date.now() }]
    })
    setIsOpen(true)
    // Analytics browser (GA4 + Meta Pixel)
    trackAddToCart({ id: newItem.id, name: newItem.name, price: newItem.price, quantity: 1 })
    // CAPI server-side (Meta)
    const price = parsePrice(newItem.price)
    if (price > 0) {
      fetch('/api/events/add-to-cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: newItem.databaseId ?? newItem.id, name: newItem.name, value: price, quantity: 1 }),
      }).catch(() => {})
    }
  }, [])

  const removeItem = useCallback((id: string, size?: string, color?: string) => {
    const key = itemKey(id, size, color)
    setItems(prev => prev.filter(i => itemKey(i.id, i.size, i.color) !== key))
  }, [])

  const updateQuantity = useCallback((id: string, size: string | undefined, color: string | undefined, quantity: number) => {
    const key = itemKey(id, size, color)
    if (quantity <= 0) {
      setItems(prev => prev.filter(i => itemKey(i.id, i.size, i.color) !== key))
    } else {
      setItems(prev =>
        prev.map(i => itemKey(i.id, i.size, i.color) === key ? { ...i, quantity } : i)
      )
    }
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    setAppliedCoupon(null)
  }, [setAppliedCoupon])
  const openCart = useCallback(() => setIsOpen(true), [])
  const closeCart = useCallback(() => setIsOpen(false), [])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = formatPrice(
    items.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0)
  )

  return (
    <CartContext.Provider value={{
      items, addItem, removeItem, updateQuantity, clearCart,
      totalItems, totalPrice, isOpen, openCart, closeCart,
      appliedCoupon, setAppliedCoupon,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}

'use client'

/**
 * Meta Checkout Landing Page
 *
 * Chamada pelo endpoint /api/meta-checkout quando há múltiplos produtos.
 * Pré-popula o carrinho via localStorage e redireciona para /finalizar-compra.
 *
 * URL: /meta-checkout?products=ID1:QTY1,ID2:QTY2
 */

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const WC_URL = process.env.NEXT_PUBLIC_WC_URL ?? 'https://wp.jaleca.com.br'

type CartItem = {
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

async function fetchProduct(productId: string): Promise<CartItem | null> {
  try {
    const res = await fetch(`/api/wc-product?id=${productId}`)
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function MetaCheckoutInner() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const productsParam = searchParams.get('products')
    if (!productsParam) {
      router.replace('/produtos')
      return
    }

    const entries = productsParam.split(',').map(e => {
      const [id, qty] = e.split(':')
      return { id: id?.trim(), qty: parseInt(qty?.trim() || '1', 10) || 1 }
    }).filter(e => e.id)

    if (entries.length === 0) {
      router.replace('/produtos')
      return
    }

    // Produto único → vai direto para a página do produto
    if (entries.length === 1) {
      router.replace(`/api/meta-checkout?products=${productsParam}`)
      return
    }

    // Múltiplos: busca dados e popula carrinho
    async function populateCart() {
      const cartItems: CartItem[] = []

      for (const entry of entries) {
        const item = await fetchProduct(entry.id)
        if (item) {
          cartItems.push({ ...item, quantity: entry.qty, addedAt: Date.now() })
        }
      }

      if (cartItems.length > 0) {
        // Merge com carrinho existente
        let existing: CartItem[] = []
        try {
          const saved = localStorage.getItem('jaleca-cart')
          if (saved) existing = JSON.parse(saved)
        } catch {}

        // Adiciona novos itens (sem duplicar)
        for (const newItem of cartItems) {
          const idx = existing.findIndex(i => i.id === newItem.id)
          if (idx >= 0) {
            existing[idx].quantity += newItem.quantity
          } else {
            existing.push(newItem)
          }
        }
        localStorage.setItem('jaleca-cart', JSON.stringify(existing))
      }

      router.replace('/finalizar-compra')
    }

    populateCart()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-500 text-sm">Preparando seu carrinho...</p>
    </div>
  )
}

export default function MetaCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-sm">Carregando...</p>
      </div>
    }>
      <MetaCheckoutInner />
    </Suspense>
  )
}

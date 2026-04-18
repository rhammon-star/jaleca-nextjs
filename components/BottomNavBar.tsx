'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, LayoutGrid, Search, ShoppingBag, User } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'

const HIDDEN_PATHS = ['/checkout', '/finalizar-compra', '/pagamento']

export default function BottomNavBar() {
  const pathname = usePathname()
  const { totalItems, openCart } = useCart()

  if (HIDDEN_PATHS.some(p => pathname?.startsWith(p))) return null

  function openSearch() {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('jaleca-open-search'))
    }
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background border-t border-border"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navegação principal"
    >
      <div className="flex items-stretch h-14">
        <Link
          href="/"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors active:scale-95"
          aria-label="Início"
        >
          <Home size={20} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>

        <Link
          href="/produtos"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors active:scale-95"
          aria-label="Produtos"
        >
          <LayoutGrid size={20} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">Produtos</span>
        </Link>

        <button
          onClick={openSearch}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors active:scale-95"
          aria-label="Buscar"
        >
          <Search size={20} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">Busca</span>
        </button>

        <button
          onClick={openCart}
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors active:scale-95 relative"
          aria-label={`Sacola${totalItems > 0 ? ` — ${totalItems} ${totalItems === 1 ? 'item' : 'itens'}` : ''}`}
        >
          <span className="relative">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-ink text-background text-[9px] font-bold rounded-full flex items-center justify-center leading-none">
                {totalItems > 9 ? '9+' : totalItems}
              </span>
            )}
          </span>
          <span className="text-[10px] font-medium">Sacola</span>
        </button>

        <Link
          href="/minha-conta"
          className="flex-1 flex flex-col items-center justify-center gap-0.5 text-muted-foreground hover:text-foreground transition-colors active:scale-95"
          aria-label="Minha conta"
        >
          <User size={20} strokeWidth={1.5} />
          <span className="text-[10px] font-medium">Conta</span>
        </Link>
      </div>
    </nav>
  )
}

'use client'

import { useState } from "react";
import Link from "next/link";
import { Search, ShoppingBag, Heart, Menu, X, User, ChevronDown } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import SearchModal from "@/components/SearchModal";
import AuthModal from "@/components/AuthModal";
import LoyaltyBadge from "@/components/LoyaltyBadge";
import AnnouncementBar from "@/components/AnnouncementBar";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { totalItems, openCart } = useCart();
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="relative z-50">
      <AnnouncementBar />
      <header className="sticky top-0 z-[100] bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="container">
          {/* Inner row: logo | nav (centered) | icons — inline styles guarantee 1 row */}
          <div style={{ display: 'flex', alignItems: 'center', height: '116px' }}>

            {/* LEFT — logo + mobile hamburger */}
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: '8px' }}>
              <button
                className="md:hidden p-2 active:scale-95 transition-transform"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label={mobileOpen ? 'Fechar menu' : 'Abrir menu'}
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav"
              >
                {mobileOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
              </button>
              <Link href="/" className="flex items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/logo.svg"
                  alt="Jaleca"
                  style={{ height: '110px', width: 'auto', display: 'block' }}
                />
              </Link>
            </div>

            {/* CENTER — desktop nav, fills remaining space, links centered */}
            <nav
              className="hidden md:flex"
              aria-label="Navegação principal"
              style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: '20px' }}
            >
              {/* Nav link styles */}
              <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-[12px] font-semibold tracking-widest uppercase whitespace-nowrap">
                Início
              </Link>
              <Link href="/loja-matriz" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-[12px] font-semibold tracking-widest uppercase whitespace-nowrap">
                Loja
              </Link>

              {/* Jalecos dropdown */}
              <div className="relative group/nav" style={{ display: 'flex', alignItems: 'center' }}>
                <Link href="/produtos?cat=Jalecos" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-[12px] font-semibold tracking-widest uppercase whitespace-nowrap flex items-center gap-1 py-5">
                  Jalecos
                  <ChevronDown size={11} className="transition-transform duration-200 group-hover/nav:rotate-180" />
                </Link>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover/nav:opacity-100 group-hover/nav:visible transition-all duration-200 z-50">
                  <div className="bg-background border border-border shadow-xl p-5 w-52">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">Jalecos</p>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Todos os Jalecos', href: '/produtos?cat=Jalecos' },
                        { label: 'Jalecos Femininos', href: '/produtos?cat=Jalecos&genero=feminino' },
                        { label: 'Jalecos Masculinos', href: '/produtos?cat=Jalecos&genero=masculino' },
                        { label: 'Jalecos Brancos', href: '/produtos?cat=Jalecos&cor=branco' },
                        { label: 'Jalecos Coloridos', href: '/produtos?cat=Jalecos&cor=colorido' },
                        { label: 'Promoções', href: '/produtos?cat=Jalecos&sale=true' },
                      ].map(item => (
                        <Link key={item.href} href={item.href} className="block text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-150">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dômãs dropdown */}
              <div className="relative group/nav2" style={{ display: 'flex', alignItems: 'center' }}>
                <Link href="/produtos?cat=Dômãs" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-[12px] font-semibold tracking-widest uppercase whitespace-nowrap flex items-center gap-1 py-5">
                  Dômãs
                  <ChevronDown size={11} className="transition-transform duration-200 group-hover/nav2:rotate-180" />
                </Link>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover/nav2:opacity-100 group-hover/nav2:visible transition-all duration-200 z-50">
                  <div className="bg-background border border-border shadow-xl p-5 w-52">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">Dômãs</p>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Todas as Dômãs', href: '/produtos?cat=Dômãs' },
                        { label: 'Dômãs Femininas', href: '/produtos?cat=Dômãs&genero=feminino' },
                        { label: 'Dômãs Masculinas', href: '/produtos?cat=Dômãs&genero=masculino' },
                        { label: 'Promoções', href: '/produtos?cat=Dômãs&sale=true' },
                      ].map(item => (
                        <Link key={item.href} href={item.href} className="block text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-150">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Conjuntos dropdown */}
              <div className="relative group/nav3" style={{ display: 'flex', alignItems: 'center' }}>
                <Link href="/produtos?cat=Conjuntos" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-[12px] font-semibold tracking-widest uppercase whitespace-nowrap flex items-center gap-1 py-5">
                  Conjuntos
                  <ChevronDown size={11} className="transition-transform duration-200 group-hover/nav3:rotate-180" />
                </Link>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover/nav3:opacity-100 group-hover/nav3:visible transition-all duration-200 z-50">
                  <div className="bg-background border border-border shadow-xl p-5 w-52">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">Conjuntos</p>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Todos os Conjuntos', href: '/produtos?cat=Conjuntos' },
                        { label: 'Conjuntos Femininos', href: '/produtos?cat=Conjuntos&genero=feminino' },
                        { label: 'Conjuntos Masculinos', href: '/produtos?cat=Conjuntos&genero=masculino' },
                        { label: 'Promoções', href: '/produtos?cat=Conjuntos&sale=true' },
                      ].map(item => (
                        <Link key={item.href} href={item.href} className="block text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all duration-150">
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-[12px] font-semibold tracking-widest uppercase whitespace-nowrap">
                Blog
              </Link>
              <Link href="/lookbook" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-[12px] font-semibold tracking-widest uppercase whitespace-nowrap">
                Lookbook
              </Link>
            </nav>

            {/* RIGHT — icons (marginLeft: auto pushes to right on mobile when nav is hidden) */}
            <div style={{ display: 'flex', alignItems: 'center', flexShrink: 0, gap: '2px', marginLeft: 'auto' }}>
              <LoyaltyBadge />
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                aria-label="Buscar"
              >
                <Search size={19} />
              </button>
              <Link
                href="/wishlist"
                className="flex p-2 text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                aria-label="Favoritos"
              >
                <Heart size={19} />
              </Link>
              {isLoggedIn ? (
                <Link
                  href="/minha-conta"
                  className="flex items-center gap-1.5 p-2 text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                  aria-label="Minha conta"
                >
                  <User size={19} />
                  <span className="hidden lg:block text-[11px] font-semibold tracking-wide max-w-[100px] truncate">
                    Olá, {user?.name?.split(' ')[0]}
                  </span>
                </Link>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="p-2 text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                  aria-label="Entrar"
                >
                  <User size={19} />
                </button>
              )}
              <button
                onClick={openCart}
                className="relative p-2 text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                aria-label="Carrinho"
              >
                <ShoppingBag size={19} />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center"
                    aria-live="polite"
                    aria-atomic="true"
                    aria-label={`${totalItems} ${totalItems === 1 ? 'item' : 'itens'} no carrinho`}
                  >
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <nav id="mobile-nav" className="md:hidden border-t border-border bg-background animate-fade-in" aria-label="Navegação mobile">
            <div className="container py-5 flex flex-col gap-1 text-sm font-medium tracking-wide uppercase">
              {[
                { label: 'Início', href: '/' },
                { label: 'Loja', href: '/produtos' },
                { label: 'Jalecos', href: '/produtos?cat=Jalecos' },
                { label: 'Dômãs', href: '/produtos?cat=Dômãs' },
                { label: 'Conjuntos', href: '/produtos?cat=Conjuntos' },
                { label: 'Blog', href: '/blog' },
                { label: 'Lookbook', href: '/lookbook' },
                { label: 'Nossa Loja Física', href: '/loja-matriz' },
                { label: 'Favoritos', href: '/wishlist' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3 border-b border-border/50 text-foreground last:border-0"
                >
                  {item.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <Link href="/minha-conta" onClick={() => setMobileOpen(false)} className="py-3 text-foreground">
                  Minha Conta
                </Link>
              ) : (
                <button
                  onClick={() => { setMobileOpen(false); setAuthOpen(true) }}
                  className="py-3 text-foreground text-left"
                >
                  Entrar / Cadastrar
                </button>
              )}
            </div>
          </nav>
        )}
      </header>

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default Header;

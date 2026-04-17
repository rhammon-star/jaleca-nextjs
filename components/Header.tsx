'use client'

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();

  // Auto-abre login quando redirecionado de minha-conta sem sessão
  useEffect(() => {
    if (!isLoggedIn && typeof window !== 'undefined' && sessionStorage.getItem('jaleca-open-login') === '1') {
      sessionStorage.removeItem('jaleca-open-login')
      setAuthOpen(true)
    }
  }, [isLoggedIn]);

  // Fecha o menu ao navegar para outra página
  useEffect(() => { setMobileOpen(false) }, [pathname]);

  // Bloqueia scroll do body quando menu aberto (fix iOS Safari: overflow:hidden não funciona)
  useEffect(() => {
    if (mobileOpen) {
      const scrollY = window.scrollY
      document.body.style.position = 'fixed'
      document.body.style.top = `-${scrollY}px`
      document.body.style.width = '100%'
    } else {
      const top = document.body.style.top
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
      if (top) window.scrollTo(0, -parseInt(top || '0'))
    }
    return () => {
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.width = ''
    }
  }, [mobileOpen]);

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
                className="md:hidden p-3 active:scale-95 transition-transform"
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
                  width={220}
                  height={110}
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
              <Link href="/nossas-lojas" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-[12px] font-semibold tracking-widest uppercase whitespace-nowrap">
                Nossas Lojas
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

              {/* Dólmãs dropdown */}
              <div className="relative group/nav2" style={{ display: 'flex', alignItems: 'center' }}>
                <Link href="/produtos?cat=Dólmãs" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-[12px] font-semibold tracking-widest uppercase whitespace-nowrap flex items-center gap-1 py-5">
                  Dólmãs
                  <ChevronDown size={11} className="transition-transform duration-200 group-hover/nav2:rotate-180" />
                </Link>
                <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover/nav2:opacity-100 group-hover/nav2:visible transition-all duration-200 z-50">
                  <div className="bg-background border border-border shadow-xl p-5 w-52">
                    <p className="text-[10px] font-semibold tracking-widest uppercase text-muted-foreground mb-3">Dólmãs</p>
                    <div className="space-y-2.5">
                      {[
                        { label: 'Todas as Dólmãs', href: '/produtos?cat=Dólmãs' },
                        { label: 'Dólmãs Femininas', href: '/produtos?cat=Dólmãs&genero=feminino' },
                        { label: 'Dólmãs Masculinas', href: '/produtos?cat=Dólmãs&genero=masculino' },
                        { label: 'Promoções', href: '/produtos?cat=Dólmãs&sale=true' },
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

              <Link href="/produtos?sort=mais-vendidos" className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-[12px] font-semibold tracking-widest uppercase whitespace-nowrap relative">
                Mais Vendidos
                <span className="absolute -top-2 -right-3 bg-[#c4a97d] text-white text-[8px] font-bold px-1 py-0.5 leading-none tracking-wide">TOP</span>
              </Link>
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
                className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                aria-label="Buscar"
              >
                <Search size={19} />
              </button>
              <Link
                href="/wishlist"
                className="flex p-3 min-h-[44px] min-w-[44px] items-center justify-center text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                aria-label="Favoritos"
              >
                <Heart size={19} />
              </Link>
              {isLoggedIn ? (
                <Link
                  href="/minha-conta"
                  className="flex items-center gap-1.5 p-3 min-h-[44px] min-w-[44px] text-muted-foreground hover:text-foreground transition-colors active:scale-95"
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
                  className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors active:scale-95"
                  aria-label="Entrar"
                >
                  <User size={19} />
                </button>
              )}
              <button
                onClick={openCart}
                className="relative p-3 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors active:scale-95"
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

      </header>

      {/* Mobile nav — fora do <header sticky> para evitar bug de fixed dentro de sticky no iOS Safari */}
      {mobileOpen && (
        <>
          {/* Backdrop com blur */}
          <div
            className="fixed inset-0 z-[150] bg-black/50 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
          />
          {/* Drawer */}
          <nav
            id="mobile-nav"
            className="fixed top-0 left-0 h-full w-[80vw] max-w-[300px] z-[200] bg-[#1a1a1a] shadow-2xl md:hidden flex flex-col animate-fade-in"
            aria-label="Navegação mobile"
          >
            {/* Header do drawer — só a flor */}
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
              <img src="/icon-flower.png" alt="Jaleca" style={{ height: '40px', width: '40px', objectFit: 'contain' }} />
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Fechar menu"
                className="p-2 text-white/60 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            {/* Links */}
            <div className="flex-1 overflow-y-auto px-5 py-3 flex flex-col">
              {[
                { label: 'Início', href: '/' },
                { label: 'Loja', href: '/produtos' },
                { label: 'Jalecos', href: '/produtos?cat=Jalecos' },
                { label: 'Dólmãs', href: '/produtos?cat=Dólmãs' },
                { label: 'Conjuntos', href: '/produtos?cat=Conjuntos' },
                { label: 'Mais Vendidos', href: '/produtos?sort=mais-vendidos' },
                { label: 'Blog', href: '/blog' },
                { label: 'Lookbook', href: '/lookbook' },
                { label: 'Nossas Lojas', href: '/nossas-lojas' },
                { label: 'Favoritos', href: '/wishlist' },
              ].map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="py-3.5 border-b border-white/10 text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70 hover:text-white last:border-0 transition-colors duration-150"
                >
                  {item.label}
                </Link>
              ))}
              {isLoggedIn ? (
                <Link
                  href="/minha-conta"
                  onClick={() => setMobileOpen(false)}
                  className="py-3.5 border-b border-white/10 text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70 hover:text-white transition-colors duration-150"
                >
                  Minha Conta
                </Link>
              ) : (
                <button
                  onClick={() => { setAuthOpen(true); setMobileOpen(false) }}
                  className="py-3.5 border-b border-white/10 text-[11px] font-semibold tracking-[0.2em] uppercase text-white/70 hover:text-white text-left transition-colors duration-150"
                >
                  Entrar / Cadastrar
                </button>
              )}
            </div>
            {/* Rodapé do drawer */}
            <div className="px-5 py-4 border-t border-white/10">
              <p className="text-[10px] text-white/30 tracking-widest uppercase">Jaleca — Jalecos e mimos.</p>
            </div>
          </nav>
        </>
      )}

      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
      <AuthModal isOpen={authOpen} onClose={() => setAuthOpen(false)} />
    </div>
  );
};

export default Header;

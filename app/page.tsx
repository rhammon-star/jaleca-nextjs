import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Sparkles, Ruler, Truck, CreditCard, RotateCcw, ShieldCheck, Lock, Percent } from "lucide-react";
import TrustBadgeBar from "@/components/TrustBadgeBar";
import GoogleReviewsServer from "@/components/GoogleReviewsServer";
import { getGooglePlaceData } from "@/lib/google-places";
import { GET_PRODUCTS } from "@/lib/graphql";
import { Suspense } from "react";
import ProductCard, { type WooProduct } from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import CategoryCard from "@/components/CategoryCard";
import { isBestSeller } from "@/lib/best-sellers";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Jalecos Femininos e Masculinos — Mais de 200 Mil Peças Vendidas",
  description: "Compre jalecos femininos, masculinos, slim, princesa e universitários. PP ao G3, frete grátis Sudeste acima de R$499. Jalecos para médicos, dentistas, enfermeiros. Mais de 200 mil peças vendidas.",
  alternates: { canonical: "https://jaleca.com.br" },
  openGraph: {
    title: "Jalecos Femininos e Masculinos — Jaleca",
    description: "Compre jalecos femininos, masculinos, slim, princesa e universitários. Frete grátis no Sudeste. Jalecos para médicos, dentistas e profissionais da saúde.",
    url: "https://jaleca.com.br",
    siteName: "Jaleca",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://jaleca.com.br/og-home.jpg", width: 1200, height: 630, alt: "Jaleca — Jalecos e Uniformes Profissionais" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jalecos Femininos e Masculinos — Jaleca",
    description: "Compre jalecos femininos, masculinos, slim, princesa e universitários. Frete grátis no Sudeste.",
    images: ["https://jaleca.com.br/og-home.jpg"],
  },
};

const GET_FEATURED_PRODUCTS = `
  query GetFeaturedProducts {
    products(first: 8, where: { featured: true, status: "publish" }) {
      nodes {
        id
        databaseId
        name
        slug
        productCategories {
          nodes { name slug }
        }
        ... on SimpleProduct {
          price regularPrice salePrice stockStatus
          image { sourceUrl altText }
          attributes { nodes { name options } }
        }
        ... on VariableProduct {
          price regularPrice salePrice
          image { sourceUrl altText }
          attributes { nodes { name options } }
          variations(first: 20) {
            nodes {
              regularPrice
              salePrice
            }
          }
        }
      }
    }
  }
`

function sortBestSellersFirst(products: WooProduct[]): WooProduct[] {
  return [...products].sort((a, b) => {
    const aBS = isBestSeller(a.slug) ? 0 : 1
    const bBS = isBestSeller(b.slug) ? 0 : 1
    return aBS - bBS
  })
}

async function fetchGraphQL<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const endpoint = process.env.NEXT_PUBLIC_WOOCOMMERCE_GRAPHQL_URL!
  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 3600 },
  })
  const json = await res.json()
  return json.data as T
}

async function getFeaturedProducts(): Promise<WooProduct[]> {
  try {
    const data = await fetchGraphQL<{ products: { nodes: WooProduct[] } }>(GET_FEATURED_PRODUCTS)
    if (!data.products.nodes.length) {
      const fallback = await fetchGraphQL<{ products: { nodes: WooProduct[] } }>(GET_PRODUCTS, { first: 8 })
      return sortBestSellersFirst(fallback.products.nodes)
    }
    return sortBestSellersFirst(data.products.nodes)
  } catch {
    return []
  }
}

export default async function Home() {
  // googlePlace é buscado apenas para o schema JSON-LD (rating/reviewCount)
  // O componente de reviews é carregado via Suspense streaming para não bloquear o HTML inicial
  // Force rebuild 2026-04-24
  const [products, googlePlace] = await Promise.all([
    getFeaturedProducts(),
    getGooglePlaceData(),
  ]);

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': 'https://jaleca.com.br/#localbusiness',
    name: 'Jaleca — Jalecos e Uniformes Profissionais',
    image: ['https://jaleca.com.br/og-home.jpg', 'https://jaleca.com.br/logo.svg'],
    description: 'Loja de jalecos e uniformes profissionais para médicos, enfermeiros, dentistas e profissionais da saúde. Loja física em Ipatinga, MG e e-commerce para todo o Brasil com frete grátis no Sudeste.',
    url: 'https://jaleca.com.br',
    telephone: '+55-31-3367-2467',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Ipatinga',
      addressRegion: 'MG',
      addressCountry: 'BR',
    },
    openingHoursSpecification: [
      { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '09:00', closes: '18:00' },
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '12:00' },
    ],
    priceRange: '$$',
    hasMap: 'https://maps.google.com/?q=Jaleca+Ipatinga+MG',
    parentOrganization: { '@id': 'https://jaleca.com.br/#organization' },
    sameAs: [
      'https://www.instagram.com/jaleca.oficial',
      'https://www.facebook.com/jalecaoficial',
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(googlePlace?.rating ?? '4.9'),
      reviewCount: googlePlace?.reviewCount ?? 58,
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd).replace(/</g, '\\u003c') }}
    />
    <main className="bg-background">
      <TrustBadgeBar />
      {/* Hero — editorial luxury split */}
      <section className="relative w-full overflow-hidden bg-[#faf9f7]">
        <div className="flex flex-col md:flex-row">

          {/* LEFT — editorial text panel */}
          <div className="relative z-10 flex flex-col justify-center w-full md:w-[42%] px-8 md:pl-16 lg:pl-20 md:pr-6 py-20 md:py-0">
            {/* Badge de autoridade */}
            <div className="inline-flex items-center gap-2 bg-[#1a1a1a] text-[#c4a97d] px-4 py-2 mb-6 self-start">
              <span className="text-sm">🏆</span>
              <span className="text-[12px] md:text-[10px] font-semibold tracking-[0.2em] md:tracking-[0.3em] uppercase">Uma das marcas que mais vende jalecos no Brasil</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold leading-[1.1] text-[#1a1a1a] mb-5 animate-fade-up">
              Jalecos femininos, masculinos e slim — mais de 200 mil peças vendidas.
            </h1>
            <p className="text-[#555] text-base leading-relaxed mb-6">
              Antes de você falar, sua imagem já foi avaliada. Conforto, caimento impecável e a presença que eleva sua autoridade profissional.
            </p>
            {/* Prova social — nota Google real */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-[#e8e0d5]">
              <div className="flex text-[#c4a97d] text-lg leading-none">★★★★★</div>
              <p className="text-[15px] md:text-[13px] text-[#555]">
                <span className="font-semibold text-[#1a1a1a]">{googlePlace?.rating ?? '4.9'}/5 no Google</span> — clientes satisfeitos em todo o Brasil
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/produtos"
                className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-6 py-3 text-[11px] font-semibold tracking-widest uppercase transition-all duration-300 hover:bg-[#333] active:scale-[0.97]"
              >
                Ver Coleção
                <ArrowRight size={13} />
              </Link>
              <Link
                href="/produtos?novidades=true"
                className="inline-flex items-center gap-2 border border-[#c4a97d] text-[#c4a97d] px-6 py-3 text-[11px] font-semibold tracking-widest uppercase transition-all duration-300 hover:bg-[#c4a97d] hover:text-white active:scale-[0.97]"
              >
                Novidades 2026
              </Link>
            </div>
          </div>

          {/* RIGHT — photo panel */}
          <div className="relative w-full md:w-[58%] bg-[#e4e4e4]">
            <picture>
              <source media="(max-width: 767px)" srcSet="/jaleco-hero-mobile.webp" type="image/webp" />
              <source media="(min-width: 768px)" srcSet="/jaleco-hero-desktop.webp" type="image/webp" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/jaleco-hero-v3.jpg"
                alt="Profissional de saúde usando jaleco feminino premium Jaleca coleção 2026"
                className="w-full h-auto block"
                width={3155}
                height={3871}
                fetchPriority="high"
                loading="eager"
                decoding="async"
                sizes="(max-width: 767px) 100vw, 58vw"
              />
            </picture>
            {/* Gradiente editorial suave */}
            <div className="absolute inset-0 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to right, #faf9f7 0%, #faf9f7 30%, rgba(250,249,247,0) 44%)' }}
            />
          </div>

        </div>
      </section>

      {/* Quick category shortcuts — mobile only, scroll horizontal pills */}
      <section className="md:hidden py-3 bg-background">
        <div className="flex gap-2 overflow-x-auto px-4 scrollbar-hide" style={{ WebkitOverflowScrolling: 'touch' }}>
          {[
            { label: 'Jalecos', href: '/categoria/jalecos' },
            { label: 'Jalecos Femininos', href: '/categoria/jalecos-femininos' },
            { label: 'Conjuntos', href: '/categoria/conjuntos' },
            { label: 'Mais Vendidos', href: '/produtos?sort=mais-vendidos' },
            { label: 'Jalecos Masculinos', href: '/categoria/jalecos-masculinos' },
            { label: 'Acessórios', href: '/categoria/acessorios' },
          ].map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="flex-shrink-0 px-4 py-2 border border-border rounded-full text-[13px] font-medium text-foreground hover:bg-secondary/20 hover:border-foreground/40 transition-all active:scale-[0.97] whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Category editorial banners */}
      <section className="py-8 md:py-12 bg-background">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                title: 'Jalecos',
                subtitle: 'Coleção 2026',
                href: '/categoria/jalecos',
                bg: 'bg-[#f0ede8]',
                accent: 'text-[#5a4a3a]',
                video: '/video-jalecos-opt.mp4',
              },
              {
                title: 'Conjuntos',
                subtitle: 'Conforto & Estilo',
                href: '/produtos?cat=Conjuntos',
                bg: 'bg-[#e8edf0]',
                accent: 'text-[#3a4a5a]',
                video: '/video-conjuntos-opt.mp4',
              },
              {
                title: 'Dólmãs',
                subtitle: 'Conforto no trabalho',
                href: '/produtos?cat=Dólmãs',
                bg: 'bg-[#edf0e8]',
                accent: 'text-[#3a5a3a]',
                video: '/video-domas-opt.mp4',
              },
            ].map(cat => (
              <CategoryCard key={cat.title} {...cat} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured products */}
      <ScrollReveal>
        <section className="py-20 md:py-28 bg-card">
          <div className="container">
            <div className="flex items-end justify-between mb-12">
              <div>
                <h2 className="font-display text-3xl md:text-4xl font-semibold mb-2">Em Destaque</h2>
                <p className="text-muted-foreground">Os favoritos dos nossos clientes</p>
              </div>
              <Link href="/produtos" className="hidden sm:inline-flex items-center gap-1 text-sm font-medium text-primary-text hover:underline underline-offset-4">
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((p, i) => (
                <ScrollReveal key={p.id} delay={i * 80}>
                  <ProductCard product={p} />
                </ScrollReveal>
              ))}
            </div>
            <div className="sm:hidden mt-8 text-center">
              <Link href="/produtos" className="inline-flex items-center gap-1 text-sm font-medium text-primary-text hover:underline underline-offset-4">
                Ver todos <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Virtual try-on — hidden on mobile (saves 250px, CTA misleading) */}
      <ScrollReveal>
        <section className="hidden md:block py-20 md:py-24">
          <div className="container">
            <div className="px-6 py-12 text-center md:px-12 md:py-16">
              <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 text-balance">Experimente Antes de Comprar</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8 text-pretty leading-relaxed">
                Veja como o jaleco fica em você com nossa tecnologia de prova virtual
              </p>
              <Button asChild size="lg" className="rounded-none border border-secondary bg-[hsl(var(--warm-surface))] px-7 py-3.5 text-sm font-semibold tracking-wide uppercase text-ink transition-colors duration-200 hover:bg-secondary/20 hover:text-ink active:scale-[0.97]">
                <Link href="/produtos">
                  Experimentar Agora
                  <ArrowRight size={16} />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Differentials */}
      <ScrollReveal>
        <section className="py-20 md:py-28">
          <div className="container">
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-center mb-16">Por Que Jaleca?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Ruler, title: "Tamanhos para Todos", desc: "Do PP ao G3, com tabela de medidas por modelo para garantir o tamanho certo.", showMobile: true },
                { icon: Shield, title: "Garantia de Qualidade", desc: "Cada peça passa por rigoroso controle de qualidade.", showMobile: true },
                { icon: Sparkles, title: "Tecidos Premium", desc: "Materiais anti-microbianos com stretch e conforto térmico.", showMobile: false },
                { icon: Sparkles, title: "Estilo e Elegância", desc: "Jalecos que combinam funcionalidade profissional com design moderno.", showMobile: false },
              ].map((d, i) => (
                <ScrollReveal key={d.title} delay={i * 100}>
                  <div className={`text-center ${d.showMobile === false ? 'hidden sm:block' : ''}`}>
                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <d.icon size={22} className="text-primary" />
                    </div>
                    <h3 className="font-display text-lg font-semibold mb-2">{d.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px] mx-auto">{d.desc}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Trust badges */}
      <section className="py-12 border-y border-border bg-muted/20">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: Truck, title: 'Frete Grátis no Sudeste', desc: 'SP · RJ · MG · ES acima de R$499' },
              { icon: Percent, title: '5% de Desconto no PIX', desc: 'Aprovação imediata' },
              { icon: RotateCcw, title: '7 Dias para Troca', desc: 'Direito de arrependimento' },
              { icon: ShieldCheck, title: 'Compra Segura', desc: 'Seus dados protegidos' },
            ].map((badge, i) => (
              <div key={badge.title} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <badge.icon size={18} className="text-primary" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{badge.title}</p>
                  <p className="text-[13px] md:text-[11px] text-muted-foreground">{badge.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <ScrollReveal>
        <section className="py-20 md:py-28 bg-card">
          <div className="container">
            <div className="text-center mb-12">
              <p className="text-[13px] md:text-[11px] font-semibold tracking-[0.2em] md:tracking-[0.3em] uppercase text-muted-foreground mb-3">Depoimentos</p>
              <h2 className="font-display text-3xl md:text-4xl font-semibold">O que dizem nossos clientes</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  name: 'Dra. Ana Carolina',
                  role: 'Médica — São Paulo, SP',
                  text: 'O caimento é impecável e o tecido é extremamente confortável para longas jornadas. Meu jaleco Jaleca é o mais elogiado da clínica!',
                  stars: 5,
                },
                {
                  name: 'Enf. Patricia Mendes',
                  role: 'Enfermeira — Belo Horizonte, MG',
                  text: 'Finalmente um uniforme que une elegância e praticidade. As cores são lindas e o material não amassa durante o plantão.',
                  stars: 5,
                },
                {
                  name: 'Dr. Felipe Souza',
                  role: 'Cirurgião — Rio de Janeiro, RJ',
                  text: 'Comprei o scrub e fiquei impressionado com a qualidade. Entrega rápida, produto exatamente como descrito. Já estou na terceira compra!',
                  stars: 5,
                },
              ].map((t, i) => (
                <ScrollReveal key={t.name} delay={i * 100}>
                  <div className="bg-background border border-border p-7 flex flex-col gap-4">
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.stars }).map((_, j) => (
                        <span key={j} className="text-amber-400 text-sm">★</span>
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.text}"</p>
                    <div className="mt-auto pt-4 border-t border-border">
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-[13px] md:text-[11px] text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* Google Reviews — carregado via Suspense streaming para não inflar o HTML inicial */}
      <Suspense fallback={<div className="py-16 bg-[#faf9f7] border-t border-border" aria-hidden="true" />}>
        <GoogleReviewsServer />
      </Suspense>

      {/* CTA */}
      <ScrollReveal>
        <section className="border-b border-[#E5E5E5] bg-background py-20 text-ink md:py-28">
          <div className="container text-center max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 text-balance">
              Pronto para elevar seu padrão profissional?
            </h2>
            <p className="mb-8 max-w-md mx-auto text-muted-foreground">
              Junte-se a milhares de profissionais da saúde que já descobriram a Jaleca.
            </p>
            <Link
              href="/produtos"
              className="inline-flex items-center gap-2 rounded-none border border-ink bg-ink px-7 py-3.5 text-sm font-semibold tracking-wide uppercase text-background transition-colors duration-200 hover:bg-ink/90 active:scale-[0.97]"
            >
              Comprar Agora
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </ScrollReveal>
    </main>
    </>
  );
}

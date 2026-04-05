import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Sparkles, Ruler, Truck, CreditCard, RotateCcw, ShieldCheck, Lock, Percent } from "lucide-react";
import { graphqlClient, GET_PRODUCTS } from "@/lib/graphql";
import ProductCard, { type WooProduct } from "@/components/ProductCard";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Jaleca — Jalecos Femininos e Masculinos para Profissionais da Saúde",
  description: "Jalecos femininos e masculinos modernos para profissionais da saúde. Elegância clínica, qualidade premium e entrega rápida para todo o Brasil.",
  alternates: { canonical: "https://jaleca.com.br" },
  openGraph: {
    title: "Jaleca — Jalecos Femininos e Masculinos",
    description: "Jalecos femininos e masculinos modernos para profissionais da saúde. Qualidade premium e entrega rápida.",
    url: "https://jaleca.com.br",
    siteName: "Jaleca",
    locale: "pt_BR",
    type: "website",
    images: [{ url: "https://jaleca.com.br/og-home.jpg", width: 1200, height: 630, alt: "Jaleca — Jalecos Femininos e Masculinos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaleca — Jalecos Femininos e Masculinos",
    description: "Jalecos femininos e masculinos modernos para profissionais da saúde. Qualidade premium e entrega rápida.",
    images: ["https://jaleca.com.br/og-home.jpg"],
  },
};

async function getFeaturedProducts(): Promise<WooProduct[]> {
  try {
    const data = await graphqlClient.request<{ products: { nodes: WooProduct[] } }>(
      GET_PRODUCTS, { first: 8 }
    );
    return data.products.nodes;
  } catch {
    return [];
  }
}

export default async function Home() {
  const products = await getFeaturedProducts();

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Jaleca',
    url: 'https://jaleca.com.br',
    logo: 'https://jaleca.com.br/logo.svg',
    description: 'Jalecos e uniformes profissionais para profissionais da saúde.',
    sameAs: [
      'https://www.instagram.com/jaleca.com.br',
    ],
  };

  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ClothingStore',
    '@id': 'https://jaleca.com.br/#localbusiness',
    name: 'Jaleca — Jalecos e Mimos',
    image: 'https://jaleca.com.br/logo.svg',
    description: 'Loja de jalecos e uniformes profissionais para médicos, enfermeiros, dentistas e profissionais da saúde. Loja física em Ipatinga, MG e loja online para todo o Brasil.',
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
      { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '13:00' },
    ],
    priceRange: '$$',
    servesCuisine: undefined,
    hasMap: 'https://maps.google.com/?q=Ipatinga,MG,Brasil',
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Jaleca',
    url: 'https://jaleca.com.br',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://jaleca.com.br/produtos?busca={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c'),
      }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(localBusinessJsonLd).replace(/</g, '\\u003c'),
      }}
    />
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c'),
      }}
    />
    <main className="bg-background">
      {/* Hero — editorial luxury split */}
      <section className="relative w-full overflow-hidden bg-[#faf9f7]">
        <div className="flex flex-col md:flex-row">

          {/* LEFT — editorial text panel */}
          <div className="relative z-10 flex flex-col justify-center w-full md:w-[42%] px-8 md:pl-16 lg:pl-20 md:pr-6 py-20 md:py-0">
            {/* Badge de autoridade */}
            <div className="inline-flex items-center gap-2 bg-[#1a1a1a] text-[#c4a97d] px-4 py-2 mb-6 self-start">
              <span className="text-sm">🏆</span>
              <span className="text-[10px] font-semibold tracking-[0.3em] uppercase">Uma das marcas que mais vende jalecos no Brasil</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem] font-semibold leading-[1.1] text-[#1a1a1a] mb-5 animate-fade-up">
              Mais de 200 mil peças vendidas. Descubra o porquê.
            </h1>
            <p className="text-[#555] text-base leading-relaxed mb-6">
              Conforto, caimento impecável e a confiança que você transmite no seu dia a dia.
            </p>
            {/* Prova social */}
            <div className="flex items-center gap-3 mb-8 pb-8 border-b border-[#e8e0d5]">
              <div className="flex text-[#c4a97d] text-lg leading-none">★★★★★</div>
              <p className="text-[13px] text-[#555]">
                <span className="font-semibold text-[#1a1a1a]">Milhares de clientes satisfeitos</span> em todo o Brasil
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
              />
            </picture>
            {/* Gradiente editorial suave */}
            <div className="absolute inset-0 z-10 pointer-events-none"
              style={{ background: 'linear-gradient(to right, #faf9f7 0%, #faf9f7 30%, rgba(250,249,247,0) 44%)' }}
            />
          </div>

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
                href: '/produtos?cat=Jalecos',
                bg: 'bg-[#f0ede8]',
                accent: 'text-[#5a4a3a]',
              },
              {
                title: 'Scrubs',
                subtitle: 'Conforto & Estilo',
                href: '/produtos?cat=Scrubs',
                bg: 'bg-[#e8edf0]',
                accent: 'text-[#3a4a5a]',
              },
              {
                title: 'Novidades',
                subtitle: 'Recém chegadas',
                href: '/produtos?novidades=true',
                bg: 'bg-[#edf0e8]',
                accent: 'text-[#3a5a3a]',
              },
            ].map(cat => (
              <Link
                key={cat.title}
                href={cat.href}
                className={`group relative overflow-hidden ${cat.bg} aspect-[4/3] md:aspect-[3/4] flex flex-col justify-end p-6 md:p-8`}
              >
                <div className="translate-y-2 group-hover:translate-y-0 transition-transform duration-400">
                  <p className={`text-[10px] font-semibold tracking-[0.3em] uppercase ${cat.accent} mb-1 opacity-70`}>
                    {cat.subtitle}
                  </p>
                  <h3 className={`font-display text-2xl md:text-3xl font-semibold ${cat.accent} mb-3`}>
                    {cat.title}
                  </h3>
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest uppercase ${cat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                    Explorar →
                  </span>
                </div>
                {/* Overlay shine */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300" />
              </Link>
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

      {/* Virtual try-on */}
      <ScrollReveal>
        <section className="py-20 md:py-24">
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
                { icon: Sparkles, title: "Tecidos Premium", desc: "Materiais anti-microbianos com stretch e conforto térmico." },
                { icon: Ruler, title: "Tamanhos para Todos", desc: "Do PP ao G3, com tabela de medidas por modelo para garantir o tamanho certo." },
                { icon: Sparkles, title: "Estilo e Elegância", desc: "Jalecos que combinam funcionalidade profissional com design moderno." },
                { icon: Shield, title: "Garantia de Qualidade", desc: "Cada peça passa por rigoroso controle de qualidade." },
              ].map((d, i) => (
                <ScrollReveal key={d.title} delay={i * 100}>
                  <div className="text-center">
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
              { icon: Truck, title: 'Frete para Todo Brasil', desc: 'Entrega em 5 a 15 dias úteis' },
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
                  <p className="text-[11px] text-muted-foreground">{badge.desc}</p>
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
              <p className="text-[11px] font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-3">Depoimentos</p>
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
                      <p className="text-[11px] text-muted-foreground">{t.role}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

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

import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import BackButton from "@/components/BackButton";
import { CartProvider } from "@/contexts/CartContext"
import { AuthProvider } from "@/contexts/AuthContext"
import { WishlistProvider } from "@/contexts/WishlistContext"
import { CompareProvider } from "@/contexts/CompareContext";
import WhatsAppButton from "@/components/WhatsAppButton";
import FirstPurchasePopup from "@/components/FirstPurchasePopup";
import Analytics from "@/components/Analytics";
import CartRecoveryCapture from "@/components/CartRecoveryCapture";
import CompareBar from "@/components/CompareBar";
import TawkToChat from "@/components/TawkToChat";
import BackToTop from "@/components/BackToTop";
import CookieConsent from "@/components/CookieConsent";
import Script from "next/script";
import FranqueadoBanner from "@/components/FranqueadoBanner";
import GoogleMerchantBadge from "@/components/GoogleMerchantBadge";
import { SpeedInsights } from "@vercel/speed-insights/next";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Jaleca — Jalecos Femininos e Masculinos para Profissionais da Saúde",
    template: "%s | Jaleca",
  },
  description: "Jalecos femininos e masculinos modernos para profissionais da saúde. Elegância clínica, qualidade premium e entrega rápida para todo o Brasil.",
  keywords: "jaleco feminino, jaleco masculino, jaleco médico, jaleco enfermagem, scrub médico, uniforme profissional saúde",
  metadataBase: new URL("https://jaleca.com.br"),
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
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

const organizationJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': 'https://jaleca.com.br/#organization',
  name: 'Jaleca',
  legalName: 'Jaleca Uniformes Profissionais',
  url: 'https://jaleca.com.br',
  logo: {
    '@type': 'ImageObject',
    url: 'https://jaleca.com.br/logo.svg',
    width: 200,
    height: 60,
  },
  image: 'https://jaleca.com.br/og-home.jpg',
  description: 'Jalecos femininos e masculinos premium para profissionais da saúde. Médicas, dentistas, enfermeiras e farmacêuticas encontram na Jaleca uniformes modernos, elegantes e de alta qualidade com entrega rápida para todo o Brasil.',
  foundingDate: '2020',
  address: {
    '@type': 'PostalAddress',
    addressCountry: 'BR',
    addressRegion: 'MG',
    addressLocality: 'Belo Horizonte',
  },
  contactPoint: [
    {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'Portuguese',
      contactOption: 'TollFree',
    },
  ],
  sameAs: [
    'https://www.instagram.com/jaleca.oficial',
    'https://www.facebook.com/jalecaoficial',
  ],
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Uniformes Profissionais para Saúde',
    itemListElement: [
      { '@type': 'OfferCatalog', name: 'Jalecos Femininos', url: 'https://jaleca.com.br/categoria/jalecos-femininos' },
      { '@type': 'OfferCatalog', name: 'Jalecos Masculinos', url: 'https://jaleca.com.br/categoria/jalecos-masculinos' },
      { '@type': 'OfferCatalog', name: 'Dólmãs Profissionais', url: 'https://jaleca.com.br/categoria/domas' },
      { '@type': 'OfferCatalog', name: 'Conjuntos Scrub', url: 'https://jaleca.com.br/categoria/conjuntos' },
      { '@type': 'OfferCatalog', name: 'Acessórios para Saúde', url: 'https://jaleca.com.br/categoria/acessorios' },
    ],
  },
  knowsAbout: [
    'Jalecos femininos para médicas',
    'Uniformes para profissionais da saúde',
    'Jalecos masculinos para médicos',
    'Pijamas cirúrgicos e conjuntos scrub',
    'Dólmãs profissionais',
    'Moda profissional para área da saúde',
  ],
  slogan: 'Elegância clínica para profissionais da saúde',
  areaServed: {
    '@type': 'Country',
    name: 'Brasil',
  },
}

const webSiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': 'https://jaleca.com.br/#website',
  url: 'https://jaleca.com.br',
  name: 'Jaleca',
  description: 'Jalecos femininos e masculinos para profissionais da saúde',
  publisher: { '@id': 'https://jaleca.com.br/#organization' },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: 'https://jaleca.com.br/produtos?q={search_term_string}',
    },
    'query-input': 'required name=search_term_string',
  },
  inLanguage: 'pt-BR',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`h-full antialiased ${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd).replace(/</g, '\\u003c') }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd).replace(/</g, '\\u003c') }}
        />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="preload" as="image" href="/jaleco-hero-mobile.webp" type="image/webp" media="(max-width: 767px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/jaleco-hero-desktop.webp" type="image/webp" media="(min-width: 768px)" fetchPriority="high" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://wp.jaleca.com.br" />
        <link rel="preconnect" href="https://lh3.googleusercontent.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://embed.tawk.to" />
        <link rel="dns-prefetch" href="https://t.contentsquare.net" />
      </head>
      <body className="min-h-full flex flex-col">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[999] focus:bg-background focus:border focus:border-border focus:px-4 focus:py-2 focus:text-sm focus:font-semibold">
          Pular para o conteúdo
        </a>
        <AuthProvider>
          <WishlistProvider>
            <CompareProvider>
              <CartProvider>
                <Analytics />
                <Header />
                <CartDrawer />
                <BackButton />
                <div id="main-content" className="flex-1">{children}</div>
                <Footer />
                <WhatsAppButton />
                <FirstPurchasePopup />
                <CartRecoveryCapture />
                <CompareBar />
                <TawkToChat />
                <BackToTop />
                <CookieConsent />
                <FranqueadoBanner />
                <GoogleMerchantBadge />
                <SpeedInsights />
                <Script
                  src="https://t.contentsquare.net/uxa/d63ab31369d59.js"
                  strategy="lazyOnload"
                />
              </CartProvider>
            </CompareProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

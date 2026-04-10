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
import FranqueadoBanner from "@/components/FranqueadoBanner";
import GoogleMerchantBadge from "@/components/GoogleMerchantBadge";
import { SpeedInsights } from "@vercel/speed-insights/next";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`h-full antialiased ${cormorant.variable} ${dmSans.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
        <link rel="preload" as="image" href="/jaleco-hero-mobile.webp" type="image/webp" media="(max-width: 767px)" fetchPriority="high" />
        <link rel="preload" as="image" href="/jaleco-hero-desktop.webp" type="image/webp" media="(min-width: 768px)" fetchPriority="high" />
        <link rel="preconnect" href="https://connect.facebook.net" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://wp.jaleca.com.br" />
        <link rel="dns-prefetch" href="https://embed.tawk.to" />
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
              </CartProvider>
            </CompareProvider>
          </WishlistProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

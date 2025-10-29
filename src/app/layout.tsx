import type { Metadata } from "next";
import { Lato, Cormorant_Garamond, Archivo_Black } from "next/font/google";
import "./globals.css";
import "./kollect-it-styles.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { SessionProvider } from "@/components/SessionProvider";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";

const lato = Lato({
  weight: ['300', '400', '700'],
  subsets: ["latin"],
  variable: "--font-sans",
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  weight: ['400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-serif",
  display: 'swap',
  style: ['normal', 'italic'],
});

const archivoBlack = Archivo_Black({
  weight: '400',
  subsets: ["latin"],
  variable: "--font-logo",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "Kollect-It – Curated Antiques & Collectibles",
    template: "%s – Kollect-It",
  },
  description:
    "Authenticated art, antique books, collectibles, and militaria—curated with provenance for discerning collectors.",
  metadataBase: new URL('https://kollect-it.com'),
  openGraph: {
    type: 'website',
    siteName: 'Kollect-It',
    title: 'Kollect-It – Curated Antiques & Collectibles',
    description:
      'Explore authenticated fine art, rare books, collectibles, and militaria with trusted provenance.',
    url: 'https://kollect-it.com',
    images: [
      {
        url: '/og-default.jpg',
        width: 1200,
        height: 630,
        alt: 'Kollect-It marketplace',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@kollect_it',
    creator: '@kollect_it',
    title: 'Kollect-It – Curated Antiques & Collectibles',
    description:
      'Explore authenticated fine art, rare books, collectibles, and militaria with trusted provenance.',
    images: ['/og-default.jpg'],
  },
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html lang="en" className={`${lato.variable} ${cormorant.variable} ${archivoBlack.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <Script
          crossOrigin="anonymous"
          src="//unpkg.com/same-runtime/dist/index.global.js"
        />
      </head>
      <body suppressHydrationWarning className="antialiased">
        <SessionProvider>
          <CartProvider>
            <WishlistProvider>
              <ClientBody>{children}</ClientBody>
            </WishlistProvider>
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

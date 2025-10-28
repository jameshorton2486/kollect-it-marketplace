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
  title: "Kollect-It - Curated Antiques & Collectibles",
  description: "Authenticated art pieces, rare books, collectibles, and historical artifacts for discerning collectors.",
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

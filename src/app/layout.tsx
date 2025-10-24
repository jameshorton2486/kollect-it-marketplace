import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "./kollect-it-styles.css";
import ClientBody from "./ClientBody";
import Script from "next/script";
import { SessionProvider } from "@/components/SessionProvider";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";

const inter = Inter({
  weight: ['300', '400', '500'],
  subsets: ["latin"],
  variable: "--font-sans",
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
    <html lang="en" className={inter.variable}>
      <head>
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

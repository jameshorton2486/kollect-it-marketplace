import Hero from "@/components/home/hero";
import LatestArrivals from "@/components/home/LatestArrivalsClient";
import ShopByCategories from "@/components/home/ShopByCategoriesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kollect-It • Curated Antiques & Collectibles",
  description:
    "Discover authenticated antiques and collectibles curated by specialists. Explore latest arrivals and shop by category with confidence.",
  openGraph: {
    title: "Kollect-It • Curated Antiques & Collectibles",
    description:
      "Discover authenticated antiques and collectibles curated by specialists. Explore latest arrivals and shop by category with confidence.",
    url: "https://kollect-it.com/",
    siteName: "Kollect-It",
    images: [
      {
        url: "https://ext.same-assets.com/kollect-it/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "Kollect-It – Curated Antiques & Collectibles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Kollect-It • Curated Antiques & Collectibles",
    description:
      "Discover authenticated antiques and collectibles curated by specialists.",
    images: ["https://ext.same-assets.com/kollect-it/og-home.jpg"],
  },
};

export default function HomePage() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Kollect-It",
          url: "https://kollect-it.com",
          logo: "https://ext.same-assets.com/kollect-it/logo.png",
          sameAs: [
            "https://www.instagram.com/",
            "https://www.facebook.com/",
            "https://www.youtube.com/",
          ],
        }) }}
      />
      <Hero />
      <LatestArrivals />
      <ShopByCategories />
    </main>
  );
}

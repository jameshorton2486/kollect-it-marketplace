import Hero from "@/components/home/hero";
import LatestArrivals from "@/components/home/LatestArrivalsClient";
import ShopByCategories from "@/components/home/ShopByCategoriesClient";

export const metadata = {
  title: "Kollect-It • Curated Antiques & Collectibles",
  description:
    "Discover authenticated antiques and collectibles curated by specialists. Explore latest arrivals and shop by category with confidence.",
};

export default function HomePage() {
  return (
    <main>
      <Hero />
      <LatestArrivals />
      <ShopByCategories />
    </main>
  );
}

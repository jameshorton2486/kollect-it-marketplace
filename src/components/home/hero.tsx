import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream section-spacing text-center">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <h1 className="text-5xl md:text-6xl font-semibold text-navy mb-6">
          Crafted. Curated. Collected.
        </h1>
        <p className="text-lg md:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto mb-10">
          Kollect-It offers inspiring antiques and collectibles for modern
          collectors who insist on quality, provenance, and character.
        </p>
        <Link
          href="/categories"
          className="btn-cta"
        >
          Browse Collection
        </Link>
      </div>

      <Image
        src="https://ik.imagekit.io/kollectit/home-hero.jpg"
        alt="Kollect-It antique gallery background"
        width={1920}
        height={900}
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      />
    </section>
  );
}

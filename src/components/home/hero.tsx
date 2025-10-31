import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream section-spacing text-center">
      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <h1 className="text-5xl md:text-6xl font-semibold text-navy mb-6">
          Crafted. Curated. Collected.
        </h1>
        <p className="text-lg md:text-xl text-ink-secondary leading-relaxed max-w-3xl mx-auto mb-10">
          Kollect-It offers inspiring antiques and collectibles for modern
          collectors who insist on quality, authenticity and character.
        </p>
        <Link href="/categories" className="btn-primary">
          Browse Collection
        </Link>
      </div>

      {/* Subtle premium background: soft radial gradient + low-opacity image */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(253,251,247,1)_0%,_rgba(253,251,247,0.7)_40%,_rgba(253,251,247,0.45)_65%,_rgba(253,251,247,0.2)_85%,_transparent_100%)]"
      />
      <Image
        src="https://ik.imagekit.io/kollectit/home-hero.jpg"
        alt="Kollect-It antique gallery background"
        width={1920}
        height={900}
        className="absolute inset-0 h-full w-full object-cover opacity-10"
        priority
      />
    </section>
  );
}

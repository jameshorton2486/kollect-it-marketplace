import Link from "next/link";

export default function Hero() {
  return (
    <section className="ki-hero home-hero-bg">
      <div className="ki-container">
        <h1 className="ki-gold-underline ki-reveal">
          Crafted. Curated. Collected.
        </h1>
        <p className="ki-reveal delay-1">
          Kollect-It offers inspiring antiques and collectibles for modern
          collectors who insist on quality, authenticity and character.
        </p>
        <Link href="/categories" className="ki-btn-primary ki-reveal delay-2">
          Browse Collection
        </Link>
      </div>
    </section>
  );
}

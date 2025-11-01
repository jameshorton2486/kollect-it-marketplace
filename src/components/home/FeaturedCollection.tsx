import Image from "next/image";
import Link from "next/link";

export default function FeaturedCollection() {
  return (
    <section className="ki-section bg-white">
      <div className="ki-container ki-grid md:grid-cols-2 items-center">
        <div>
          <p className="mb-3 text-[12px] uppercase tracking-[0.12em] text-brand-gold">
            Featured Collection
          </p>
          <h2 className="mb-4 font-serif text-[clamp(28px,4vw,36px)] leading-[1.3] text-brand-navy ki-gold-underline">
            Treasures of the Archive: Rare Books & First Editions
          </h2>
          <p className="mb-6 text-[16px] leading-7 text-ink-secondary">
            A handpicked selection of literary artifacts with exceptional
            history and provenance.
          </p>
          <Link
            href="/category/antique-books"
            className="ki-btn-primary"
          >
            Explore Collection
          </Link>
        </div>
        <div className="relative ki-card ki-round ki-img-zoom">
          <Image
            src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1600&auto=format&fit=crop"
            alt="Featured rare books"
            width={1200}
            height={800}
            className="aspect-[4/3] w-full object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}

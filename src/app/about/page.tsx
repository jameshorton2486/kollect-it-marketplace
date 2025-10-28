"use client";

import Image from "next/image";
import Link from "next/link";

export const metadata = {
  title: "About • Kollect-It",
  description:
    "Kollect-It offers authenticated antiques and collectibles curated by specialists for modern collectors who value provenance and character.",
};

export default function AboutPage() {
  return (
    <main>
      {/* ---------------- HERO ---------------- */}
      <section className="relative overflow-hidden bg-[#F8F8F5] py-24 text-center">
        <div className="container mx-auto px-6 max-w-5xl">
          <h1 className="text-5xl md:text-6xl font-[Cormorant_Garamond] font-semibold text-[#1A1A1A] mb-6">
            Curated Antiques &amp; Collectibles
          </h1>
          <p className="text-lg md:text-xl text-gray-600 font-[Lato] leading-relaxed max-w-3xl mx-auto mb-10">
            Every piece in our collection is authenticated, documented, and
            selected for its historical significance and enduring beauty.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center px-8 py-4 border-2 border-[#C9A66B] text-[#C9A66B] font-bold uppercase tracking-wide rounded-xl transition-all duration-300 hover:bg-[#C9A66B] hover:text-[#0B3D91] hover:-translate-y-1"
          >
            Browse Collection
          </Link>
        </div>
        <Image
          src="https://ik.imagekit.io/kollectit/about-hero.jpg?updatedAt=2025"
          alt="Antique collection background"
          width={1920}
          height={900}
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        />
      </section>

      {/* ---------------- PHILOSOPHY ---------------- */}
      <section className="py-[100px] bg-white">
        <div className="container mx-auto px-6 max-w-6xl grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-[Cormorant_Garamond] font-semibold text-[#0B3D91] mb-4">
              Our Philosophy
            </h2>
            <p className="text-gray-700 font-[Lato] leading-relaxed">
              Kollect-It exists to elevate collecting into an art form. We
              combine academic research, connoisseurship, and design expertise
              to help collectors discover pieces that resonate through time.
            </p>
            <p className="text-gray-700 font-[Lato] leading-relaxed mt-4">
              Each item is carefully documented, photographed, and presented
              with transparency so that its story continues with integrity.
            </p>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <Image
              src="https://ik.imagekit.io/kollectit/about-philosophy.jpg"
              alt="Antique books and fine art arrangement"
              width={800}
              height={600}
              className="object-cover w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* ---------------- EXPERTISE ---------------- */}
      <section className="py-[100px] bg-[#F8F8F5]">
        <div className="container mx-auto px-6 max-w-6xl text-center">
          <h2 className="text-4xl font-[Cormorant_Garamond] text-[#0B3D91] font-semibold mb-6">
            Authenticated by Specialists
          </h2>
          <p className="text-gray-700 font-[Lato] leading-relaxed max-w-3xl mx-auto mb-8">
            Our team includes historians, appraisers, and category experts who
            verify authenticity and provenance for every piece we offer.
          </p>
          <blockquote className="italic text-[#C9A66B] font-[Cormorant_Garamond] text-2xl">
            “Expertise ensures beauty endures.”
          </blockquote>
          <p className="mt-4 text-gray-600 font-[Lato]">— The Kollect-It Team</p>
        </div>
      </section>

      {/* ---------------- CATEGORIES ---------------- */}
      <section className="py-[100px] bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-4xl font-[Cormorant_Garamond] text-[#0B3D91] font-semibold mb-10 text-center">
            What We Collect
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10">
            {[
              {
                title: "Antique Books",
                desc: "Scarce first editions, finely bound volumes, and literary treasures.",
                img: "https://ik.imagekit.io/kollectit/cat-books.jpg",
                href: "/category/antique-books",
              },
              {
                title: "Collectibles",
                desc: "Rare memorabilia, vintage timepieces, and authenticated ephemera.",
                img: "https://ik.imagekit.io/kollectit/cat-collectibles.jpg",
                href: "/category/collectibles",
              },
              {
                title: "Fine Art",
                desc: "Paintings, prints, and sculpture from documented periods and artists.",
                img: "https://ik.imagekit.io/kollectit/cat-art.jpg",
                href: "/category/fine-art",
              },
              {
                title: "Militaria",
                desc: "Historical artifacts with verified provenance and cultural importance.",
                img: "https://ik.imagekit.io/kollectit/cat-militaria.jpg",
                href: "/category/militaria",
              },
            ].map((cat) => (
              <Link
                href={cat.href}
                key={cat.title}
                className="group block border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 bg-white"
              >
                <Image
                  src={cat.img}
                  alt={cat.title}
                  width={600}
                  height={500}
                  className="object-cover w-full h-56 group-hover:scale-105 transition-transform duration-500"
                />
                <div className="p-6">
                  <h3 className="text-2xl font-[Cormorant_Garamond] text-[#0B3D91] mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-gray-600 font-[Lato] leading-relaxed">
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="py-[100px] bg-[#0E1220] text-center text-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-4xl md:text-5xl font-[Cormorant_Garamond] font-semibold mb-6 text-[#C9A66B]">
            Begin Your Collection
          </h2>
          <p className="text-gray-300 font-[Lato] mb-10 max-w-2xl mx-auto">
            Explore authenticated antiques and collectibles curated by experts
            who value provenance as much as beauty.
          </p>
          <Link
            href="/categories"
            className="inline-flex items-center justify-center px-10 py-4 border-2 border-[#C9A66B] text-[#C9A66B] font-bold uppercase tracking-wide rounded-xl transition-all duration-300 hover:bg-[#C9A66B] hover:text-[#0B3D91] hover:-translate-y-1"
          >
            Browse Collection
          </Link>
        </div>
      </section>
    </main>
  );
}
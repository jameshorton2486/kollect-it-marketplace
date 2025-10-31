import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import CartIcon from "@/components/CartIcon";
import UserAccountDropdown from "@/components/UserAccountDropdown";
import AnnouncementBar from "@/components/AnnouncementBar";

export const metadata: Metadata = {
  title: "About Us - Kollect-It",
  description:
    "Curated antiques and collectibles for discerning collectors who value authenticity and character.",
};

export const revalidate = 3600;

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.log("Database not available, using fallback categories");
    return [
      {
        id: "1",
        name: "Fine Art",
        slug: "fine-art",
        description:
          "Authenticated art pieces spanning various periods and mediums, from paintings to prints and sculptures",
        image: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "2",
        name: "Antique Books",
        slug: "antique-books",
        description:
          "Scarce first editions, beautifully bound volumes, and literary treasures for discerning bibliophiles",
        image: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "3",
        name: "Collectibles",
        slug: "collectibles",
        description:
          "Rare memorabilia, unique ephemera, vintage timepieces, and authenticated collectible items",
        image: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "4",
        name: "Militaria",
        slug: "militaria",
        description:
          "Historical artifacts with documented provenance and significance, from military medals to period documents",
        image: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}

export default async function AboutPage() {
  const categories = await getCategories();

  return (
    <div>
      {/* Refined Announcement Bar with Dismiss */}
      <AnnouncementBar />

      {/* Header */}
      <header className="header">
        <div className="header-container">
          <button className="menu-toggle" aria-label="Menu">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="logo">
            <Link href="/" className="no-underline">
              <span className="header-logo">KOLLECT — IT</span>
            </Link>
          </div>

          <div className="header-icons">
            <CartIcon />
            <UserAccountDropdown />
          </div>
        </div>

        <nav className="main-nav">
          <Link href="/">Home</Link>
          <div className="nav-dropdown">
            <a href="#" className="dropdown-toggle">
              Shop by Category
            </a>
            <div className="dropdown-menu">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/category/${cat.slug}`}>
                  {cat.name}
                </Link>
              ))}
            </div>
          </div>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>

      {/* Hero Section - Gallery Quality */}
      <section className="parallax-hero min-h-[65vh] flex items-center relative overflow-hidden bg-gradient-to-b from-black/40 to-black/60">
        <div
          className="parallax-bg bg-about-hero absolute inset-0 z-0"
          data-parallax
        />
        <div className="container relative z-10 text-center text-white max-w-[900px] py-[120px] px-8">
          <p className="section-subtitle" data-reveal>
            ABOUT KOLLECT-IT
          </p>
          <h1
            className="text-white mb-8 text-[clamp(42px,5vw,56px)] font-normal leading-[1.2] font-serif"
            data-reveal
            data-reveal-delay="100"
          >
            Curated Antiques & Collectibles
          </h1>
          <p
            className="text-[18px] leading-[1.8] text-white/95 max-w-[800px] mx-auto font-light"
            data-reveal
            data-reveal-delay="200"
          >
            Every piece in our collection is authenticated, documented, and
            selected for its historical significance and enduring beauty.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-[100px] px-8 bg-white">
        <div className="container max-w-[900px] mx-auto">
          <h2 className="text-center mb-8 text-[12px] tracking-[0.2em] text-gold uppercase font-normal">
            OUR PHILOSOPHY
          </h2>

          <div className="mb-6">
            <p className="text-[18px] leading-[1.8] text-ink text-center">
              We believe that collecting should be an informed pursuit—one that
              values provenance, condition, and authenticity above all else. Our
              mission is to connect discerning collectors with pieces that tell
              stories and stand the test of time.
            </p>
          </div>

          <div className="mb-6">
            <p className="text-[18px] leading-[1.8] text-ink text-center">
              Each item is carefully researched, expertly photographed, and
              transparently described to give you complete confidence in your
              acquisition. We maintain relationships with specialists,
              historians, and appraisers to ensure every piece meets our
              rigorous standards.
            </p>
          </div>

          <div>
            <p className="text-[18px] leading-[1.8] text-ink text-center">
              From rare books and fine art to collectibles and militaria, our
              collection represents decades of expertise in identifying and
              curating items of exceptional quality and historical significance.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Image 1 */}
      <section className="p-0 mb-[100px]">
        <div className="max-w-[1400px] mx-auto">
          <img
            src="https://c8.alamy.com/comp/TRNXR3/collectibles-and-antiques-on-display-in-the-historic-gaskill-brothers-stone-store-and-museum-in-campo-california-TRNXR3.jpg"
            alt="Curated Collectibles Display"
            className="w-full h-auto object-cover aspect-[16/9]"
          />
        </div>
      </section>

      {/* Expertise Section */}
      <section className="py-[100px] px-8 bg-backgrounds-elevated">
        <div className="container max-w-[700px] text-center mx-auto">
          <p className="text-[12px] tracking-[0.2em] text-gold uppercase mb-6 font-normal">
            EXPERTISE
          </p>
          <h2 className="mb-6 text-[clamp(32px,4vw,36px)] font-serif font-normal leading-[1.3] text-brand-navy">
            Authenticated by Specialists
          </h2>
          <p className="text-[16px] leading-[1.8] text-ink mb-12">
            Our team includes historians, appraisers, and category specialists
            who verify authenticity and document provenance for every item we
            offer.
          </p>

          <svg className="signature-svg" viewBox="0 0 200 60">
            <path d="M 10 40 Q 30 10, 50 30 T 90 30 Q 110 10, 130 40 T 170 30 L 190 35" />
          </svg>
          <p className="text-[16px] text-gold mt-4 italic">
            — The Kollect-It Team
          </p>
        </div>
      </section>

      {/* Gallery Image 2 */}
      <section className="p-0 mb-[100px]">
        <div className="max-w-[1400px] mx-auto">
          <img
            src="https://images.squarespace-cdn.com/content/v1/5fa1332a8b3f520c382b9816/080eb5c5-a933-4d73-be16-52c8efc0fc57/IMG_7691.jpg"
            alt="Museum Display Furniture"
            className="w-full h-auto object-cover aspect-[16/9]"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-[100px] px-8 bg-backgrounds-elevated text-center">
        <div className="container max-w-[900px] mx-auto">
          <p className="text-[12px] tracking-[0.2em] text-gold uppercase mb-4 font-normal">
            CATEGORIES
          </p>
          <h2 className="font-serif text-[clamp(36px,4vw,48px)] font-normal mb-16 leading-[1.3] text-brand-navy">
            What We Collect
          </h2>

          <div className="grid [grid-template-columns:repeat(auto-fit,minmax(300px,1fr))] gap-12 text-left">
            {categories.map((category) => (
              <div key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  className="category-link no-underline text-[18px] font-medium tracking-[0.05em] uppercase text-brand-navy block mb-3 font-serif hover:text-gold-hover transition-colors"
                >
                  {category.name}
                </Link>
                <p className="text-[16px] leading-[1.8] text-ink-secondary font-light">
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-[100px] px-8 bg-deep-navy text-white text-center">
        <div className="container max-w-[700px] mx-auto">
          <h2 className="font-serif text-[clamp(36px,4vw,42px)] font-normal mb-4 leading-[1.3] text-white">
            Begin Your Collection
          </h2>
          <p className="text-[18px] leading-[1.8] text-white/90 font-light mb-8">
            Explore our curated selection of authenticated antiques and
            collectibles.
          </p>
          <Link
            href="/"
            className="about-cta-button inline-flex items-center justify-center px-10 py-4 border-2 border-gold text-gold text-[14px] font-medium tracking-[0.1em] uppercase rounded-[2px] no-underline transition-colors hover:bg-gold hover:text-brand-navy"
          >
            BROWSE COLLECTION
          </Link>
        </div>
      </section>

      {/* Footer - Matches Homepage */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-brand">
                <Link href="/" className="no-underline">
                  <span className="footer-logo-refined">KOLLECT — IT</span>
                </Link>
              </div>
              <h3 className="footer-heading">About</h3>
              <p className="footer-text">
                Kollect-It offers inspiring antiques and collectibles for modern
                collectors who insist on quality and character.
              </p>
              <p className="footer-text footer-em">
                <em>Curated and authenticated by the Kollect-It team.</em>
              </p>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Shop Categories</h3>
              <ul className="footer-links">
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link
                      href={`/category/${cat.slug}`}
                      className="footer-link"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Connect</h3>
              <ul className="footer-links">
                <li>
                  <a href="#" className="footer-link">
                    Instagram
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    YouTube
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Facebook
                  </a>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Support</h3>
              <ul className="footer-links">
                <li>
                  <Link href="/admin/login" className="footer-link">
                    Admin Login
                  </Link>
                </li>
                <li>
                  <a href="#" className="footer-link">
                    FAQs
                  </a>
                </li>
                <li>
                  <Link href="/about" className="footer-link">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom-refined">
            <p>&copy; Kollect-It {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

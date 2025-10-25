import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from '@/lib/prisma';
import CartIcon from '@/components/CartIcon';
import UserAccountDropdown from '@/components/UserAccountDropdown';

export const metadata: Metadata = {
  title: "About Us - Kollect-It",
  description: "Curated antiques and collectibles for discerning collectors who value authenticity and character.",
};

export const revalidate = 3600;

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.log('Database not available, using fallback categories');
    // Fallback categories for build time
    return [
      {
        id: '1',
        name: 'Fine Art',
        slug: 'fine-art',
        description: 'Authenticated art pieces spanning various periods and mediums, from paintings to prints and sculptures',
        image: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Antique Books',
        slug: 'antique-books',
        description: 'Scarce first editions, beautifully bound volumes, and literary treasures for discerning bibliophiles',
        image: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: 'Collectibles',
        slug: 'collectibles',
        description: 'Rare memorabilia, unique ephemera, vintage timepieces, and authenticated collectible items',
        image: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        name: 'Militaria',
        slug: 'militaria',
        description: 'Historical artifacts with documented provenance and significance, from military medals to period documents',
        image: '',
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
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <span>ARE YOU A MEMBER OF THE TRADE? REGISTER YOUR ACCOUNT HERE</span>
        </div>
      </div>

      {/* Header */}
      <header className="header">
        <div className="header-container">
          <button className="menu-toggle" aria-label="Menu">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>

          <div className="logo">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span className="header-logo">
                KOLLECT — IT
              </span>
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
            <a href="#" className="dropdown-toggle">Shop by Category</a>
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

      {/* Hero Section with Parallax Banner */}
      <section className="parallax-hero" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
        <div
          className="parallax-bg"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80)',
            filter: 'grayscale(100%) brightness(0.4)'
          }}
          data-parallax
        />
        <div className="container" style={{ position: 'relative', zIndex: 10, textAlign: 'center', color: 'var(--color-white)', maxWidth: '900px' }}>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.9)' }} data-reveal>ABOUT KOLLECT-IT</p>
          <h1 className="section-title-main" style={{ color: 'var(--color-white)', marginBottom: '1.5rem' }} data-reveal data-reveal-delay="100">
            Curated Antiques & Collectibles
          </h1>
          <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'rgba(255,255,255,0.95)', maxWidth: '700px', margin: '0 auto' }} data-reveal data-reveal-delay="200">
            Every piece in our collection is authenticated, documented, and selected for its historical significance and enduring beauty.
          </p>
        </div>
      </section>

      {/* Philosophy Section with Split Fade */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: 'var(--color-white)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="section-subtitle" style={{ textAlign: 'center', marginBottom: '3rem' }}>OUR PHILOSOPHY</h2>

          <div className="split-fade-left" style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '17px', lineHeight: '1.8', color: 'var(--color-gray-dark)' }}>
              We believe that collecting should be an informed pursuit—one that values provenance, condition, and authenticity above all else. Our mission is to connect discerning collectors with pieces that tell stories and stand the test of time.
            </p>
          </div>

          <div className="split-fade-right" style={{ marginBottom: '2.5rem' }}>
            <p style={{ fontSize: '17px', lineHeight: '1.8', color: 'var(--color-gray-dark)' }}>
              Each item is carefully researched, expertly photographed, and transparently described to give you complete confidence in your acquisition. We maintain relationships with specialists, historians, and appraisers to ensure every piece meets our rigorous standards.
            </p>
          </div>

          <div className="split-fade-left">
            <p style={{ fontSize: '17px', lineHeight: '1.8', color: 'var(--color-gray-dark)' }}>
              From rare books and fine art to collectibles and militaria, our collection represents decades of expertise in identifying and curating items of exceptional quality and historical significance.
            </p>
          </div>
        </div>
      </section>

      {/* Large Gallery Image 1 */}
      <section style={{ padding: '0', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <img
            src="https://c8.alamy.com/comp/TRNXR3/collectibles-and-antiques-on-display-in-the-historic-gaskill-brothers-stone-store-and-museum-in-campo-california-TRNXR3.jpg"
            alt="Curated Collectibles Display"
            style={{ width: '100%', height: 'auto', aspectRatio: '16/9', objectFit: 'cover' }}
            data-reveal
          />
        </div>
      </section>

      {/* Expertise Section */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: 'var(--color-cream)' }}>
        <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <p className="section-subtitle" data-reveal>EXPERTISE</p>
          <h2 className="section-title" data-reveal data-reveal-delay="100" style={{ marginBottom: '2rem' }}>
            Authenticated by Specialists
          </h2>
          <p style={{ fontSize: '17px', lineHeight: '1.8', color: 'var(--color-gray-dark)', marginBottom: '3rem' }} data-reveal data-reveal-delay="200">
            Our team includes historians, appraisers, and category specialists who verify authenticity and document provenance for every item we offer.
          </p>

          {/* Signature */}
          <svg className="signature-svg" viewBox="0 0 200 60" data-reveal data-reveal-delay="300">
            <path d="M 10 40 Q 30 10, 50 30 T 90 30 Q 110 10, 130 40 T 170 30 L 190 35" />
          </svg>
          <p style={{ fontSize: '14px', color: 'var(--color-gray-medium)', marginTop: '1rem' }}>
            — The Kollect-It Team
          </p>
        </div>
      </section>

      {/* Large Gallery Image 3 */}
      <section style={{ padding: '0', marginBottom: 'var(--space-6)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <img
            src="https://images.squarespace-cdn.com/content/v1/5fa1332a8b3f520c382b9816/080eb5c5-a933-4d73-be16-52c8efc0fc57/IMG_7691.jpg"
            alt="Museum Display Furniture"
            style={{ width: '100%', height: 'auto', aspectRatio: '3/4', objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* Categories We Specialize In */}
      <section style={{ padding: 'var(--space-6) var(--space-2)', backgroundColor: 'var(--white)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <p className="section-subtitle">CATEGORIES</p>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '32px',
            fontWeight: 300,
            marginBottom: 'var(--space-4)',
            lineHeight: '1.4'
          }}>
            What We Collect
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 'var(--space-3)',
            textAlign: 'left'
          }}>
            {categories.map((category) => (
              <div key={category.id} style={{ borderTop: 'var(--border)', paddingTop: 'var(--space-2)' }}>
                <Link
                  href={`/category/${category.slug}`}
                  style={{
                    fontSize: '14px',
                    fontWeight: 400,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--charcoal)',
                    display: 'block',
                    marginBottom: '0.5rem'
                  }}
                >
                  {category.name}
                </Link>
                <p style={{ fontSize: '14px', lineHeight: '1.6', color: 'var(--charcoal)', fontWeight: 300 }}>
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{
        padding: 'var(--space-6) var(--space-2)',
        backgroundColor: 'var(--charcoal)',
        color: 'var(--white)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '32px',
            fontWeight: 300,
            marginBottom: 'var(--space-3)',
            lineHeight: '1.4',
            color: 'var(--white)'
          }}>
            Begin Your Collection
          </h2>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--white)', fontWeight: 300, marginBottom: 'var(--space-3)' }}>
            Explore our curated selection of authenticated antiques and collectibles.
          </p>
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem 2.5rem',
              border: '1px solid var(--white)',
              background: 'transparent',
              color: 'var(--white)',
              fontSize: '14px',
              fontWeight: 400,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              transition: 'opacity 0.15s ease'
            }}
            className="btn"
          >
            Browse Collection
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <div style={{ marginBottom: 'var(--space-2)' }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <span className="footer-logo">
                    KOLLECT — IT
                  </span>
                </Link>
              </div>
              <h3>About</h3>
              <p>
                Kollect-It offers inspiring antiques and collectibles for modern collectors who
                insist on quality and character.
              </p>
            </div>

            <div className="footer-col">
              <h3>Shop Categories</h3>
              <ul>
                {categories.map((cat) => (
                  <li key={cat.id}>
                    <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3>Connect</h3>
              <ul>
                <li><a href="#">Instagram</a></li>
                <li><a href="#">YouTube</a></li>
                <li><a href="#">Facebook</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Support</h3>
              <ul>
                <li><Link href="/admin/login">Admin Login</Link></li>
                <li><a href="#">FAQs</a></li>
                <li><Link href="/about">About</Link></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© Kollect-It 2025</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

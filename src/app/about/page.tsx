import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from '@/lib/prisma';
import CartIcon from '@/components/CartIcon';
import UserAccountDropdown from '@/components/UserAccountDropdown';
import AnnouncementBar from '@/components/AnnouncementBar';

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
      {/* Refined Announcement Bar with Dismiss */}
      <AnnouncementBar />

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

      {/* Hero Section - Gallery Quality */}
      <section
        className="parallax-hero"
        style={{
          minHeight: '65vh',
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.6))'
        }}
      >
        <div
          className="parallax-bg"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=1200&q=80)',
            filter: 'grayscale(100%) brightness(0.5)',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 0
          }}
          data-parallax
        />
        <div
          className="container"
          style={{
            position: 'relative',
            zIndex: 10,
            textAlign: 'center',
            color: 'var(--color-white)',
            maxWidth: '900px',
            padding: '120px 2rem'
          }}
        >
          <p
            className="section-subtitle"
            style={{
              color: 'var(--color-gold)',
              fontSize: '12px',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '1rem',
              fontWeight: 400,
              fontFamily: 'var(--font-sans)'
            }}
            data-reveal
          >
            ABOUT KOLLECT-IT
          </p>
          <h1
            style={{
              color: 'var(--color-white)',
              marginBottom: '2rem',
              fontSize: 'clamp(42px, 5vw, 56px)',
              fontWeight: 400,
              lineHeight: 1.2,
              fontFamily: 'var(--font-serif)'
            }}
            data-reveal
            data-reveal-delay="100"
          >
            Curated Antiques & Collectibles
          </h1>
          <p
            style={{
              fontSize: '18px',
              lineHeight: '1.8',
              color: 'rgba(255,255,255,0.95)',
              maxWidth: '800px',
              margin: '0 auto',
              fontWeight: 300,
              fontFamily: 'var(--font-sans)'
            }}
            data-reveal
            data-reveal-delay="200"
          >
            Every piece in our collection is authenticated, documented, and selected for its historical significance and enduring beauty.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section style={{ padding: '100px 2rem', background: 'var(--color-white)' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2
            style={{
              textAlign: 'center',
              marginBottom: '2rem',
              fontSize: '12px',
              letterSpacing: '0.2em',
              color: 'var(--color-gold)',
              textTransform: 'uppercase',
              fontWeight: 400,
              fontFamily: 'var(--font-sans)'
            }}
          >
            OUR PHILOSOPHY
          </h2>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--color-navy)', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
              We believe that collecting should be an informed pursuit—one that values provenance, condition, and authenticity above all else. Our mission is to connect discerning collectors with pieces that tell stories and stand the test of time.
            </p>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--color-navy)', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
              Each item is carefully researched, expertly photographed, and transparently described to give you complete confidence in your acquisition. We maintain relationships with specialists, historians, and appraisers to ensure every piece meets our rigorous standards.
            </p>
          </div>

          <div>
            <p style={{ fontSize: '18px', lineHeight: '1.8', color: 'var(--color-navy)', textAlign: 'center', fontFamily: 'var(--font-sans)' }}>
              From rare books and fine art to collectibles and militaria, our collection represents decades of expertise in identifying and curating items of exceptional quality and historical significance.
            </p>
          </div>
        </div>
      </section>

      {/* Gallery Image 1 */}
      <section style={{ padding: '0', marginBottom: '100px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <img
            src="https://c8.alamy.com/comp/TRNXR3/collectibles-and-antiques-on-display-in-the-historic-gaskill-brothers-stone-store-and-museum-in-campo-california-TRNXR3.jpg"
            alt="Curated Collectibles Display"
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '16/9',
              objectFit: 'cover'
            }}
          />
        </div>
      </section>

      {/* Expertise Section */}
      <section style={{ padding: '100px 2rem', background: '#FAFAF8' }}>
        <div className="container" style={{ maxWidth: '700px', textAlign: 'center', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              color: 'var(--color-gold)',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              fontWeight: 400,
              fontFamily: 'var(--font-sans)'
            }}
          >
            EXPERTISE
          </p>
          <h2
            style={{
              marginBottom: '1.5rem',
              fontSize: 'clamp(32px, 4vw, 36px)',
              fontFamily: 'var(--font-serif)',
              fontWeight: 400,
              lineHeight: 1.3,
              color: 'var(--color-navy)'
            }}
          >
            Authenticated by Specialists
          </h2>
          <p
            style={{
              fontSize: '16px',
              lineHeight: '1.8',
              color: 'var(--color-navy)',
              marginBottom: '3rem',
              fontFamily: 'var(--font-sans)'
            }}
          >
            Our team includes historians, appraisers, and category specialists who verify authenticity and document provenance for every item we offer.
          </p>

          <svg className="signature-svg" viewBox="0 0 200 60">
            <path d="M 10 40 Q 30 10, 50 30 T 90 30 Q 110 10, 130 40 T 170 30 L 190 35" />
          </svg>
          <p style={{ fontSize: '16px', color: 'var(--color-gold)', marginTop: '1rem', fontStyle: 'italic', fontFamily: 'var(--font-sans)' }}>
            — The Kollect-It Team
          </p>
        </div>
      </section>

      {/* Gallery Image 2 */}
      <section style={{ padding: '0', marginBottom: '100px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <img
            src="https://images.squarespace-cdn.com/content/v1/5fa1332a8b3f520c382b9816/080eb5c5-a933-4d73-be16-52c8efc0fc57/IMG_7691.jpg"
            alt="Museum Display Furniture"
            style={{
              width: '100%',
              height: 'auto',
              aspectRatio: '16/9',
              objectFit: 'cover'
            }}
          />
        </div>
      </section>

      {/* Categories Section */}
      <section style={{ padding: '100px 2rem', backgroundColor: '#FAFAF8', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          <p
            style={{
              fontSize: '12px',
              letterSpacing: '0.2em',
              color: 'var(--color-gold)',
              textTransform: 'uppercase',
              marginBottom: '1rem',
              fontWeight: 400,
              fontFamily: 'var(--font-sans)'
            }}
          >
            CATEGORIES
          </p>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(36px, 4vw, 48px)',
            fontWeight: 400,
            marginBottom: '4rem',
            lineHeight: '1.3',
            color: 'var(--color-navy)'
          }}>
            What We Collect
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            textAlign: 'left'
          }}>
            {categories.map((category) => (
              <div key={category.id}>
                <Link
                  href={`/category/${category.slug}`}
                  style={{
                    fontSize: '18px',
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--color-navy)',
                    display: 'block',
                    marginBottom: '0.75rem',
                    transition: 'color 0.3s ease',
                    fontFamily: 'var(--font-serif)',
                    textDecoration: 'none'
                  }}
                  className="category-link"
                >
                  {category.name}
                </Link>
                <p style={{
                  fontSize: '16px',
                  lineHeight: '1.8',
                  color: 'rgba(50, 41, 35, 0.9)',
                  fontWeight: 300,
                  fontFamily: 'var(--font-sans)'
                }}>
                  {category.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{
        padding: '100px 2rem',
        backgroundColor: 'var(--color-navy)',
        color: 'var(--color-white)',
        textAlign: 'center'
      }}>
        <div className="container" style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(36px, 4vw, 42px)',
            fontWeight: 400,
            marginBottom: '1rem',
            lineHeight: '1.3',
            color: 'var(--color-white)'
          }}>
            Begin Your Collection
          </h2>
          <p style={{
            fontSize: '18px',
            lineHeight: '1.8',
            color: 'rgba(255,255,255,0.9)',
            fontWeight: 300,
            marginBottom: '2rem',
            fontFamily: 'var(--font-sans)'
          }}>
            Explore our curated selection of authenticated antiques and collectibles.
          </p>
          <Link
            href="/"
            className="about-cta-button"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px 40px',
              border: '2px solid var(--color-gold)',
              background: 'transparent',
              color: 'var(--color-gold)',
              fontSize: '14px',
              fontWeight: 500,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              transition: 'all 0.3s ease',
              borderRadius: '2px',
              textDecoration: 'none'
            }}
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
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <span className="footer-logo-refined">
                    KOLLECT — IT
                  </span>
                </Link>
              </div>
              <h3 className="footer-heading">About</h3>
              <p className="footer-text">
                Kollect-It offers inspiring antiques and collectibles for modern collectors who
                insist on quality and character.
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
                    <Link href={`/category/${cat.slug}`} className="footer-link">{cat.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Connect</h3>
              <ul className="footer-links">
                <li>
                  <a href="#" className="footer-link">Instagram</a>
                </li>
                <li>
                  <a href="#" className="footer-link">YouTube</a>
                </li>
                <li>
                  <a href="#" className="footer-link">Facebook</a>
                </li>
                <li>
                  <a href="#" className="footer-link">Contact</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h3 className="footer-heading">Support</h3>
              <ul className="footer-links">
                <li>
                  <Link href="/admin/login" className="footer-link">Admin Login</Link>
                </li>
                <li>
                  <a href="#" className="footer-link">FAQs</a>
                </li>
                <li>
                  <Link href="/about" className="footer-link">About</Link>
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
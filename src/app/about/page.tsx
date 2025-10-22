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
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
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
              <span style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '2.5rem',
                fontWeight: 300,
                letterSpacing: '0.5em',
                color: '#000000',
                display: 'inline-block',
                textTransform: 'uppercase'
              }}>
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

      {/* About Content */}
      <section className="about-page">
        <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>
          {/* Title Section */}
          <div style={{ paddingTop: 'var(--space-6)', paddingBottom: 'var(--space-5)' }}>
            <p className="section-subtitle">ABOUT KOLLECT-IT</p>
            <h1 className="section-title" style={{ marginBottom: 'var(--space-3)' }}>
              Curated Antiques & Collectibles for Modern Collectors
            </h1>
            <p style={{
              fontSize: '18px',
              lineHeight: '1.8',
              color: 'var(--charcoal)',
              fontWeight: 300,
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Every piece in our collection is authenticated, documented, and selected for its historical significance and enduring beauty.
            </p>
          </div>
        </div>
      </section>

      {/* Large Gallery Image 1 */}
      <section style={{ padding: '0', marginBottom: 'var(--space-6)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <img
            src="https://c8.alamy.com/comp/TRNXR3/collectibles-and-antiques-on-display-in-the-historic-gaskill-brothers-stone-store-and-museum-in-campo-california-TRNXR3.jpg"
            alt="Curated Collectibles Display"
            style={{ width: '100%', height: 'auto', aspectRatio: '16/9', objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="about-philosophy" style={{ padding: 'var(--space-6) var(--space-2)', backgroundColor: 'var(--light-grey)' }}>
        <div className="container" style={{ maxWidth: '700px', textAlign: 'center' }}>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '32px',
            fontWeight: 300,
            marginBottom: 'var(--space-3)',
            lineHeight: '1.4'
          }}>
            Our Philosophy
          </h2>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--charcoal)', fontWeight: 300, marginBottom: 'var(--space-2)' }}>
            We believe that collecting should be an informed pursuit—one that values provenance, condition, and authenticity above all else.
          </p>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--charcoal)', fontWeight: 300 }}>
            Each item is carefully researched, expertly photographed, and transparently described to give you complete confidence in your acquisition.
          </p>
        </div>
      </section>

      {/* Large Gallery Image 2 */}
      <section style={{ padding: 'var(--space-6) 0' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <img
            src="https://bostonglobe-prod.cdn.arcpublishing.com/resizer/v2/6HH4LLHWNUI6HO77RJMADOI2LQ.jpg?auth=c137f8c02850f71c4aa3cbe37e94531332a522b26e062f394eb3fa2c2714bc9c&width=1440"
            alt="Fine Art and Craft Collection"
            style={{ width: '100%', height: 'auto', aspectRatio: '16/9', objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* Expertise Section */}
      <section style={{ padding: 'var(--space-6) var(--space-2)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <p className="section-subtitle">EXPERTISE</p>
          <h2 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '32px',
            fontWeight: 300,
            marginBottom: 'var(--space-3)',
            lineHeight: '1.4'
          }}>
            Authenticated by Specialists
          </h2>
          <p style={{ fontSize: '16px', lineHeight: '1.8', color: 'var(--charcoal)', fontWeight: 300 }}>
            Our team includes historians, appraisers, and category specialists who verify authenticity and document provenance for every item we offer.
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
              <div className="footer-logo" style={{ marginBottom: 'var(--space-2)' }}>
                <Link href="/" style={{ textDecoration: 'none' }}>
                  <span style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '2.5rem',
                    fontWeight: 300,
                    letterSpacing: '0.3em',
                    color: '#000000',
                    display: 'inline-block',
                    textTransform: 'uppercase'
                  }}>
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

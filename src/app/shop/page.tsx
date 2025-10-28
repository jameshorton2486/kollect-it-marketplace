import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Breadcrumbs from '@/components/Breadcrumbs';

export const metadata: Metadata = {
  title: 'Shop All Collections - Kollect-It',
  description: 'Browse our curated collections of fine art, antique books, collectibles, and militaria.',
};

export const revalidate = 60;

async function getCategories() {
  try {
    return await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.log('Database not available, using fallback categories');
    }
    return [
      {
        id: '1',
        name: 'Fine Art',
        slug: 'fine-art',
        description: 'Authenticated art pieces spanning various periods and mediums',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
      },
      {
        id: '2',
        name: 'Antique Books',
        slug: 'antique-books',
        description: 'Scarce first editions and literary treasures',
        image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
      },
      {
        id: '3',
        name: 'Collectibles',
        slug: 'collectibles',
        description: 'Rare memorabilia and unique ephemera',
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80',
      },
      {
        id: '4',
        name: 'Militaria',
        slug: 'militaria',
        description: 'Historical artifacts with documented provenance',
        image: 'https://ext.same-assets.com/kollect-it/militaria.jpg',
      },
    ];
  }
}

export default async function ShopPage() {
  const categories = await getCategories();

  return (
    <div>
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
            <Link href="/" className="no-underline">
              <span className="header-logo">
                KOLLECT — IT
              </span>
            </Link>
          </div>

          <div className="header-icons">
            {/* Icons placeholder */}
          </div>
        </div>

        <nav className="main-nav">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>

      {/* Breadcrumbs with Fade-In */}
      <Breadcrumbs
        items={[
          { label: 'Home', href: '/' },
          { label: 'Shop', href: '/shop' },
        ]}
      />

      {/* Page Content */}
      <section className="shop-page">
        <div className="container">
          {/* Animated Headline */}
          <div className="shop-intro text-center mb-[clamp(3rem,6vw,5rem)]">
            <p className="section-subtitle" data-reveal>EXPERTLY CURATED COLLECTIONS</p>
            <h1 className="section-title-main" data-reveal data-reveal-delay="100">Shop by Category</h1>
            <p className="max-w-[700px] mx-auto text-base leading-[1.7] text-[var(--color-gray-dark)]" data-reveal data-reveal-delay="200">
              Discover authenticated art pieces, rare books, collectibles, and historical artifacts
              curated for discerning collectors who insist on quality and character.
            </p>
          </div>

          {/* Category Grid with Hover Lift */}
          <div className="category-grid-new">
            {categories.map((category) => (
              <Link key={category.id} href={`/category/${category.slug}`} className="category-card shop-category-tile">
                <div className="category-image">
                  <img src={category.image} alt={category.name} />
                </div>
                <div className="category-description">
                  <h4>{category.name.toUpperCase()}</h4>
                  <p>{category.description}</p>
                </div>
                <div className="category-card-overlay-cta">
                  <span className="category-cta-text">Explore Collection</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-col">
              <h3>About</h3>
              <p>
                Kollect-It offers inspiring antiques and collectibles for modern collectors who
                insist on quality and character.
              </p>
            </div>
            <div className="footer-col">
              <h3>Quick Links</h3>
              <ul>
                <li><Link href="/shop">Shop</Link></li>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; Kollect-It {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

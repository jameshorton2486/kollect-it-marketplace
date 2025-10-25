import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import Header from '@/components/Header';
import AddToCartButton from '@/components/AddToCartButton';

export const revalidate = 60; // Revalidate every 60 seconds

async function getLatestProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { status: 'active' },
      include: {
        images: {
          orderBy: { order: 'asc' },
          take: 1,
        },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });

    return products;
  } catch (error) {
    console.log('Database not available, using fallback data');
    return [];
  }
}

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
        description: 'Authenticated art pieces spanning various periods and mediums',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&q=80',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        name: 'Antique Books',
        slug: 'antique-books',
        description: 'Scarce first editions and literary treasures',
        image: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=800&q=80',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        name: 'Collectibles',
        slug: 'collectibles',
        description: 'Rare memorabilia and unique ephemera',
        image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=800&q=80',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        name: 'Militaria',
        slug: 'militaria',
        description: 'Historical artifacts with documented provenance',
        image: 'https://ext.same-assets.com/kollect-it/militaria.jpg',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}

export default async function HomePage() {
  const [latestProducts, categories] = await Promise.all([
    getLatestProducts(),
    getCategories(),
  ]);

  // Structured data for SEO
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://kollect-it.com"
      }
    ]
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kollect-It",
    "description": "Authenticated art pieces, rare books, collectibles, and historical artifacts for discerning collectors.",
    "url": "https://kollect-it.com",
    "logo": "https://kollect-it.com/favicon.svg",
    "sameAs": [
      "https://www.instagram.com/kollect-it",
      "https://www.facebook.com/kollect-it"
    ]
  };

  return (
    <div>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      {/* Announcement Bar */}
      <div className="announcement-bar">
        <div className="announcement-content">
          <span>ARE YOU A MEMBER OF THE TRADE? REGISTER YOUR ACCOUNT HERE</span>
        </div>
      </div>

      {/* Header with Search */}
      <Header categories={categories} />

      {/* Hero Section with Parallax Background */}
      <section className="hero-slider parallax-hero">
        <div
          className="parallax-bg"
          style={{ backgroundImage: 'url(https://ext.same-assets.com/1263486869/2808176545.jpeg)' }}
          data-parallax
        />
        <div className="hero-slide active">
          <div className="hero-content">
            <h1 className="brand-wordmark" data-reveal data-reveal-delay="80">
              Kollect-It
            </h1>
            <p className="hero-subtitle">CURATED COLLECTIONS</p>
            <h2 className="hero-title">Discover History</h2>
            <Link href="#latest" className="btn-secondary cta-pulse">
              EXPLORE LATEST ARRIVALS
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Counter Bar */}
      <section style={{ background: 'var(--color-cream)', padding: '3rem 0' }}>
        <div className="container">
          <div className="counter-section">
            <div className="counter-item">
              <span className="counter-number" data-count="25">0</span>
              <span className="counter-label">Years of Collecting</span>
            </div>
            <div className="counter-item">
              <span className="counter-number" data-count="5000">0</span>
              <span className="counter-label">Curated Items</span>
            </div>
            <div className="counter-item">
              <span className="counter-number" data-count="1200">0</span>
              <span className="counter-label">Verified Sellers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Arrivals Section - DYNAMICALLY UPDATED */}
      <section id="latest" className="new-arrivals">
        <div className="container">
          <div className="product-grid product-grid-featured">
            {latestProducts.map((product) => (
              <div key={product.id} className="product-card-category">
                <Link href={`/product/${product.slug}`} className="product-card-link">
                  <div className="product-card-image">
                    {product.images[0] ? (
                      <img src={product.images[0].url} alt={product.title} />
                    ) : (
                      <div className="product-card-placeholder">No Image</div>
                    )}
                  </div>
                  <div className="product-card-info">
                    <p className="product-card-category">{product.category.name}</p>
                    <h3 className="product-card-title">{product.title}</h3>
                    <p className="product-card-price">${product.price.toLocaleString()}</p>
                  </div>
                </Link>
                <AddToCartButton
                  variant="card"
                  product={{
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    slug: product.slug,
                    image: product.images[0]?.url || '/placeholder.jpg',
                    categoryName: product.category.name,
                  }}
                />
              </div>
            ))}
          </div>

          {latestProducts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                No products available yet. Add products from the{' '}
                <Link href="/admin/dashboard" className="text-amber-600 hover:underline">
                  admin dashboard
                </Link>
                .
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Category Grid with Auto-Carousel on Mobile */}
      <section className="category-section">
        <div className="container">
          <p className="section-subtitle">EXPERTLY CURATED COLLECTIONS</p>
          <h2 className="section-title-main">Shop by Category</h2>

          <div className="auto-carousel">
            <div className="category-grid-new">
              {categories.map((category) => (
                <Link key={category.id} href={`/category/${category.slug}`} className="category-card">
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
        </div>
      </section>

      {/* Trust Icons with Staggered Reveal */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-icons">
            <div className="trust-icon-item">
              <div className="trust-icon-wrapper">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <p className="trust-icon-label">SSL Secure Checkout</p>
            </div>
            <div className="trust-icon-item">
              <div className="trust-icon-wrapper">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
              </div>
              <p className="trust-icon-label">Expert Valuation Guaranteed</p>
            </div>
            <div className="trust-icon-item">
              <div className="trust-icon-wrapper">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="9" y1="15" x2="15" y2="15" />
                  <line x1="9" y1="11" x2="15" y2="11" />
                </svg>
              </div>
              <p className="trust-icon-label">Certificate of Authenticity</p>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Divider */}
      <div className="container">
        <div className="animated-divider"></div>
      </div>

      {/* Mission Section */}
      <section className="about">
        <div className="container">
          <p className="section-subtitle" data-reveal>CURATED, AUTHENTICATED, COLLECTED.</p>
          <h2 className="section-title" data-reveal data-reveal-delay="100">
            Personal Interior Expressions for Inspired Living – Kollect-It offers unique art
            and historic treasures for modern collectors who insist on quality and character.
          </h2>
        </div>
      </section>

      {/* Newsletter Section with CTA Pulse */}
      <section className="newsletter">
        <div className="container">
          <p className="newsletter-subtitle">STAY IN THE LOOP</p>
          <h2 className="newsletter-title">Curious What Comes Next?</h2>
          <p className="newsletter-offer">+ get 15% off your first product!</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit" className="btn-primary cta-pulse">
              SUBSCRIBE
            </button>
          </form>
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
              <p>
                <em>Curated and authenticated by the Kollect-It team.</em>
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
                <li>
                  <a href="#">Instagram</a>
                </li>
                <li>
                  <a href="#">YouTube</a>
                </li>
                <li>
                  <a href="#">Facebook</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>

            <div className="footer-col">
              <h3>Support</h3>
              <ul>
                <li>
                  <Link href="/admin/login">Admin Login</Link>
                </li>
                <li>
                  <a href="#">FAQs</a>
                </li>
                <li>
                  <a href="#">About</a>
                </li>
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

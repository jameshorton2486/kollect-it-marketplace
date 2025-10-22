import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import CartIcon from '@/components/CartIcon';
import AddToCartButton from '@/components/AddToCartButton';
import UserAccountDropdown from '@/components/UserAccountDropdown';

export const revalidate = 60; // Revalidate every 60 seconds

async function getLatestProducts() {
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
}

async function getCategories() {
  return await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });
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

      {/* Hero Section */}
      <section className="hero-slider">
        <div className="hero-slide active">
          <img src="https://ext.same-assets.com/1263486869/2808176545.jpeg" alt="Kollect-It Collection" />
          <div className="hero-content">
            <p className="hero-subtitle">CURATED COLLECTIONS</p>
            <h1 className="hero-title">Discover History</h1>
            <Link href="#latest" className="btn-secondary">
              EXPLORE LATEST ARRIVALS
            </Link>
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

      {/* Category Grid */}
      <section className="category-section">
        <div className="container">
          <p className="section-subtitle">EXPERTLY CURATED COLLECTIONS</p>
          <h2 className="section-title-main">Shop by Category</h2>

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
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <section className="trust-strip">
        <div className="container">
          <div className="trust-pills">
            <span>Authenticated</span>
            <span>Expert-Curated</span>
            <span>Transparent Pricing</span>
            <span>Insured Shipping</span>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <p className="section-subtitle">CURATED, AUTHENTICATED, COLLECTED.</p>
          <h2 className="section-title">
            Personal Interior Expressions for Inspired Living – Kollect-It offers unique art
            and historic treasures for modern collectors who insist on quality and character.
          </h2>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter">
        <div className="container">
          <p className="newsletter-subtitle">STAY IN THE LOOP</p>
          <h2 className="newsletter-title">Curious What Comes Next?</h2>
          <p className="newsletter-offer">+ get 15% off your first product!</p>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" required />
            <button type="submit" className="btn-primary">
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

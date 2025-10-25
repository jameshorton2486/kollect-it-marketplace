import Link from 'next/link';
import CartIcon from './CartIcon';
import UserAccountDropdown from './UserAccountDropdown';

interface HeaderProps {
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export default function Header({ categories = [] }: HeaderProps) {
  return (
    <header className="header">
      {/* Top bar with centered logo */}
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

      {/* Main Navigation */}
      <nav className="main-nav">
        <Link href="/">Home</Link>
        {categories.length > 0 ? (
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
        ) : (
          <Link href="/shop">Shop</Link>
        )}
        <Link href="/about">About Us</Link>
        <Link href="/contact">Contact</Link>
      </nav>

      {/* Centered Search Bar */}
      <div className="site-search-wrap" role="search" aria-label="Site search">
        <form action="/search" method="GET" className="site-search">
          <input
            type="search"
            name="q"
            placeholder="Search artworks, books, militaria…"
            aria-label="Search"
            autoComplete="off"
          />
        </form>
      </div>
    </header>
  );
}

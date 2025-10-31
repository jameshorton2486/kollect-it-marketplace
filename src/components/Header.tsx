"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { transformCloudinary } from "@/lib/image";
import CartIcon from "./CartIcon";
import UserAccountDropdown from "./UserAccountDropdown";
import {
  Menu,
  X,
  Search as SearchIcon,
  ChevronDown,
  Palette,
  Book,
  Gem,
  Shield,
} from "lucide-react";

interface ProductResult {
  id: string;
  title: string;
  slug: string;
  images: { url: string }[];
}

interface HeaderProps {
  categories?: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export default function Header({ categories = [] }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [catOpen, setCatOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ProductResult[]>([]);
  const [loading, setLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const getCategoryIcon = (slug?: string, name?: string) => {
    const key = (slug || name || "").toLowerCase();
    if (key.includes("art"))
      return <Palette size={16} className="text-ink-secondary" />;
    if (key.includes("book"))
      return <Book size={16} className="text-ink-secondary" />;
    if (key.includes("militar"))
      return <Shield size={16} className="text-ink-secondary" />;
    return <Gem size={16} className="text-ink-secondary" />; // Collectibles / default
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSearchOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }
    setLoading(true);
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/products?q=${encodeURIComponent(query)}&limit=8`,
          {
            signal: controller.signal,
          },
        );
        if (!res.ok) throw new Error("Failed");
        const data = await res.json();
        setResults(data as ProductResult[]);
      } catch (_) {
        // ignore
      } finally {
        setLoading(false);
      }
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <header
      className={`sticky top-0 z-50 bg-white border-b border-border-neutral transition-[box-shadow,height] ${scrolled ? "shadow-sm" : ""}`}
    >
      {/* Top bar */}
      <div className="hidden md:block border-b border-border-neutral">
        <div className="container flex items-center justify-between py-2 text-[13px]">
          <div className="text-ink-secondary">
            {/* Optional announcement if AnnouncementBar not used */}
            <span>Timeless objects, curated with care.</span>
          </div>
          <div className="flex items-center gap-4">
            <select
              aria-label="Currency"
              className="px-2 py-1 border border-border-neutral rounded text-[12px] bg-white"
            >
              <option>USD</option>
              <option>EUR</option>
              <option>GBP</option>
            </select>
            <UserAccountDropdown />
            <CartIcon />
          </div>
        </div>
      </div>

      {/* Main header row */}
      <div className="container flex items-center justify-between py-3 md:py-4">
        {/* Left: mobile menu */}
        <button
          className="md:hidden p-2 -ml-2"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
        >
          <Menu size={22} />
        </button>

        {/* Logo */}
        <div className="flex-1 md:flex-none text-center md:text-left">
          <Link href="/" className="no-underline">
            <span className="font-serif tracking-wide text-brand-navy text-[26px] md:text-[28px] leading-none select-none">
              KOLLECT — IT
            </span>
          </Link>
        </div>

        {/* Right icons on mobile */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            className="p-2"
            aria-label="Open search"
            onClick={() => {
              setSearchOpen(true);
            }}
          >
            <SearchIcon size={20} />
          </button>
          <CartIcon />
          <UserAccountDropdown />
        </div>

        {/* Desktop nav and search */}
        <div className="hidden md:flex items-center gap-6">
          {/* Nav */}
          <nav className="flex items-stretch gap-6 text-[14px]">
            {categories.length > 0 ? (
              <div
                className="relative"
                onMouseEnter={() => setCatOpen(true)}
                onMouseLeave={() => setCatOpen(false)}
              >
                <button className="inline-flex items-center gap-1 hover:text-gold-hover">
                  Shop by Category <ChevronDown size={16} />
                </button>
                {catOpen && (
                  <div className="absolute left-0 mt-2 w-[280px] rounded border border-border-neutral bg-white shadow-md">
                    <div className="max-h-[60vh] overflow-auto py-2">
                      {categories.map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/category/${cat.slug}`}
                          className="flex items-center gap-2 px-4 py-2 hover:bg-cream"
                        >
                          <span aria-hidden>
                            {getCategoryIcon(cat.slug, cat.name)}
                          </span>
                          <span>{cat.name}</span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-border-neutral p-2 text-right">
                      <Link href="/shop" className="text-[13px] underline">
                        View All
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/shop" className="hover:text-gold-hover">
                Shop
              </Link>
            )}
            <Link href="/shop?sort=new" className="hover:text-gold-hover">
              Latest Arrivals
            </Link>
            <Link href="/authentication" className="hover:text-gold-hover">
              Authentication Services
            </Link>
            <Link href="/about" className="hover:text-gold-hover">
              About Us
            </Link>
            <Link href="/contact" className="hover:text-gold-hover">
              Contact
            </Link>
          </nav>

          {/* Search */}
          <div className="relative" ref={searchRef}>
            <div
              className={`flex items-center gap-2 border border-border-neutral rounded px-2 py-1 transition-all ${searchOpen ? "w-[360px]" : "w-[220px]"}`}
            >
              <SearchIcon size={18} className="text-ink-secondary" />
              <input
                type="search"
                placeholder="Search products..."
                className="w-full outline-none text-[14px]"
                onFocus={() => setSearchOpen(true)}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
              />
            </div>
            {searchOpen && (query || loading) && (
              <div className="absolute z-10 mt-2 w-[420px] rounded border border-border-neutral bg-white shadow-lg">
                <div className="max-h-[70vh] overflow-auto">
                  {loading && (
                    <div className="p-3 text-[14px] text-ink-secondary">
                      Searching…
                    </div>
                  )}
                  {!loading && results.length === 0 && (
                    <div className="p-3 text-[14px] text-ink-secondary">
                      No results
                    </div>
                  )}
                  {!loading &&
                    results.map((p) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        className="flex items-center gap-3 p-3 hover:bg-cream"
                      >
                        {p.images?.[0]?.url ? (
                          <Image
                            src={transformCloudinary(p.images[0].url, {
                              width: 80,
                              height: 80,
                              crop: "fill",
                              quality: 85,
                            })}
                            alt={p.title}
                            width={40}
                            height={40}
                            className="w-10 h-10 object-cover rounded"
                            quality={85}
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-10 h-10 bg-cream rounded" />
                        )}
                        <span className="text-[14px]">{p.title}</span>
                      </Link>
                    ))}
                </div>
                {results.length > 0 && (
                  <div className="border-t border-border-neutral p-2 text-right">
                    <Link
                      href={`/shop?q=${encodeURIComponent(query)}`}
                      className="text-[13px] underline"
                    >
                      View all results
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile search bar */}
      {searchOpen && (
        <div className="md:hidden border-t border-border-neutral">
          <div className="container py-2">
            <div
              className="flex items-center gap-2 border border-border-neutral rounded px-2 py-1"
              ref={searchRef}
            >
              <SearchIcon size={18} />
              <input
                type="search"
                className="w-full outline-none text-[14px]"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search products"
                autoFocus
              />
              <button
                className="p-1"
                aria-label="Close search"
                onClick={() => setSearchOpen(false)}
              >
                <X size={18} />
              </button>
            </div>
            {(query || loading) && (
              <div className="mt-2 rounded border border-border-neutral bg-white">
                {loading && (
                  <div className="p-3 text-[14px] text-ink-secondary">
                    Searching…
                  </div>
                )}
                {!loading && results.length === 0 && (
                  <div className="p-3 text-[14px] text-ink-secondary">
                    No results
                  </div>
                )}
                {!loading &&
                  results.map((p) => (
                    <Link
                      key={p.id}
                      href={`/product/${p.slug}`}
                      className="flex items-center gap-3 p-3 border-t border-border-neutral"
                    >
                      {p.images?.[0]?.url ? (
                        <Image
                          src={transformCloudinary(p.images[0].url, {
                            width: 80,
                            height: 80,
                            crop: "fill",
                            quality: 85,
                          })}
                          alt={p.title}
                          width={40}
                          height={40}
                          className="w-10 h-10 object-cover rounded"
                          quality={85}
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-cream rounded" />
                      )}
                      <span className="text-[14px]">{p.title}</span>
                    </Link>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[82%] max-w-[340px] bg-white p-4 overflow-y-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="font-serif text-[22px]">Menu</span>
              <button
                className="p-2"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1">
              <div>
                <div className="text-[12px] uppercase tracking-wide text-ink-secondary mb-1">
                  Categories
                </div>
                <div className="flex flex-col">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/category/${cat.slug}`}
                        className="flex items-center gap-2 px-2 py-2 rounded hover:bg-cream"
                        onClick={() => setMobileOpen(false)}
                      >
                        <span aria-hidden>
                          {getCategoryIcon(cat.slug, cat.name)}
                        </span>
                        <span>{cat.name}</span>
                      </Link>
                    ))
                  ) : (
                    <Link
                      href="/shop"
                      className="px-2 py-2 rounded hover:bg-cream"
                      onClick={() => setMobileOpen(false)}
                    >
                      Shop
                    </Link>
                  )}
                </div>
              </div>
              <div className="pt-2">
                <Link
                  href="/shop?sort=new"
                  className="block px-2 py-2 rounded hover:bg-cream"
                  onClick={() => setMobileOpen(false)}
                >
                  Latest Arrivals
                </Link>
                <Link
                  href="/authentication"
                  className="block px-2 py-2 rounded hover:bg-cream"
                  onClick={() => setMobileOpen(false)}
                >
                  Authentication Services
                </Link>
                <Link
                  href="/about"
                  className="block px-2 py-2 rounded hover:bg-cream"
                  onClick={() => setMobileOpen(false)}
                >
                  About Us
                </Link>
                <Link
                  href="/contact"
                  className="block px-2 py-2 rounded hover:bg-cream"
                  onClick={() => setMobileOpen(false)}
                >
                  Contact
                </Link>
              </div>
              <div className="pt-2 border-t border-border-neutral mt-2">
                <div className="text-[12px] uppercase tracking-wide text-ink-secondary mb-1">
                  Account
                </div>
                {/* Reuse account dropdown link target patterns */}
                <Link
                  href="/account"
                  className="block px-2 py-2 rounded hover:bg-cream"
                  onClick={() => setMobileOpen(false)}
                >
                  My Account
                </Link>
                <Link
                  href="/login"
                  className="block px-2 py-2 rounded hover:bg-cream"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="block px-2 py-2 rounded hover:bg-cream"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </div>
            </nav>
          </aside>
        </div>
      )}
    </header>
  );
}

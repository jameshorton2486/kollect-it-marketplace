"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { BLUR_DATA_URL, transformCloudinary } from "@/lib/image";
import { useRouter } from "next/navigation";

interface SearchResultItem {
  id: string;
  title: string;
  slug: string;
  price: number;
  images?: { url: string }[];
  category?: { name: string } | null;
}

interface ApiProduct {
  id: string;
  title: string;
  slug: string;
  price: number;
  images?: { url: string }[];
  category?: { name: string } | null;
}

const DEBOUNCE_MS = 300;
const MAX_RESULTS = 5;

export default function Search() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [open, setOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // recent searches in localStorage
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => {
    try {
      const raw = localStorage.getItem("recent_searches");
      if (raw) setRecent(JSON.parse(raw));
    } catch { /* ignore */ }
  }, []);

  const saveRecent = (q: string) => {
    try {
      const next = [q, ...recent.filter((r) => r !== q)].slice(0, 3);
      setRecent(next);
      localStorage.setItem("recent_searches", JSON.stringify(next));
    } catch { /* ignore */ }
  };

  // Debounced search
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/products?q=${encodeURIComponent(query)}&limit=${MAX_RESULTS}`);
        const data: ApiProduct[] = await res.json();
        const mapped: SearchResultItem[] = (data || []).slice(0, MAX_RESULTS).map((p) => ({
          id: p.id,
          title: p.title,
          slug: p.slug,
          price: p.price,
          images: p.images,
          category: p.category ?? null,
        }));
        setResults(mapped);
      } catch (e) {
        setResults([]);
      } finally {
        setLoading(false);
        setOpen(true);
      }
    }, DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [query]);

  // Close on outside click or ESC
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    saveRecent(q);
    setOpen(false);
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  const clear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
    inputRef.current?.focus();
  };

  const showRecent = open && query.trim().length === 0 && recent.length > 0;

  return (
    <div className="relative" ref={boxRef}>
      <form onSubmit={handleSubmit} role="search" aria-label="Site search" className="flex items-center">
        <div className={`flex w-full items-center gap-2 rounded border px-3 py-2 bg-white focus-within:border-[#C9A66B] focus-within:ring-1 focus-within:ring-[#C9A66B]`}>
          {/* Magnifying glass */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-gray-dark)]">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="search"
            placeholder="Search products..."
            className="w-full bg-transparent outline-none placeholder:text-[var(--color-gray)]"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
            onFocus={() => setOpen(true)}
          />
          {query && (
            <button type="button" onClick={clear} aria-label="Clear search" className="rounded p-1 hover:text-brand-gold">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>
      </form>

      {/* Dropdown */}
      {open && (
        <div id="search-dropdown" className="absolute z-50 mt-2 w-[420px] max-w-[90vw] rounded border border-[var(--color-gray-light)] bg-white p-2 shadow-md" aria-label="Search results">
          {/* Recent searches */}
          {showRecent && (
            <div className="p-2">
              <div className="mb-1 text-xs text-[var(--color-gray-dark)]">Recent searches</div>
              <ul className="space-y-1">
                {recent.map((r) => (
                  <li key={r}>
                    <button
                      className="w-full rounded px-2 py-1 text-left hover:bg-[var(--color-gray-ultra-light)]"
                      onClick={() => { setQuery(r); setOpen(false); router.push(`/shop?q=${encodeURIComponent(r)}`); }}
                    >
                      {r}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Loading */}
          {query.trim().length >= 2 && loading && (
            <div className="flex items-center gap-2 p-3 text-sm">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" className="opacity-20"/>
                <path d="M22 12a10 10 0 0 1-10 10" />
              </svg>
              <span>Searching...</span>
            </div>
          )}

          {/* Results */}
          {query.trim().length >= 2 && !loading && results.length > 0 && (
            <ul className="max-h-80 space-y-1 overflow-auto">
              {results.map((p) => {
                const raw = p.images?.[0]?.url || "/placeholder.jpg";
                const img = raw.startsWith('http') ? transformCloudinary(raw, { width: 80, height: 80, crop: 'fill', quality: 85 }) : raw;
                return (
                  <li key={p.id}>
                    <Link
                      href={`/product/${p.slug}`}
                      className="flex items-center gap-3 rounded px-2 py-2 hover:bg-[var(--color-gray-ultra-light)]"
                      onClick={() => { saveRecent(query.trim()); setOpen(false); }}
                    >
                      <Image src={img} alt={`${p.title} thumbnail`} width={40} height={40} className="h-10 w-10 rounded object-cover" quality={85} loading="lazy" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate font-medium text-brand-navy">{p.title}</div>
                        <div className="truncate text-[11px] uppercase tracking-wide text-brand-gold">{p.category?.name ?? ""}</div>
                      </div>
                      <div className="shrink-0 text-[14px] font-semibold text-brand-gold">${p.price.toLocaleString()}</div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}

          {/* No results */}
          {query.trim().length >= 2 && !loading && results.length === 0 && (
            <div className="p-3 text-sm text-[var(--color-gray-dark)]">
              <div className="font-medium text-brand-navy">No products found</div>
              <div>Try different keywords</div>
            </div>
          )}

          {/* View all link */}
          {query.trim().length >= 2 && (
            <div className="mt-2 border-t border-[var(--color-gray-ultra-light)] pt-2">
              <Link
                href={`/shop?q=${encodeURIComponent(query.trim())}`}
                className="block rounded px-2 py-2 text-center text-sm text-brand-gold hover:bg-[var(--color-gray-ultra-light)]"
                onClick={() => { saveRecent(query.trim()); setOpen(false); }}
              >
                View all results for "{query.trim()}"
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

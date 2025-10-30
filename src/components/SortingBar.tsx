'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface SortingBarProps {
  showing: number;
  total: number;
  currentSort?: string;
  currentView?: 'grid' | 'list';
}

export default function SortingBar({ showing, total, currentSort, currentView = 'grid' }: SortingBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Price (Low-High)' },
    { value: 'price-desc', label: 'Price (High-Low)' },
    { value: 'title', label: 'A-Z' },
  ];

  const updateParam = (key: string, val?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (!val || val === 'featured') params.delete(key);
    else params.set(key, val);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border-neutral pb-3 mb-6">
      <div className="text-xs tracking-wider uppercase text-ink-secondary">
        Showing {showing} of {total} products
      </div>

      <div className="flex items-center gap-3">
        <label htmlFor="sort" className="text-xs tracking-wider uppercase text-ink-secondary">Sort by</label>
        <select
          id="sort"
          className="rounded border border-border-neutral bg-white px-2 py-1 text-sm"
          value={currentSort || 'featured'}
          onChange={(e) => updateParam('sort', e.target.value)}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <div className="ml-2 hidden md:flex items-center gap-1" role="group" aria-label="View toggle">
          <button
            className={`rounded border px-2 py-1 text-sm ${currentView === 'grid' ? 'border-brand-gold text-brand-navy' : 'border-border-neutral'}`}
            onClick={() => updateParam('view', 'grid')}
          >Grid</button>
          <button
            className={`rounded border px-2 py-1 text-sm ${currentView === 'list' ? 'border-brand-gold text-brand-navy' : 'border-border-neutral'}`}
            onClick={() => updateParam('view', 'list')}
          >List</button>
        </div>
      </div>
    </div>
  );
}

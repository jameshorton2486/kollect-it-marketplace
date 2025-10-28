"use client";

import { useEffect, useMemo, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

interface CategoryFiltersProps {
  minPrice?: number;
  maxPrice?: number;
}

const CONDITIONS = ["Fine", "Very Good", "Good", "Fair"] as const;

type Condition = typeof CONDITIONS[number];

export default function CategoryFilters({ minPrice = 0, maxPrice = 10000 }: CategoryFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Local UI state sourced from URL
  const [priceMin, setPriceMin] = useState<number>(Number(searchParams.get("priceMin")) || minPrice);
  const [priceMax, setPriceMax] = useState<number>(Number(searchParams.get("priceMax")) || maxPrice);
  const [yearMin, setYearMin] = useState<number | "">(Number(searchParams.get("yearMin")) || "");
  const [yearMax, setYearMax] = useState<number | "">(Number(searchParams.get("yearMax")) || "");
  const selectedConds = useMemo<Set<Condition>>(() => {
    const raw = searchParams.getAll("cond");
    return new Set(raw.filter((v): v is Condition => CONDITIONS.includes(v as Condition)));
  }, [searchParams]);
  const [conds, setConds] = useState<Set<Condition>>(selectedConds);

  useEffect(() => {
    setConds(selectedConds);
    // Keep price/year in sync when location changes elsewhere
    setPriceMin(Number(searchParams.get("priceMin")) || minPrice);
    setPriceMax(Number(searchParams.get("priceMax")) || maxPrice);
    setYearMin(Number(searchParams.get("yearMin")) || "");
    setYearMax(Number(searchParams.get("yearMax")) || "");
  }, [searchParams, minPrice, maxPrice, selectedConds]);

  const apply = () => {
    const params = new URLSearchParams(searchParams.toString());
    // Price
    if (priceMin && priceMin !== minPrice) params.set("priceMin", String(priceMin)); else params.delete("priceMin");
    if (priceMax && priceMax !== maxPrice) params.set("priceMax", String(priceMax)); else params.delete("priceMax");
    // Year range
    if (yearMin !== "" ) params.set("yearMin", String(yearMin)); else params.delete("yearMin");
    if (yearMax !== "" ) params.set("yearMax", String(yearMax)); else params.delete("yearMax");
    // Conditions (multiple)
    params.delete("cond");
    Array.from(conds).forEach((c) => params.append("cond", c));

    // Reset to first page when filters change
    params.delete("page");

    router.push(`${pathname}?${params.toString()}`);
  };

  const clearAll = () => {
    const params = new URLSearchParams(searchParams.toString());
    ["priceMin","priceMax","yearMin","yearMax","cond","page"].forEach((k) => params.delete(k));
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <aside className="hidden lg:block w-64 shrink-0">
      <div className="sticky top-24 space-y-6">
        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-charcoal)]">Price</div>
          <div className="flex items-center gap-2">
            <input type="number" className="w-20 rounded border border-[var(--color-border)] px-2 py-1 text-sm" value={priceMin}
                   min={0}
                   onChange={(e)=> setPriceMin(Math.max(0, Number(e.target.value) || 0))} aria-label="Min price" />
            <span>–</span>
            <input type="number" className="w-20 rounded border border-[var(--color-border)] px-2 py-1 text-sm" value={priceMax}
                   min={0}
                   onChange={(e)=> setPriceMax(Math.max(0, Number(e.target.value) || 0))} aria-label="Max price" />
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-charcoal)]">Condition</div>
          <div className="space-y-1">
            {CONDITIONS.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={conds.has(c)}
                  onChange={(e)=>{
                    const next = new Set(conds);
                    if (e.target.checked) next.add(c); else next.delete(c);
                    setConds(next);
                  }}
                />
                <span>{c}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs uppercase tracking-wider text-[var(--color-charcoal)]">Year</div>
          <div className="flex items-center gap-2">
            <input type="number" className="w-20 rounded border border-[var(--color-border)] px-2 py-1 text-sm" value={yearMin as number | ""}
                   min={0}
                   onChange={(e)=> setYearMin(Number(e.target.value) || "")} aria-label="Min year" />
            <span>–</span>
            <input type="number" className="w-20 rounded border border-[var(--color-border)] px-2 py-1 text-sm" value={yearMax as number | ""}
                   min={0}
                   onChange={(e)=> setYearMax(Number(e.target.value) || "")} aria-label="Max year" />
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={apply} className="btn-cta">Apply Filters</button>
          <button onClick={clearAll} className="rounded border border-[var(--color-border)] px-3 py-2 text-sm">Clear All</button>
        </div>
      </div>
    </aside>
  );
}

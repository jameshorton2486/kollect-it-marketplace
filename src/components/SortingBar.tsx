'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface SortingBarProps {
  productCount: number;
  currentSort?: string;
}

export default function SortingBar({ productCount, currentSort }: SortingBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const sortOptions = [
    { value: 'featured', label: 'Featured' },
    { value: 'newest', label: 'Newest' },
    { value: 'price-asc', label: 'Low to High' },
    { value: 'price-desc', label: 'High to Low' },
    { value: 'title', label: 'A-Z' },
  ];

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', value);
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div style={{
      padding: 'var(--space-3) 0',
      borderBottom: 'var(--border)',
      marginBottom: 'var(--space-4)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: 'var(--space-2)'
    }}>
      <div>
        <span style={{
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--charcoal)',
          fontWeight: 300
        }}>
          {productCount} {productCount === 1 ? 'Product' : 'Products'}
        </span>
      </div>

      <div style={{
        display: 'flex',
        gap: 'var(--space-2)',
        alignItems: 'center'
      }}>
        <span style={{
          fontSize: '11px',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: 'var(--charcoal)',
          fontWeight: 300
        }}>
          Sort:
        </span>
        {sortOptions.map((option, index) => (
          <span key={option.value}>
            <button
              onClick={() => handleSortChange(option.value)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '11px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--charcoal)',
                fontWeight: (currentSort || 'featured') === option.value ? 400 : 300,
                textDecoration: (currentSort || 'featured') === option.value ? 'underline' : 'none',
                cursor: 'pointer',
                transition: 'opacity 0.15s ease',
                padding: 0
              }}
              onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
              onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
            >
              {option.label}
            </button>
            {index < sortOptions.length - 1 && (
              <span style={{ margin: '0 0.5rem', color: 'var(--charcoal)', opacity: 0.3 }}>|</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

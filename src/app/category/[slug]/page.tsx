import { Metadata } from 'next';
import type { Prisma } from '@prisma/client';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductGrid from '@/components/ProductGrid';
import CategoryHero from '@/components/CategoryHero';
import SortingBar from '@/components/SortingBar';
import Breadcrumbs from '@/components/Breadcrumbs';
import CategoryFilters from '@/components/CategoryFilters';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    sort?: string;
    view?: 'grid' | 'list';
    priceMin?: string;
    priceMax?: string;
    cond?: string | string[];
    yearMin?: string;
    yearMax?: string;
    page?: string;
  }>;
}

export const revalidate = 60; // Revalidate every 60 seconds

async function getCategoryWithProducts(slug: string, sortBy?: string, filters?: {
  priceMin?: number;
  priceMax?: number;
  cond?: string[];
}) {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) return null;

  // Build orderBy based on sort parameter
  let orderBy:
    | { price: 'asc' | 'desc' }
    | { createdAt: 'asc' | 'desc' }
    | { title: 'asc' }
    | Array<{ featured: 'desc' } | { createdAt: 'desc' }> = { createdAt: 'desc' }; // default

  switch (sortBy) {
    case 'price-asc':
      orderBy = { price: 'asc' };
      break;
    case 'price-desc':
      orderBy = { price: 'desc' };
      break;
    case 'newest':
      orderBy = { createdAt: 'desc' };
      break;
    case 'oldest':
      orderBy = { createdAt: 'asc' };
      break;
    case 'title':
      orderBy = { title: 'asc' };
      break;
    default:
      orderBy = [{ featured: 'desc' }, { createdAt: 'desc' }];
  }

  const where: Prisma.ProductWhereInput = {
    categoryId: category.id,
    status: 'active',
  };
  if (filters?.priceMin != null || filters?.priceMax != null) {
    const priceFilter: Prisma.FloatFilter = {};
    if (filters?.priceMin != null) priceFilter.gte = filters.priceMin;
    if (filters?.priceMax != null) priceFilter.lte = filters.priceMax;
    where.price = priceFilter;
  }
  if (filters?.cond && filters.cond.length > 0) where.condition = { in: filters.cond };

  const products = await prisma.product.findMany({
    where,
    include: {
      images: {
        orderBy: { order: 'asc' },
        take: 1,
      },
      category: true,
    },
    orderBy,
  });

  return { category, products };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryWithProducts(slug);

  if (!data) {
    return {
      title: 'Category Not Found',
    };
  }

  const { category, products } = data;

  return {
    title: `${category.name} - Kollect-It`,
    description: category.description,
    openGraph: {
      title: `${category.name} - Kollect-It`,
      description: category.description,
      images: [category.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} - Kollect-It`,
      description: category.description || undefined,
      images: [category.image],
    },
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { sort, view, priceMin, priceMax, cond, yearMin, yearMax, page } = await searchParams;

  // Parse filters
  const priceMinNum = priceMin ? Number(priceMin) : undefined;
  const priceMaxNum = priceMax ? Number(priceMax) : undefined;
  const condArr = Array.isArray(cond) ? cond : cond ? [cond] : [];
  const yearMinNum = yearMin ? Number(yearMin) : undefined;
  const yearMaxNum = yearMax ? Number(yearMax) : undefined;
  const currentPage = Math.max(1, Number(page) || 1);
  const pageSize = 12;

  const data = await getCategoryWithProducts(slug, sort, {
    priceMin: priceMinNum,
    priceMax: priceMaxNum,
    cond: condArr,
  });

  if (!data) {
    notFound();
  }

  const { category, products } = data;

  // Apply year filter (string field) in memory
  const yearFiltered = products.filter((p) => {
    if (yearMinNum == null && yearMaxNum == null) return true;
    const y = p.year ? parseInt(p.year, 10) : NaN;
    if (Number.isNaN(y)) return false;
    if (yearMinNum != null && y < yearMinNum) return false;
    if (yearMaxNum != null && y > yearMaxNum) return false;
    return true;
  });

  const totalFiltered = yearFiltered.length;
  const start = (currentPage - 1) * pageSize;
  const end = start + pageSize;
  const pagedProducts = yearFiltered.slice(start, end);
  const totalPages = Math.max(1, Math.ceil(totalFiltered / pageSize));

  // Compute min/max price for filters (across category active products)
  const priceAgg = await prisma.product.aggregate({
    where: { categoryId: category.id, status: 'active' },
    _min: { price: true },
    _max: { price: true },
  });
  const minPriceVal = priceAgg._min.price ?? 0;
  const maxPriceVal = priceAgg._max.price ?? 10000;
  const currView: 'grid' | 'list' = view === 'list' ? 'list' : 'grid';

  // JSON-LD Schema for SEO
  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'Home',
        'item': 'https://kollect-it.com'
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': category.name,
        'item': `https://kollect-it.com/category/${category.slug}`
      }
    ]
  };

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `https://kollect-it.com/category/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: products.length,
      itemListElement: products.map((product, index) => ({
        '@type': 'Product',
        position: index + 1,
        name: product.title,
        description: product.description,
        image: product.images[0]?.url,
        offers: {
          '@type': 'Offer',
          price: product.price,
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      })),
    },
  };

  return (
    <>
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

  <div className="category-page">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: category.name, href: `/category/${category.slug}` },
          ]}
        />

        {/* Hero Section */}
        <CategoryHero
          title={category.name}
          description={category.description}
          backgroundImage={category.image}
          productCount={products.length}
        />

        {/* Main Content */}
        <div className="category-content">
          <div className="container">
            <div className="flex gap-6">
              {/* Filtering Sidebar (desktop) */}
              <CategoryFilters minPrice={minPriceVal} maxPrice={maxPriceVal} />

              <div className="flex-1">
                {/* Sorting Bar */}
                <SortingBar showing={pagedProducts.length} total={totalFiltered} currentSort={sort} currentView={currView} />

                {/* Product Grid */}
                {pagedProducts.length > 0 ? (
                  <ProductGrid products={pagedProducts} view={currView} />
                ) : (
                  <div className="no-products text-center py-16">
                    <h3 className="font-serif text-brand-navy text-2xl">Nothing found here</h3>
                    <p className="mt-2 text-[var(--color-charcoal)]">Try adjusting filters or browse all products.</p>
                    <Link href="/" className="btn-cta mt-4 inline-block">Browse All Products</Link>
                  </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }).map((_, i) => {
                      const params = new URLSearchParams();
                      if (sort) params.set('sort', sort);
                      if (currView) params.set('view', currView);
                      if (priceMinNum != null) params.set('priceMin', String(priceMinNum));
                      if (priceMaxNum != null) params.set('priceMax', String(priceMaxNum));
                      if (yearMinNum != null) params.set('yearMin', String(yearMinNum));
                      if (yearMaxNum != null) params.set('yearMax', String(yearMaxNum));
                      condArr.forEach((c) => params.append('cond', c));
                      params.set('page', String(i + 1));
                      const href = `?${params.toString()}`;
                      const isActive = i + 1 === currentPage;
                      return (
                        <Link key={i} href={href} className={`rounded border px-3 py-2 text-sm ${isActive ? 'border-brand-gold text-brand-navy' : 'border-[var(--color-border)]'}`}>
                          {i + 1}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
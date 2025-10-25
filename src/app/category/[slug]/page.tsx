import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import ProductGrid from '@/components/ProductGrid';
import CategoryHero from '@/components/CategoryHero';
import SortingBar from '@/components/SortingBar';
import Breadcrumbs from '@/components/Breadcrumbs';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export const revalidate = 60; // Revalidate every 60 seconds

async function getCategoryWithProducts(slug: string, sortBy?: string) {
  const category = await prisma.category.findUnique({
    where: { slug },
  });

  if (!category) return null;

  // Build orderBy based on sort parameter
  let orderBy:
    | { price: 'asc' | 'desc' }
    | { createdAt: 'asc' | 'desc' }
    | { title: 'asc' }
    | { featured: 'desc'; createdAt: 'desc' } = { createdAt: 'desc' }; // default

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
      orderBy = { featured: 'desc', createdAt: 'desc' };
  }

  const products = await prisma.product.findMany({
    where: {
      categoryId: category.id,
      status: 'active',
    },
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
  };
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { sort } = await searchParams;

  const data = await getCategoryWithProducts(slug, sort);

  if (!data) {
    notFound();
  }

  const { category, products } = data;

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
            {/* Sorting Bar */}
            <SortingBar productCount={products.length} currentSort={sort} />

            {/* Product Grid */}
            {products.length > 0 ? (
              <ProductGrid products={products} />
            ) : (
              <div className="no-products">
                <h3>No products available in this category yet.</h3>
                <p>Check back soon for new arrivals!</p>
                <Link href="/" className="btn-primary">
                  Browse All Products
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

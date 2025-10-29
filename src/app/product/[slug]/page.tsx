import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Breadcrumbs from '@/components/Breadcrumbs';
import dynamic from 'next/dynamic';
import ClientProductLayout from '@/components/product/ClientProductLayout';
const ImageGallery = dynamic(() => import('@/components/product/ImageGallery'));
const ProductInfo = dynamic(() => import('@/components/product/ProductInfo'));
const ProductTabs = dynamic(() => import('@/components/product/ProductTabs'));
const RelatedProducts = dynamic(() => import('@/components/product/RelatedProducts'));

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

async function getProductBySlug(slug: string) {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: {
        orderBy: { order: 'asc' },
      },
      category: true,
    },
  });

  if (!product) return null;

  // Get related products from same category
  const relatedProducts = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      status: 'active',
      id: { not: product.id },
    },
    include: {
      images: {
        orderBy: { order: 'asc' },
        take: 1,
      },
      category: true,
    },
  take: 6,
    orderBy: {
      createdAt: 'desc',
    },
  });

  return { product, relatedProducts };
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getProductBySlug(slug);

  if (!data) {
    return {
      title: 'Product Not Found',
    };
  }

  const { product } = data;

  return {
    title: `${product.title} - Kollect-It`,
    description: product.description,
    openGraph: {
      title: product.title,
      description: product.description,
      images: product.images.map((img) => img.url),
    },
    twitter: {
      card: 'summary_large_image',
      title: product.title,
      description: product.description || undefined,
      images: product.images.slice(0, 1).map((i) => i.url),
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const data = await getProductBySlug(slug);

  if (!data) {
    notFound();
  }

  const { product, relatedProducts } = data;

  // Generate SKU from product ID
  const sku = `KI-${product.id.substring(0, 8).toUpperCase()}`;

  // Breadcrumb Schema for SEO
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
        'name': product.category.name,
        'item': `https://kollect-it.com/category/${product.category.slug}`
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': product.title,
        'item': `https://kollect-it.com/product/${product.slug}`
      }
    ]
  };

  // Product Schema for SEO - Enhanced with additionalProperty
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.images.map((img) => img.url),
    sku: sku,
    brand: {
      '@type': 'Brand',
      name: 'Kollect-It',
    },
    additionalProperty: [
      ...(product.category?.name ? [{
        '@type': 'PropertyValue',
        name: 'Category',
        value: product.category.name
      }] : []),
      ...(product.condition ? [{
        '@type': 'PropertyValue',
        name: 'Condition',
        value: product.condition
      }] : []),
    ],
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
      url: `https://kollect-it.com/product/${product.slug}`,
      seller: {
        '@type': 'Organization',
        name: 'Kollect-It',
      },
    },
    category: product.category.name,
    ...(product.condition && { itemCondition: `https://schema.org/UsedCondition` }),
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

      <div className="product-page">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: 'Home', href: '/' },
            { label: product.category.name, href: `/category/${product.category.slug}` },
            { label: product.title, href: `/product/${product.slug}` },
          ]}
        />

        {/* Main Product Section */}
        <div className="product-main section-spacing">
          <div className="container">
            <div className="product-layout">
              {/* Image Gallery */}
              <ImageGallery images={product.images} title={product.title} />

              {/* Product Info */}
              <ProductInfo product={product} sku={sku} />
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <ProductTabs product={product} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <RelatedProducts products={relatedProducts} categoryName={product.category.name} />
        )}

        {/* Client-only sticky cart bar via wrapper */}
        <ClientProductLayout product={{ title: product.title, price: product.price }}>
          {/* no additional client-only content here; StickyCartBar is injected within the wrapper */}
        </ClientProductLayout>
      </div>
    </>
  );
}

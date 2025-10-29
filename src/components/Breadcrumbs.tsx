import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <div className="container">
        {/* JSON-LD BreadcrumbList for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: items.map((item, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: item.label,
                item: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://kollect-it.com'}${item.href}`,
              })),
            }),
          }}
        />
        <ol>
          {items.map((item, index) => (
            <li key={item.href} {...(index === items.length - 1 ? { 'aria-current': 'page' } : {})}>
              {index < items.length - 1 ? (
                <Link href={item.href}>{item.label}</Link>
              ) : (
                item.label
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}

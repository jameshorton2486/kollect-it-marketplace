import React from 'react';

export default function SeoJsonLd({ json }: { json: Readonly<Record<string, unknown>> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
      suppressHydrationWarning
    />
  );
}

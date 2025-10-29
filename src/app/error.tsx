"use client";

import Link from 'next/link';

export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html>
      <body>
        <div className="min-h-dvh flex items-center justify-center bg-cream">
          <div className="max-w-lg rounded border border-[var(--color-gray-light)] bg-white p-6 text-center shadow-sm">
            <h1 className="font-serif text-3xl text-brand-navy">Something went wrong</h1>
            <p className="mt-2 text-[var(--color-charcoal)]">An unexpected error occurred. Please try again.</p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button onClick={() => reset()} className="btn-cta">Try again</button>
              <Link href="/" className="btn-secondary border px-4 py-2">Return Home</Link>
            </div>
            {process.env.NODE_ENV === 'development' && error?.message && (
              <pre className="mt-4 overflow-auto rounded bg-cream p-3 text-left text-xs text-[var(--color-charcoal)]">{error.message}</pre>
            )}
          </div>
        </div>
      </body>
    </html>
  );
}

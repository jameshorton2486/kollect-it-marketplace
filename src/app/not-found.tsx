import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-dvh flex items-center justify-center bg-cream">
      <div className="max-w-lg rounded border border-[var(--color-gray-light)] bg-white p-6 text-center shadow-sm">
        <h1 className="font-serif text-3xl text-brand-navy">Page Not Found</h1>
        <p className="mt-2 text-[var(--color-charcoal)]">The page you’re looking for doesn’t exist or was moved.</p>
        <div className="mt-4">
          <Link href="/" className="btn-cta">Return Home</Link>
        </div>
      </div>
    </div>
  );
}

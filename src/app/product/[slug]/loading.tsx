export default function LoadingProduct() {
  return (
    <div className="container py-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="aspect-square w-full animate-pulse rounded bg-[var(--color-gray-light)]" />
        <div className="space-y-3">
          <div className="h-8 w-3/4 animate-pulse rounded bg-[var(--color-gray-light)]" />
          <div className="h-6 w-1/2 animate-pulse rounded bg-[var(--color-gray-light)]" />
          <div className="h-40 w-full animate-pulse rounded bg-[var(--color-gray-light)]" />
        </div>
      </div>
    </div>
  );
}

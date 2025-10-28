export default function LoadingCategory() {
  // Simple skeletons for the grid
  const items = Array.from({ length: 9 });
  return (
    <div className="container">
      <div className="my-6 h-8 w-48 animate-pulse rounded bg-[var(--color-gray-light)]" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((_, i) => (
          <div key={i} className="rounded border border-[var(--color-border)] p-3">
            <div className="h-48 w-full animate-pulse rounded bg-[var(--color-gray-light)]" />
            <div className="mt-3 h-4 w-3/5 animate-pulse rounded bg-[var(--color-gray-light)]" />
            <div className="mt-2 h-4 w-1/3 animate-pulse rounded bg-[var(--color-gray-light)]" />
          </div>
        ))}
      </div>
    </div>
  );
}

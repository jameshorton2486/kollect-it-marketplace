export default function LoadingCategory() {
  return (
    <div className="container py-8">
  <div className="h-10 w-1/3 animate-pulse rounded bg-surface-2" />
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="aspect-square w-full animate-pulse rounded bg-surface-2" />
        ))}
      </div>
    </div>
  );
}

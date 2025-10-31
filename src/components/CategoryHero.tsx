interface CategoryHeroProps {
  title: string;
  description: string;
  backgroundImage: string;
  productCount: number;
}

export default function CategoryHero({
  title,
  description,
  backgroundImage,
  productCount,
}: CategoryHeroProps) {
  return (
    <section className="relative isolate">
      {/* Background image */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={backgroundImage}
          alt=""
          aria-hidden="true"
          className="h-full w-full object-cover"
        />
        {/* Overlay gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60" />
      </div>

      <div className="category-hero-content py-16 md:py-24">
        <div className="container">
          <h1 className="font-serif text-white text-[48px] leading-tight">
            {title}
          </h1>
          {description && (
            <p className="mt-3 max-w-3xl text-white/90 text-lg leading-[1.8]">
              {description}
            </p>
          )}
          <p className="mt-2 text-white/80 text-sm tracking-wide uppercase">
            {productCount} {productCount === 1 ? "Item" : "Items"} Available
          </p>
        </div>
      </div>
    </section>
  );
}

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
    <section
      className="category-hero"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
      }}
    >
      <div className="category-hero-content">
        <div className="container">
          <h1 className="category-hero-title">{title}</h1>
          <p className="category-hero-description">{description}</p>
          <p className="category-hero-count">
            {productCount} {productCount === 1 ? 'Item' : 'Items'} Available
          </p>
        </div>
      </div>
    </section>
  );
}

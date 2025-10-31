export default function Testimonials() {
  const items = [
    {
      q: "Every piece arrived exactly as described—impeccable curation.",
      a: "— M. Davenport",
    },
    {
      q: "Provenance documents were thorough. Trusted source.",
      a: "— L. Marquez",
    },
    { q: "White-glove shipping for a delicate frame—flawless.", a: "— M. Ito" },
  ];
  return (
    <section className="section-spacing bg-cream">
      <div className="container grid gap-8 md:grid-cols-3">
        {items.map((t) => (
          <div
            key={t.a}
            className="rounded border border-border-neutral bg-white p-5"
          >
            <p className="font-serif text-[18px] leading-7 text-brand-navy italic">
              {t.q}
            </p>
            <p className="mt-2 text-[14px] text-brand-gold">{t.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

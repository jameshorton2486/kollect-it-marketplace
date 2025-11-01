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
    <section className="ki-section ki-parchment">
      <div className="ki-container ki-grid md:grid-cols-3">
        {items.map((t) => (
          <div key={t.a} className="ki-card p-5">
            <p className="font-serif text-[18px] leading-7 text-brand-navy ki-quote">
              {t.q}
            </p>
            <p className="mt-2 text-[14px] text-brand-gold ki-muted ki-smallcaps">{t.a}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

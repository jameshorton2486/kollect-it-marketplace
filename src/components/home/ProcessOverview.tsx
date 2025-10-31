export default function ProcessOverview() {
  const steps = [
    {
      n: 1,
      title: "Source",
      text: "We identify exceptional pieces from reputable collections and estates.",
    },
    {
      n: 2,
      title: "Authenticate",
      text: "Specialists vet and document provenance with transparent condition notes.",
    },
    {
      n: 3,
      title: "Deliver",
      text: "Insured, secure shipping with professional packing.",
    },
  ];
  return (
    <section className="section-spacing bg-white">
      <div className="container">
        <p className="mb-3 text-center text-[12px] uppercase tracking-[0.12em] text-brand-gold">
          Our Process
        </p>
        <h2 className="mb-10 text-center font-serif text-[clamp(28px,4vw,36px)] leading-[1.3] text-brand-navy">
          How We Work
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div
              key={s.n}
              className="rounded border border-border-neutral bg-white p-6 text-center"
            >
              <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full border border-brand-gold text-brand-gold">
                {s.n}
              </div>
              <div className="mb-2 font-semibold text-brand-navy">
                {s.title}
              </div>
              <p className="text-[14px] text-ink-secondary">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

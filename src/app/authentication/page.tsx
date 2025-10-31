export const metadata = {
  title: "Authentication Guarantee - Kollect-It",
  description:
    "Our comprehensive authentication process ensures every item is genuine with documented provenance.",
};

export default function AuthenticationPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="section-spacing section-alt text-center">
        <div className="container max-w-[900px]">
          <p className="section-subtitle" data-reveal>
            AUTHENTICATION GUARANTEE
          </p>
          <h1
            className="section-title-main"
            data-reveal
            data-reveal-delay="100"
          >
            Verified Authenticity
          </h1>
          <p
            className="max-w-[700px] mx-auto text-base leading-7 text-ink-secondary"
            data-reveal
            data-reveal-delay="200"
          >
            Every item sold through Kollect-It undergoes rigorous authentication
            by our team of specialists.
          </p>
        </div>
      </section>

      {/* Seal Section */}
      <section className="section-spacing">
        <div className="container max-w-[900px] text-center">
          {/* Animated Seal */}
          <div className="auth-seal">
            <svg
              viewBox="0 0 100 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="50" cy="50" r="45" />
              <circle cx="50" cy="50" r="35" />
              <path
                d="M 30 50 L 45 65 L 70 35"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <text
                x="50"
                y="80"
                fontSize="8"
                fill="currentColor"
                textAnchor="middle"
                fontWeight="600"
              >
                AUTHENTICATED
              </text>
            </svg>
          </div>

          <h2 className="section-title mb-8">Our Authentication Process</h2>

          {/* Verification Timeline */}
          <div className="verification-timeline">
            <div className="verification-timeline-fill"></div>

            <div className="verification-step">
              <div className="verification-step-icon">1</div>
              <p className="text-sm font-semibold m-0">Review</p>
              <p className="text-xs text-ink-muted m-0">Initial inspection</p>
            </div>

            <div className="verification-step">
              <div className="verification-step-icon">2</div>
              <p className="text-sm font-semibold m-0">Verify</p>
              <p className="text-xs text-ink-muted m-0">Expert analysis</p>
            </div>

            <div className="verification-step">
              <div className="verification-step-icon">3</div>
              <p className="text-sm font-semibold m-0">Certify</p>
              <p className="text-xs text-ink-muted m-0">Issue certificate</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Verify Section */}
      <section className="section-spacing bg-white">
        <div className="container max-w-[900px]">
          <h2 className="section-subtitle text-center mb-12">WHAT WE VERIFY</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="split-fade-left">
              <div className="w-[50px] h-[50px] rounded-full bg-surface-1 flex items-center justify-center mb-4 text-gold text-2xl">
                ✓
              </div>
              <h3 className="text-[18px] font-semibold mb-3">
                Origin & Provenance
              </h3>
              <p className="text-[15px] leading-7 text-ink-secondary">
                Complete documentation of ownership history and origin, verified
                through archival research and expert consultation.
              </p>
            </div>

            <div className="split-fade-right delay-200">
              <div className="w-[50px] h-[50px] rounded-full bg-surface-1 flex items-center justify-center mb-4 text-gold text-2xl">
                ✓
              </div>
              <h3 className="text-[18px] font-semibold mb-3">Age & Period</h3>
              <p className="text-[15px] leading-7 text-ink-secondary">
                Scientific dating methods and period-specific analysis to
                confirm authenticity and identify any anachronistic elements.
              </p>
            </div>

            <div className="split-fade-left delay-400">
              <div className="w-[50px] h-[50px] rounded-full bg-surface-1 flex items-center justify-center mb-4 text-gold text-2xl">
                ✓
              </div>
              <h3 className="text-[18px] font-semibold mb-3">
                Condition Assessment
              </h3>
              <p className="text-[15px] leading-7 text-ink-secondary">
                Detailed examination of condition, restoration history, and any
                repairs or alterations, fully disclosed in listings.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="section-spacing section-alt text-center">
        <div className="container max-w-[700px]">
          <h2 className="section-title mb-6">Our Guarantee</h2>
          <p className="text-[17px] leading-8 text-ink-secondary mb-4">
            Every item comes with a certificate of authenticity signed by our
            specialists.
          </p>
          <p className="text-[17px] leading-8 text-ink-secondary font-semibold mb-8">
            If any item is later found to be inauthentic, we offer a full refund
            with no questions asked.
          </p>
          <a href="/contact" className="btn-primary">
            CONTACT OUR EXPERTS
          </a>
        </div>
      </section>
    </div>
  );
}

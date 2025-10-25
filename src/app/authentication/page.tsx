export const metadata = {
  title: 'Authentication Guarantee - Kollect-It',
  description: 'Our comprehensive authentication process ensures every item is genuine with documented provenance.',
};

export default function AuthenticationPage() {
  return (
    <div>
      {/* Hero Section */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: 'var(--color-cream)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <p className="section-subtitle" data-reveal>AUTHENTICATION GUARANTEE</p>
          <h1 className="section-title-main" data-reveal data-reveal-delay="100">
            Verified Authenticity
          </h1>
          <p style={{ maxWidth: '700px', margin: '0 auto', fontSize: '16px', lineHeight: '1.7', color: 'var(--color-gray-dark)' }} data-reveal data-reveal-delay="200">
            Every item sold through Kollect-It undergoes rigorous authentication by our team of specialists.
          </p>
        </div>
      </section>

      {/* Seal Section */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0' }}>
        <div className="container" style={{ maxWidth: '900px', textAlign: 'center' }}>

          {/* Animated Seal */}
          <div className="auth-seal">
            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="50" cy="50" r="45" />
              <circle cx="50" cy="50" r="35" />
              <path d="M 30 50 L 45 65 L 70 35" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <text x="50" y="80" fontSize="8" fill="currentColor" textAnchor="middle" fontWeight="600">AUTHENTICATED</text>
            </svg>
          </div>

          <h2 className="section-title" style={{ marginBottom: '2rem' }}>Our Authentication Process</h2>

          {/* Verification Timeline */}
          <div className="verification-timeline">
            <div className="verification-timeline-fill"></div>

            <div className="verification-step">
              <div className="verification-step-icon">1</div>
              <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Review</p>
              <p style={{ fontSize: '12px', color: 'var(--color-gray-medium)', margin: 0 }}>Initial inspection</p>
            </div>

            <div className="verification-step">
              <div className="verification-step-icon">2</div>
              <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Verify</p>
              <p style={{ fontSize: '12px', color: 'var(--color-gray-medium)', margin: 0 }}>Expert analysis</p>
            </div>

            <div className="verification-step">
              <div className="verification-step-icon">3</div>
              <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>Certify</p>
              <p style={{ fontSize: '12px', color: 'var(--color-gray-medium)', margin: 0 }}>Issue certificate</p>
            </div>
          </div>

        </div>
      </section>

      {/* What We Verify Section */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: 'var(--color-white)' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <h2 className="section-subtitle" style={{ textAlign: 'center', marginBottom: '3rem' }}>WHAT WE VERIFY</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>

            <div className="split-fade-left">
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--color-muted-gold)', fontSize: '24px' }}>✓</div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '0.75rem' }}>Origin & Provenance</h3>
              <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--color-gray-dark)' }}>
                Complete documentation of ownership history and origin, verified through archival research and expert consultation.
              </p>
            </div>

            <div className="split-fade-right" style={{ transitionDelay: '0.2s' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--color-muted-gold)', fontSize: '24px' }}>✓</div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '0.75rem' }}>Age & Period</h3>
              <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--color-gray-dark)' }}>
                Scientific dating methods and period-specific analysis to confirm authenticity and identify any anachronistic elements.
              </p>
            </div>

            <div className="split-fade-left" style={{ transitionDelay: '0.4s' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'var(--color-cream)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'var(--color-muted-gold)', fontSize: '24px' }}>✓</div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '0.75rem' }}>Condition Assessment</h3>
              <p style={{ fontSize: '15px', lineHeight: '1.7', color: 'var(--color-gray-dark)' }}>
                Detailed examination of condition, restoration history, and any repairs or alterations, fully disclosed in listings.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: 'var(--color-cream)', textAlign: 'center' }}>
        <div className="container" style={{ maxWidth: '700px' }}>
          <h2 className="section-title" style={{ marginBottom: '1.5rem' }}>Our Guarantee</h2>
          <p style={{ fontSize: '17px', lineHeight: '1.8', color: 'var(--color-gray-dark)', marginBottom: '1rem' }}>
            Every item comes with a certificate of authenticity signed by our specialists.
          </p>
          <p style={{ fontSize: '17px', lineHeight: '1.8', color: 'var(--color-gray-dark)', fontWeight: 600, marginBottom: '2rem' }}>
            If any item is later found to be inauthentic, we offer a full refund with no questions asked.
          </p>
          <a href="/contact" className="btn-primary cta-shimmer">
            CONTACT OUR EXPERTS
          </a>
        </div>
      </section>
    </div>
  );
}

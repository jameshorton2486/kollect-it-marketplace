import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us - Kollect-It',
  description: "Get in touch with our team of experts. We're here to help with authentication, appraisals, and acquisitions.",
};

export default function ContactPage() {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <Link href="/" style={{ textDecoration: 'none' }}>
              <span className="header-logo">
                KOLLECT — IT
              </span>
            </Link>
          </div>
        </div>
        <nav className="main-nav">
          <Link href="/">Home</Link>
          <Link href="/shop">Shop</Link>
          <Link href="/about">About Us</Link>
          <Link href="/contact">Contact</Link>
        </nav>
      </header>

      {/* Page Content */}
      <section className="contact-page" style={{ padding: 'clamp(4rem, 8vw, 6rem) 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'clamp(3rem, 6vw, 5rem)' }}>
            <p className="section-subtitle">GET IN TOUCH</p>
            <h1 className="section-title-main">Contact Our Team</h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(3rem, 6vw, 5rem)', alignItems: 'start' }}>
            {/* Left: Info */}
            <div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.75rem, 3vw, 2.25rem)', marginBottom: '1.5rem' }}>
                We're Here to Help
              </h2>
              <p style={{ fontSize: '16px', lineHeight: '1.7', color: 'var(--color-gray-dark)', marginBottom: '2rem' }}>
                Whether you're looking to acquire a rare piece, need an authentication, or have questions
                about our collection, our team of experts is ready to assist you.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Email
                  </h3>
                  <a href="mailto:hello@kollect-it.com" style={{ color: 'var(--color-muted-gold)', fontSize: '16px' }}>
                    hello@kollect-it.com
                  </a>
                </div>

                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Phone
                  </h3>
                  <a href="tel:+15551234567" style={{ color: 'var(--color-muted-gold)', fontSize: '16px' }}>
                    +1 (555) 123-4567
                  </a>
                </div>

                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                    Hours
                  </h3>
                  <p style={{ fontSize: '16px', color: 'var(--color-gray-dark)' }}>
                    Monday – Friday: 9:00 AM – 6:00 PM EST<br />
                    Saturday: 10:00 AM – 4:00 PM EST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Form with Floating Labels */}
            <form className="contact-form" style={{ background: 'var(--color-cream)', padding: '2.5rem', border: '1px solid var(--color-gray-light)' }}>
              <div className="form-field">
                <input type="text" id="name" name="name" required placeholder=" " />
                <label htmlFor="name">Name *</label>
              </div>

              <div className="form-field">
                <input type="email" id="email" name="email" required placeholder=" " />
                <label htmlFor="email">Email *</label>
              </div>

              <div className="form-field">
                <input type="text" id="subject" name="subject" required placeholder=" " />
                <label htmlFor="subject">Subject *</label>
              </div>

              <div className="form-field">
                <textarea id="message" name="message" required placeholder=" " rows={6} maxLength={500}></textarea>
                <label htmlFor="message">Message *</label>
                <div className="character-counter">0 / 500</div>
              </div>

              <button type="submit" className="btn-primary btn-submit" style={{ width: '100%' }}>
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section style={{ padding: 'clamp(4rem, 8vw, 6rem) 0', background: 'var(--color-cream)' }}>
        <div className="container">
          <h2 className="section-subtitle" style={{ textAlign: 'center', marginBottom: '2rem' }}>VISIT OUR SHOWROOM</h2>
          <div className="map-container" data-reveal>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976035!3d40.6974881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1234567890123"
              width="600"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kollect-It Location"
            />
          </div>
          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '14px', color: 'var(--color-gray-medium)' }}>
            By appointment only. Please contact us to schedule a visit.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-bottom">
            <p>&copy; Kollect-It {new Date().getFullYear()}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

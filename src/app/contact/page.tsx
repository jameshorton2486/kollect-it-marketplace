import { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from '@/components/forms/ContactForm';

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
            <Link href="/" className="no-underline">
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
      <section className="contact-page py-[clamp(4rem,8vw,6rem)]">
        <div className="container">
          <div className="text-center mb-[clamp(3rem,6vw,5rem)]">
            <p className="section-subtitle">GET IN TOUCH</p>
            <h1 className="section-title-main">Contact Our Team</h1>
          </div>

          <div className="grid md:grid-cols-2 gap-[clamp(3rem,6vw,5rem)] items-start">
            {/* Left: Info */}
            <div>
              <h2 className="font-serif text-[clamp(1.75rem,3vw,2.25rem)] mb-6">
                We're Here to Help
              </h2>
              <p className="text-base leading-[1.7] text-[var(--color-gray-dark)] mb-8">
                Whether you're looking to acquire a rare piece, need an authentication, or have questions
                about our collection, our team of experts is ready to assist you.
              </p>

              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-[14px] font-semibold tracking-[0.08em] uppercase mb-2">
                    Email
                  </h3>
                  <a href="mailto:hello@kollect-it.com" className="text-[var(--color-muted-gold)] text-base">
                    hello@kollect-it.com
                  </a>
                </div>

                <div>
                  <h3 className="text-[14px] font-semibold tracking-[0.08em] uppercase mb-2">
                    Phone
                  </h3>
                  <a href="tel:+15551234567" className="text-[var(--color-muted-gold)] text-base">
                    +1 (555) 123-4567
                  </a>
                </div>

                <div>
                  <h3 className="text-[14px] font-semibold tracking-[0.08em] uppercase mb-2">
                    Hours
                  </h3>
                  <p className="text-base text-[var(--color-gray-dark)]">
                    Monday – Friday: 9:00 AM – 6:00 PM EST<br />
                    Saturday: 10:00 AM – 4:00 PM EST<br />
                    Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Validated Client Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-[clamp(4rem,8vw,6rem)] bg-[var(--color-cream)]">
        <div className="container">
          <h2 className="section-subtitle text-center mb-8">VISIT OUR SHOWROOM</h2>
          <div className="map-container" data-reveal>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976035!3d40.6974881!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2s!4v1234567890123"
              width="600"
              height="450"
              className="border-0"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Kollect-It Location"
            />
          </div>
          <p className="text-center mt-6 text-sm text-[var(--color-gray-medium)]">
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

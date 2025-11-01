import { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/forms/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us - Kollect-It",
  description:
    "Get in touch with our team of experts. We're here to help with authentication, appraisals, and acquisitions.",
};

export default function ContactPage() {
  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="header-container">
          <div className="logo">
            <Link href="/" className="no-underline">
              <span className="header-logo">KOLLECT — IT</span>
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
              <p className="text-base leading-[1.7] text-ink-secondary mb-8">
                Whether you're looking to acquire a rare piece, need an
                authentication, or have questions about our collection, our team
                of experts is ready to assist you.
              </p>

              <div className="flex flex-col gap-6">
                <div>
                  <h3 className="text-[14px] font-semibold tracking-[0.08em] uppercase mb-2">
                    Email
                  </h3>
                  <a
                    href="mailto:support@kollect-it.com"
                    className="text-gold text-base hover:text-gold-hover underline-offset-2 hover:underline"
                  >
                    support@kollect-it.com
                  </a>
                </div>

                <div>
                  <h3 className="text-[14px] font-semibold tracking-[0.08em] uppercase mb-2">
                    Phone
                  </h3>
                  <a
                    href="tel:+14693866065"
                    className="text-gold text-base hover:text-gold-hover underline-offset-2 hover:underline"
                  >
                    +1 (469) 386-6065
                  </a>
                </div>

                <div>
                  <h3 className="text-[14px] font-semibold tracking-[0.08em] uppercase mb-2">
                    Hours
                  </h3>
                  <p className="text-base text-ink-secondary">
                    Monday – Friday: 9:00 AM – 6:00 PM EST
                    <br />
                    Saturday: 10:00 AM – 4:00 PM EST
                    <br />
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
      <section className="py-[clamp(4rem,8vw,6rem)] bg-cream">
        <div className="container">
          <h2 className="section-subtitle text-center mb-8">
            VISIT OUR SHOWROOM
          </h2>
          <div className="map-container" data-reveal>
            <iframe
              src="https://www.google.com/maps?q=San%20Antonio%2C%20TX%2C%20USA&output=embed"
              width="600"
              height="450"
              className="border-0"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              title="Kollect-It San Antonio Location"
            />
          </div>
          <p className="text-center mt-6 text-sm text-ink-muted">
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

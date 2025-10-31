import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";

export default function FooterExtended() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-brand-navy text-white">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Company Info */}
          <div>
            <div className="mb-3 font-serif text-2xl leading-none tracking-wide">
              KOLLECT — IT
            </div>
            <p className="text-sm leading-7 text-white/80">
              Curated antiques & collectibles with documented provenance,
              authenticated by category specialists.
            </p>
            {/* Removed per request */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-3 font-serif text-[20px]">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  className="transition-colors hover:text-brand-gold"
                  href="/about"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-brand-gold"
                  href="/authentication"
                >
                  How We Authenticate
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-brand-gold"
                  href="/sell"
                >
                  Consignment
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-brand-gold"
                  href="/privacy"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  className="transition-colors hover:text-brand-gold"
                  href="/terms"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-3 font-serif text-[20px]">Contact</h3>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <a
                  href="mailto:support@kollect-it.com"
                  className="hover:text-brand-gold"
                >
                  support@kollect-it.com
                </a>
              </li>
              <li>
                <a href="tel:+14693866065" className="hover:text-brand-gold">
                  +1 (469) 386-6065
                </a>
              </li>
              <li>Mon–Fri, 9am–6pm ET</li>
              <li>San Antonio, Texas</li>
            </ul>
            <div className="mt-4 flex items-center gap-3">
              <Link
                aria-label="Instagram"
                href="#"
                className="inline-flex items-center justify-center rounded border border-white/20 p-2 transition-colors hover:text-brand-gold"
              >
                <Instagram size={18} />
              </Link>
              <Link
                aria-label="Facebook"
                href="#"
                className="inline-flex items-center justify-center rounded border border-white/20 p-2 transition-colors hover:text-brand-gold"
              >
                <Facebook size={18} />
              </Link>
              <Link
                aria-label="YouTube"
                href="#"
                className="inline-flex items-center justify-center rounded border border-white/20 p-2 transition-colors hover:text-brand-gold"
              >
                <Youtube size={18} />
              </Link>
            </div>
          </div>

          {/* Newsletter removed */}
        </div>
      </div>

      <div className="border-t border-white/15">
        <div className="container py-4 text-center">
          <p className="text-xs text-white/70">
            © {year} Kollect-It • All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

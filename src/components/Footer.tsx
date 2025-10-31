import Link from "next/link";
import { Instagram, Youtube, Facebook } from "lucide-react";

interface FooterProps {
  categories?: Array<{ id?: string; name: string; slug: string }>; // optional override
}

export default function Footer({ categories }: FooterProps) {
  const year = new Date().getFullYear();
  const defaultCategories = [
    { name: "Fine Art", slug: "fine-art" },
    { name: "Antique Books", slug: "antique-books" },
    { name: "Collectibles", slug: "collectibles" },
    { name: "Militaria", slug: "militaria" },
  ];
  const cats =
    categories && categories.length > 0 ? categories : defaultCategories;

  return (
    <footer className="bg-[#2C2C2C] text-white mt-16">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          {/* Logo / About intro */}
          <div>
            <div className="mb-3 font-serif text-2xl leading-none tracking-wide">
              KOLLECT — IT
            </div>
            <p className="text-sm leading-7 text-white/80">
              Timeless antiques and collectibles curated with care. Authenticity
              and provenance come first.
            </p>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-3 font-semibold">About</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="hover:text-[#B1874C]" href="/about">
                  Our Story
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#B1874C]" href="/blog">
                  Blog
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#B1874C]" href="/contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Categories */}
          <div>
            <h3 className="mb-3 font-semibold">Popular Categories</h3>
            <ul className="space-y-2 text-sm">
              {cats.map((c) => (
                <li key={c.slug}>
                  <Link
                    className="hover:text-[#B1874C]"
                    href={`/category/${c.slug}`}
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect / Support */}
          <div>
            <h3 className="mb-3 font-semibold">Connect</h3>
            <div className="mb-4 flex items-center gap-3">
              <Link
                aria-label="Instagram"
                href="#"
                className="inline-flex items-center justify-center rounded border border-white/20 p-2 hover:text-[#B1874C]"
              >
                <Instagram size={18} />
              </Link>
              <Link
                aria-label="YouTube"
                href="#"
                className="inline-flex items-center justify-center rounded border border-white/20 p-2 hover:text-[#B1874C]"
              >
                <Youtube size={18} />
              </Link>
              <Link
                aria-label="Facebook"
                href="#"
                className="inline-flex items-center justify-center rounded border border-white/20 p-2 hover:text-[#B1874C]"
              >
                <Facebook size={18} />
              </Link>
            </div>

            <h3 className="mb-3 font-semibold">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="hover:text-[#B1874C]" href="/faq">
                  FAQ
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#B1874C]" href="/shipping-returns">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link className="hover:text-[#B1874C]" href="/contact">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container py-4 text-center">
          <p className="text-xs text-white/70">
            © {year} Kollect-It. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

import { Shield, Package, Award } from "lucide-react";

export default function TrustStrip() {
  return (
    <section className="trust-strip">
      <div className="container grid grid-cols-1 gap-6 text-center md:grid-cols-3">
        <div>
          <Shield className="mx-auto mb-2 text-brand-gold" />
          <div className="font-semibold text-brand-navy">Authentication Guaranteed</div>
          <p className="text-[14px] text-[var(--color-gray-dark)]">Expert-vetted items with documented provenance.</p>
        </div>
        <div>
          <Package className="mx-auto mb-2 text-brand-gold" />
          <div className="font-semibold text-brand-navy">Secure Shipping</div>
          <p className="text-[14px] text-[var(--color-gray-dark)]">Archival-grade packing and insured delivery.</p>
        </div>
        <div>
          <Award className="mx-auto mb-2 text-brand-gold" />
          <div className="font-semibold text-brand-navy">Expert Curated</div>
          <p className="text-[14px] text-[var(--color-gray-dark)]">Pieces selected for historical and aesthetic merit.</p>
        </div>
      </div>
    </section>
  );
}

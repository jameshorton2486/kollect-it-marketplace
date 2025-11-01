import { Shield, Package, Award } from "lucide-react";

export default function TrustStrip() {
  return (
    <section className="ki-section">
      <div className="ki-container ki-grid text-center md:grid-cols-3">
        <div>
          <Shield className="mx-auto mb-2 text-brand-gold" />
          <div className="font-semibold text-brand-navy">
            Authentication Guaranteed
          </div>
          <p className="text-[14px] text-ink-secondary">
            Expert-vetted items with detailed and accurate descriptions.
          </p>
        </div>
        <div>
          <Package className="mx-auto mb-2 text-brand-gold" />
          <div className="font-semibold text-brand-navy">Secure Shipping</div>
          <p className="text-[14px] text-ink-secondary">
            Expert packing and insured delivery.
          </p>
        </div>
        <div>
          <Award className="mx-auto mb-2 text-brand-gold" />
          <div className="font-semibold text-brand-navy">Expert Curated</div>
          <p className="text-[14px] text-ink-secondary">
            Pieces selected for historical and aesthetic merit.
          </p>
        </div>
      </div>
    </section>
  );
}

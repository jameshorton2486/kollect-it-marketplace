export const metadata = {
  title: "Shipping & Returns - Kollect-It",
  description:
    "Our shipping and returns policy for authenticated collectibles, art, and antiques.",
};

export default function ShippingReturnsPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="category-section">
        <div className="container max-w-[900px] text-center">
          <p className="section-subtitle" data-reveal>
            POLICIES
          </p>
          <h1
            className="section-title-main"
            data-reveal
            data-reveal-delay="100"
          >
            Shipping & Returns
          </h1>
          <p
            className="mx-auto max-w-[700px] text-base leading-[1.7] text-ink-secondary"
            data-reveal
            data-reveal-delay="200"
          >
            We handle every item with museum-quality care and offer transparent
            policies for your peace of mind.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="new-arrivals">
        <div className="container max-w-[900px]">
          {/* Shipping Section */}
          <div className="section-header-with-icon mb-8">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="1" y="3" width="15" height="13"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
            <h2 className="section-title m-0 text-[clamp(1.75rem,3vw,2.25rem)] font-normal">
              Shipping
              <div className="gold-underline"></div>
            </h2>
          </div>

          <div className="split-fade-left mb-6">
            <h3 className="mb-3 text-[18px] font-semibold">
              Domestic Shipping
            </h3>
            <p className="leading-[1.7] text-ink-secondary">
              All domestic orders are shipped via insured carriers (FedEx, UPS)
              with signature confirmation required. Standard shipping takes 3-5
              business days. Expedited options available at checkout.
            </p>
          </div>

          <div className="split-fade-right mb-6">
            <h3 className="mb-3 text-[18px] font-semibold">
              International Shipping
            </h3>
            <p className="leading-[1.7] text-ink-secondary">
              We ship worldwide with full insurance and tracking. International
              orders typically arrive in 7-14 business days. All customs
              documentation is prepared by our team. Import duties and taxes are
              the responsibility of the buyer.
            </p>
          </div>

          <div className="split-fade-left mb-6">
            <h3 className="mb-3 text-[18px] font-semibold">
              Packaging & Handling
            </h3>
            <p className="leading-[1.7] text-ink-secondary">
              Every item is professionally packed with archival materials.
              Fragile items receive custom crating. Shipping costs are
              calculated based on destination, item value, and dimensions.
            </p>
          </div>

          <div className="split-fade-right mb-12">
            <h3 className="mb-3 text-[18px] font-semibold">Shipping Rates</h3>
            <p className="leading-[1.7] text-ink-secondary">
              Shipping costs are calculated at checkout. Free domestic shipping
              on orders over $2,500. White-glove delivery available for
              high-value or oversized items.
            </p>
          </div>

          {/* Returns Section */}
          <div className="section-header-with-icon mb-8 mt-16">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="1 4 1 10 7 10"></polyline>
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
              <rect x="8" y="8" width="8" height="8" rx="1"></rect>
            </svg>
            <h2 className="section-title m-0 text-[clamp(1.75rem,3vw,2.25rem)] font-normal">
              Returns & Exchanges
              <div className="gold-underline"></div>
            </h2>
          </div>

          <div className="split-fade-left mb-6">
            <h3 className="mb-3 text-[18px] font-semibold">
              30-Day Return Policy
            </h3>
            <p className="leading-[1.7] text-ink-secondary">
              We accept returns within 30 days of delivery. Items must be in
              their original condition with all certificates of authenticity and
              packaging materials. Contact our team to initiate a return
              authorization.
            </p>
          </div>

          <div className="split-fade-right mb-6">
            <h3 className="mb-3 text-[18px] font-semibold">Return Process</h3>
            <p className="leading-[1.7] text-ink-secondary">
              Email us at returns@kollect-it.com with your order number. Once
              approved, we'll provide a prepaid return shipping label. Upon
              receipt and inspection, refunds are processed within 5-7 business
              days.
            </p>
          </div>

          <div className="split-fade-left mb-6">
            <h3 className="mb-3 text-[18px] font-semibold">
              Condition Requirements
            </h3>
            <p className="leading-[1.7] text-ink-secondary">
              Items must be returned in the exact condition received. Any
              damage, alterations, or missing documentation will affect
              eligibility for a full refund. We reserve the right to refuse
              returns that don't meet our standards.
            </p>
          </div>

          <div className="split-fade-right">
            <h3 className="mb-3 text-[18px] font-semibold">Exchanges</h3>
            <p className="leading-[1.7] text-ink-secondary">
              We're happy to facilitate exchanges for items of equal or greater
              value. Contact our team to discuss available options. Price
              differences can be settled via store credit or additional payment.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="category-section text-center">
        <div className="container">
          <h2 className="section-title mb-4">
            Questions About Shipping or Returns?
          </h2>
          <p className="mx-auto mb-8 max-w-[600px] text-base leading-[1.7] text-ink-secondary">
            Our customer service team is here to assist with any questions about
            our policies.
          </p>
          <a href="/contact" className="btn-primary">
            CONTACT US
          </a>
        </div>
      </section>
    </div>
  );
}

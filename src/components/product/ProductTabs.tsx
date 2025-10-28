'use client';

import { useState } from 'react';

interface Product {
  description: string;
  condition: string | null;
}

interface ProductTabsProps {
  product: Product;
}

export default function ProductTabs({ product }: ProductTabsProps) {
  const [activeTab, setActiveTab] = useState<'details' | 'shipping' | 'authentication'>('details');

  return (
    <div className="product-tabs-section section-spacing">
      <div className="container">
        {/* Tab Navigation */}
        <div className="product-tabs-nav">
          <button
            className={`product-tab ${activeTab === 'details' ? 'active border-b-[3px] border-brand-gold text-brand-navy font-medium' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`product-tab ${activeTab === 'shipping' ? 'active border-b-[3px] border-brand-gold text-brand-navy font-medium' : ''}`}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping
          </button>
          <button
            className={`product-tab ${activeTab === 'authentication' ? 'active border-b-[3px] border-brand-gold text-brand-navy font-medium' : ''}`}
            onClick={() => setActiveTab('authentication')}
          >
            Authentication
          </button>
        </div>

        {/* Tab Content */}
        <div className="product-tabs-content leading-[1.8] text-[var(--color-gray-dark)]">
          {activeTab === 'details' && (
            <div className="tab-panel">
              <h3 className="font-serif text-brand-navy">Product Description</h3>
              <p>{product.description}</p>
              {product.condition && (
                <div className="condition-details">
                  <h4 className="font-serif text-brand-navy">Condition Notes</h4>
                  <p>
                    This item is in <strong>{product.condition}</strong> condition. All items are carefully
                    inspected and accurately described by our expert curators.
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'shipping' && (
            <div className="tab-panel">
              <h3 className="font-serif text-brand-navy">Shipping Information</h3>
              <p>
                We offer complimentary white-glove shipping on all orders over $99 within the continental
                United States. International shipping is available at checkout.
              </p>

              <h4 className="font-serif text-brand-navy">Delivery Times</h4>
              <ul>
                <li><strong>Standard Shipping:</strong> 5-7 business days</li>
                <li><strong>Express Shipping:</strong> 2-3 business days</li>
                <li><strong>International:</strong> 10-14 business days</li>
              </ul>

              <h4 className="font-serif text-brand-navy">Returns & Exchanges</h4>
              <p>
                We accept returns within 30 days of delivery for a full refund. Items must be returned in
                their original condition. Please contact our concierge team to initiate a return.
              </p>

              <h4 className="font-serif text-brand-navy">Packaging</h4>
              <p>
                All items are professionally packaged with museum-quality materials to ensure safe transit.
                Fragile items receive additional protective packaging and insurance.
              </p>
            </div>
          )}

          {activeTab === 'authentication' && (
            <div className="tab-panel">
              <h3 className="font-serif text-brand-navy">Our Authentication Guarantee</h3>
              <p>
                Every item at Kollect-It undergoes rigorous authentication by our team of expert curators and
                specialists. We guarantee the authenticity and accurate representation of all pieces in our collection.
              </p>

              <h4 className="font-serif text-brand-navy">Authentication Process</h4>
              <ul>
                <li><strong>Expert Examination:</strong> Physical inspection by category specialists</li>
                <li><strong>Provenance Research:</strong> Verification of item history and ownership</li>
                <li><strong>Condition Assessment:</strong> Detailed evaluation and documentation</li>
                <li><strong>Market Analysis:</strong> Fair pricing based on current market values</li>
              </ul>

              <h4 className="font-serif text-brand-navy">Certificate of Authenticity</h4>
              <p>
                Select items include a Certificate of Authenticity from Kollect-It or the original artist/maker.
                All documentation is carefully preserved and included with your purchase.
              </p>

              <h4 className="font-serif text-brand-navy">Lifetime Guarantee</h4>
              <p>
                If any item is ever determined to be inauthentic, we will provide a full refund including
                original shipping costs. This guarantee remains valid for the lifetime of the item.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

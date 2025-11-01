import Link from "next/link";

export const metadata = {
  title: "Sell Your Collection - Kollect-It",
};

export default function SellPage() {
  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          padding: "clamp(4rem, 8vw, 6rem) 0",
          background: "var(--color-cream)",
        }}
      >
        <div className="container">
          <p className="section-subtitle" data-reveal>
            CONSIGNMENT SERVICES
          </p>
          <h1
            className="section-title-main"
            data-reveal
            data-reveal-delay="100"
          >
            Sell Your Collection
          </h1>
          <p
            style={{
              textAlign: "center",
              maxWidth: "700px",
              margin: "0 auto",
              fontSize: "17px",
              lineHeight: "1.7",
              color: "var(--color-gray-dark)",
            }}
            data-reveal
            data-reveal-delay="200"
          >
            Consign your rare pieces with Kollect-It. Expert authentication,
            fair pricing, and white-glove service for discerning collectors.
          </p>
        </div>
      </section>

      {/* Animated Timeline Section */}
      <section style={{ padding: "clamp(4rem, 8vw, 6rem) 0" }}>
        <div className="container">
          <h2
            className="section-subtitle"
            style={{ textAlign: "center", marginBottom: "3rem" }}
          >
            HOW IT WORKS
          </h2>

          <div className="timeline-container">
            <div className="timeline-line">
              <div className="timeline-line-fill" />
            </div>

            <div className="timeline-steps">
              <div className="timeline-step">
                <div className="timeline-number">
                  1
                  <span
                    className="timeline-tooltip"
                    title="Submit photos and details of your item"
                  >
                    ℹ️
                  </span>
                </div>
                <h3>Submit Your Item</h3>
                <p>
                  Share photos and details through our secure consignment form
                </p>
              </div>

              <div className="timeline-step">
                <div className="timeline-number">
                  2
                  <span
                    className="timeline-tooltip"
                    title="Our experts review authenticity and market value"
                  >
                    ℹ️
                  </span>
                </div>
                <h3>Expert Review</h3>
                <p>Our specialists authenticate and appraise your piece</p>
              </div>

              <div className="timeline-step">
                <div className="timeline-number">
                  3
                  <span
                    className="timeline-tooltip"
                    title="We handle photography, listing, and marketing"
                  >
                    ℹ️
                  </span>
                </div>
                <h3>Professional Listing</h3>
                <p>We create a compelling listing with expert photography</p>
              </div>

              <div className="timeline-step">
                <div className="timeline-number">
                  4
                  <span
                    className="timeline-tooltip"
                    title="Secure payment within 7 days of sale"
                  >
                    ℹ️
                  </span>
                </div>
                <h3>Get Paid</h3>
                <p>Receive payment promptly once your item sells</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section
        style={{
          padding: "clamp(4rem, 8vw, 6rem) 0",
          background: "var(--color-cream)",
        }}
      >
        <div className="container">
          <h2
            className="section-subtitle"
            style={{ textAlign: "center", marginBottom: "3rem" }}
          >
            WHY CONSIGN WITH US
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "3rem",
              maxWidth: "1000px",
              margin: "0 auto",
            }}
          >
            <div style={{ textAlign: "center" }} data-reveal>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                Expert Authentication
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "var(--color-gray-dark)",
                }}
              >
                Every item is verified by specialists with decades of experience
              </p>
            </div>
            <div
              style={{ textAlign: "center" }}
              data-reveal
              data-reveal-delay="150"
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                Transparent Pricing
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "var(--color-gray-dark)",
                }}
              >
                Fair market valuations with no hidden fees
              </p>
            </div>
            <div
              style={{ textAlign: "center" }}
              data-reveal
              data-reveal-delay="300"
            >
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  marginBottom: "1rem",
                }}
              >
                Global Reach
              </h3>
              <p
                style={{
                  fontSize: "15px",
                  lineHeight: "1.6",
                  color: "var(--color-gray-dark)",
                }}
              >
                Access to our network of collectors worldwide
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Shimmer */}
      <section style={{ padding: "clamp(4rem, 8vw, 6rem) 0" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2 className="section-title" style={{ marginBottom: "2rem" }}>
            Ready to Consign?
          </h2>
          <p
            style={{
              maxWidth: "600px",
              margin: "0 auto 2rem",
              fontSize: "16px",
              lineHeight: "1.7",
              color: "var(--color-gray-dark)",
            }}
          >
            Start the consignment process today and let our experts handle the
            rest.
          </p>
          <Link
            href="/contact"
            className="btn-primary cta-shimmer"
            style={{ fontSize: "15px", padding: "1rem 3rem" }}
          >
            GET STARTED TODAY
          </Link>
        </div>
      </section>
    </div>
  );
}

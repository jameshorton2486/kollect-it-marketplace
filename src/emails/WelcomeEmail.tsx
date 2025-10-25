import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
  Hr,
} from '@react-email/components';
import * as React from 'react';

interface WelcomeEmailProps {
  name: string;
  siteUrl: string;
}

export const WelcomeEmail = ({
  name = 'Valued Customer',
  siteUrl = 'http://localhost:3000',
}: WelcomeEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Kollect-It! Discover curated antiques and collectibles.</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>KOLLECT • IT</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Welcome to Kollect-It!</Heading>

            <Text style={text}>
              Hi {name},
            </Text>

            <Text style={text}>
              Thank you for joining our community of collectors and enthusiasts! We're thrilled to have you with us.
            </Text>

            <Hr style={divider} />

            {/* What We Offer */}
            <Section>
              <Heading as="h2" style={h2}>
                What to Expect
              </Heading>

              <Section style={featureSection}>
                <Text style={featureTitle}>🎨 Curated Collections</Text>
                <Text style={featureText}>
                  Handpicked antiques, rare books, fine art, and collectibles from around the world.
                </Text>
              </Section>

              <Section style={featureSection}>
                <Text style={featureTitle}>✨ Expert Authentication</Text>
                <Text style={featureText}>
                  Every item is carefully authenticated and verified for quality and provenance.
                </Text>
              </Section>

              <Section style={featureSection}>
                <Text style={featureTitle}>📧 Exclusive Updates</Text>
                <Text style={featureText}>
                  Be the first to know about new arrivals, special offers, and collector insights.
                </Text>
              </Section>

              <Section style={featureSection}>
                <Text style={featureTitle}>🌟 Special Offers</Text>
                <Text style={featureText}>
                  Enjoy exclusive discounts and early access to limited collections.
                </Text>
              </Section>
            </Section>

            <Hr style={divider} />

            {/* CTA Section */}
            <Section>
              <Heading as="h2" style={h2}>
                Start Exploring
              </Heading>
              <Text style={text}>
                Ready to discover your next treasure? Browse our latest arrivals and curated collections.
              </Text>
            </Section>

            <Section style={buttonContainer}>
              <Link
                href={`${siteUrl}/#latest`}
                style={button}
              >
                Browse Collections
              </Link>
            </Section>

            {/* Categories */}
            <Section>
              <Heading as="h2" style={h2}>
                Shop by Category
              </Heading>
              <Section style={categoryLinks}>
                <Link href={`${siteUrl}/category/fine-art`} style={categoryLink}>
                  Fine Art
                </Link>
                {' • '}
                <Link href={`${siteUrl}/category/antique-books`} style={categoryLink}>
                  Antique Books
                </Link>
                {' • '}
                <Link href={`${siteUrl}/category/collectibles`} style={categoryLink}>
                  Collectibles
                </Link>
                {' • '}
                <Link href={`${siteUrl}/category/militaria`} style={categoryLink}>
                  Militaria
                </Link>
              </Section>
            </Section>

            <Hr style={divider} />

            <Text style={text}>
              Thank you for choosing Kollect-It. We look forward to helping you build your collection!
            </Text>

            <Text style={signature}>
              – The Kollect-It Team
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Kollect-It. All rights reserved.
            </Text>
            <Text style={footerText}>
              <Link href={`${siteUrl}/about`} style={footerLink}>
                About Us
              </Link>
              {' • '}
              <Link href={`${siteUrl}/contact`} style={footerLink}>
                Contact
              </Link>
              {' • '}
              <Link href={`${siteUrl}/unsubscribe`} style={footerLink}>
                Unsubscribe
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default WelcomeEmail;

// Styles
const main = {
  backgroundColor: '#f6f0ee',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '0',
  marginTop: '40px',
  marginBottom: '40px',
  maxWidth: '600px',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
};

const header = {
  backgroundColor: '#322923',
  padding: '30px 40px',
  textAlign: 'center' as const,
};

const logo = {
  color: '#ffffff',
  fontSize: '28px',
  fontWeight: '600',
  letterSpacing: '3px',
  margin: '0',
  fontFamily: "'Playfair Display', serif",
};

const content = {
  padding: '40px',
};

const h1 = {
  color: '#322923',
  fontSize: '32px',
  fontWeight: '400',
  margin: '0 0 20px 0',
  fontFamily: "'Cormorant Garamond', serif",
  textAlign: 'center' as const,
};

const h2 = {
  color: '#322923',
  fontSize: '22px',
  fontWeight: '500',
  margin: '20px 0 15px 0',
  fontFamily: "'Cormorant Garamond', serif",
};

const text = {
  color: '#6b6b6b',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 15px 0',
};

const divider = {
  borderColor: '#d0bca4',
  margin: '30px 0',
};

const featureSection = {
  marginBottom: '20px',
};

const featureTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#322923',
  margin: '0 0 5px 0',
};

const featureText = {
  fontSize: '15px',
  color: '#6b6b6b',
  margin: '0 0 10px 0',
  lineHeight: '24px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '30px 0',
};

const button = {
  backgroundColor: '#C9A66B',
  borderRadius: '4px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 40px',
};

const categoryLinks = {
  textAlign: 'center' as const,
  margin: '15px 0',
};

const categoryLink = {
  color: '#C9A66B',
  textDecoration: 'underline',
  fontSize: '15px',
};

const signature = {
  fontSize: '16px',
  fontStyle: 'italic',
  color: '#6b6b6b',
  margin: '20px 0 0 0',
};

const footer = {
  backgroundColor: '#f6f0ee',
  padding: '30px 40px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#6b6b6b',
  fontSize: '13px',
  lineHeight: '20px',
  margin: '5px 0',
};

const footerLink = {
  color: '#C9A66B',
  textDecoration: 'underline',
};

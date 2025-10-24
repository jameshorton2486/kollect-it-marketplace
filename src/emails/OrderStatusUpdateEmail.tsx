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

interface OrderStatusUpdateEmailProps {
  orderNumber: string;
  customerName: string;
  status: string;
  trackingNumber?: string;
  carrier?: string;
  siteUrl: string;
}

export const OrderStatusUpdateEmail = ({
  orderNumber = 'KI-1234567890-ABC123',
  customerName = 'John Doe',
  status = 'shipped',
  trackingNumber,
  carrier,
  siteUrl = 'http://localhost:3000',
}: OrderStatusUpdateEmailProps) => {
  const getStatusMessage = () => {
    switch (status) {
      case 'processing':
        return {
          title: 'Order Processing',
          message: 'Your order is being prepared for shipment.',
          emoji: '📦',
        };
      case 'shipped':
        return {
          title: 'Order Shipped!',
          message: 'Your order is on its way!',
          emoji: '🚚',
        };
      case 'delivered':
        return {
          title: 'Order Delivered',
          message: 'Your order has been delivered.',
          emoji: '✅',
        };
      case 'cancelled':
        return {
          title: 'Order Cancelled',
          message: 'Your order has been cancelled.',
          emoji: '❌',
        };
      default:
        return {
          title: 'Order Update',
          message: 'Your order status has been updated.',
          emoji: '📬',
        };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <Html>
      <Head />
      <Preview>{statusInfo.title} - Order {orderNumber}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>KOLLECT • IT</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={emoji}>{statusInfo.emoji}</Text>

            <Heading style={h1}>{statusInfo.title}</Heading>

            <Text style={text}>
              Hi {customerName},
            </Text>

            <Text style={text}>
              {statusInfo.message}
            </Text>

            {/* Order Details Box */}
            <Section style={orderBox}>
              <Text style={orderNumberStyle}>Order #{orderNumber}</Text>
              <Text style={statusBadge}>
                Status: <strong>{status.charAt(0).toUpperCase() + status.slice(1)}</strong>
              </Text>
            </Section>

            {/* Tracking Information */}
            {trackingNumber && (
              <Section>
                <Heading as="h2" style={h2}>
                  Tracking Information
                </Heading>
                {carrier && (
                  <Text style={trackingText}>
                    <strong>Carrier:</strong> {carrier}
                  </Text>
                )}
                <Text style={trackingText}>
                  <strong>Tracking Number:</strong> {trackingNumber}
                </Text>
              </Section>
            )}

            <Hr style={divider} />

            {/* Status-specific content */}
            {status === 'shipped' && (
              <Section>
                <Heading as="h2" style={h2}>
                  Estimated Delivery
                </Heading>
                <Text style={text}>
                  Your package should arrive within 5-7 business days. You can track its progress using the tracking number above.
                </Text>
              </Section>
            )}

            {status === 'delivered' && (
              <Section>
                <Text style={text}>
                  We hope you love your new items! If you have any questions or concerns, please don't hesitate to contact us.
                </Text>
              </Section>
            )}

            {status === 'processing' && (
              <Section>
                <Text style={text}>
                  We're carefully preparing your items for shipment. You'll receive another email with tracking information once your order ships.
                </Text>
              </Section>
            )}

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Link
                href={`${siteUrl}/account?tab=orders`}
                style={button}
              >
                View Order Details
              </Link>
            </Section>

            <Text style={text}>
              Thank you for shopping with Kollect-It!
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Kollect-It. All rights reserved.
            </Text>
            <Text style={footerText}>
              <Link href={`${siteUrl}/contact`} style={footerLink}>
                Contact Us
              </Link>
              {' • '}
              <Link href={`${siteUrl}/account`} style={footerLink}>
                My Account
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default OrderStatusUpdateEmail;

// Styles (reuse from OrderConfirmationEmail with modifications)
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
  textAlign: 'center' as const,
};

const emoji = {
  fontSize: '64px',
  margin: '20px 0',
};

const h1 = {
  color: '#322923',
  fontSize: '32px',
  fontWeight: '400',
  margin: '0 0 20px 0',
  fontFamily: "'Cormorant Garamond', serif",
};

const h2 = {
  color: '#322923',
  fontSize: '22px',
  fontWeight: '500',
  margin: '20px 0 15px 0',
  fontFamily: "'Cormorant Garamond', serif",
  textAlign: 'left' as const,
};

const text = {
  color: '#6b6b6b',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '0 0 15px 0',
  textAlign: 'left' as const,
};

const orderBox = {
  backgroundColor: '#f6f0ee',
  padding: '25px',
  borderRadius: '6px',
  margin: '30px 0',
};

const orderNumberStyle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#322923',
  margin: '0 0 10px 0',
  fontFamily: "'Courier New', monospace",
};

const statusBadge = {
  fontSize: '16px',
  color: '#6b6b6b',
  margin: '0',
};

const trackingText = {
  fontSize: '15px',
  color: '#6b6b6b',
  margin: '5px 0',
  textAlign: 'left' as const,
};

const divider = {
  borderColor: '#d0bca4',
  margin: '20px 0',
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

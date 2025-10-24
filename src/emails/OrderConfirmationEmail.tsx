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

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  total: number;
  subtotal: number;
  tax: number;
  shipping: number;
  items: {
    title: string;
    price: number;
    quantity: number;
  }[];
  shippingAddress: {
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  siteUrl: string;
}

export const OrderConfirmationEmail = ({
  orderNumber = 'KI-1234567890-ABC123',
  customerName = 'John Doe',
  total = 1250.0,
  subtotal = 1150.0,
  tax = 92.0,
  shipping = 0,
  items = [
    { title: 'Classical Landscape Oil Painting', price: 850.0, quantity: 1 },
    { title: 'Antique Pocket Watch', price: 300.0, quantity: 1 },
  ],
  shippingAddress = {
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
  },
  siteUrl = 'http://localhost:3000',
}: OrderConfirmationEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Your order {orderNumber} has been confirmed!</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>KOLLECT • IT</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Heading style={h1}>Order Confirmed!</Heading>

            <Text style={text}>
              Hi {customerName},
            </Text>

            <Text style={text}>
              Thank you for your purchase! We're excited to get your items to you. Your order has been received and is being prepared for shipment.
            </Text>

            {/* Order Details Box */}
            <Section style={orderBox}>
              <Text style={orderNumberStyle}>Order #{orderNumber}</Text>
            </Section>

            {/* Items */}
            <Section style={itemsSection}>
              <Heading as="h2" style={h2}>
                Order Items
              </Heading>
              {items.map((item, index) => (
                <Section key={index} style={itemRow}>
                  <Text style={itemTitle}>{item.title}</Text>
                  <Text style={itemDetails}>
                    ${item.price.toLocaleString()} × {item.quantity}
                  </Text>
                  <Text style={itemTotal}>
                    ${(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </Section>
              ))}
            </Section>

            <Hr style={divider} />

            {/* Totals */}
            <Section style={totalsSection}>
              <Section style={totalRow}>
                <Text style={totalLabel}>Subtotal:</Text>
                <Text style={totalValue}>
                  ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </Section>
              <Section style={totalRow}>
                <Text style={totalLabel}>Shipping:</Text>
                <Text style={totalValue}>
                  {shipping === 0 ? 'Free' : `$${shipping.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                </Text>
              </Section>
              <Section style={totalRow}>
                <Text style={totalLabel}>Tax:</Text>
                <Text style={totalValue}>
                  ${tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </Section>
              <Hr style={divider} />
              <Section style={totalRow}>
                <Text style={totalLabelFinal}>Total:</Text>
                <Text style={totalValueFinal}>
                  ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
              </Section>
            </Section>

            <Hr style={divider} />

            {/* Shipping Address */}
            <Section>
              <Heading as="h2" style={h2}>
                Shipping Address
              </Heading>
              <Text style={address}>
                {shippingAddress.address}<br />
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}<br />
                {shippingAddress.country}
              </Text>
            </Section>

            <Hr style={divider} />

            {/* Next Steps */}
            <Section>
              <Heading as="h2" style={h2}>
                What's Next?
              </Heading>
              <Text style={text}>
                • You'll receive a shipping confirmation email with tracking information once your order ships<br />
                • Estimated delivery: 5-7 business days<br />
                • Questions? Reply to this email anytime
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Link
                href={`${siteUrl}/account?tab=orders`}
                style={button}
              >
                View Order Status
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

export default OrderConfirmationEmail;

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

const orderBox = {
  backgroundColor: '#f6f0ee',
  padding: '20px',
  borderRadius: '6px',
  textAlign: 'center' as const,
  margin: '30px 0',
};

const orderNumberStyle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#322923',
  margin: '0',
  fontFamily: "'Courier New', monospace",
};

const itemsSection = {
  margin: '30px 0',
};

const itemRow = {
  marginBottom: '15px',
  paddingBottom: '15px',
  borderBottom: '1px solid #e5e5e5',
};

const itemTitle = {
  fontSize: '16px',
  fontWeight: '500',
  color: '#322923',
  margin: '0 0 5px 0',
};

const itemDetails = {
  fontSize: '14px',
  color: '#6b6b6b',
  margin: '0',
};

const itemTotal = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#322923',
  margin: '5px 0 0 0',
  textAlign: 'right' as const,
};

const divider = {
  borderColor: '#d0bca4',
  margin: '20px 0',
};

const totalsSection = {
  margin: '20px 0',
};

const totalRow = {
  display: 'flex' as const,
  justifyContent: 'space-between' as const,
  marginBottom: '10px',
};

const totalLabel = {
  fontSize: '15px',
  color: '#6b6b6b',
  margin: '0',
};

const totalValue = {
  fontSize: '15px',
  color: '#322923',
  margin: '0',
};

const totalLabelFinal = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#322923',
  margin: '0',
};

const totalValueFinal = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#322923',
  margin: '0',
};

const address = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#6b6b6b',
  margin: '0',
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

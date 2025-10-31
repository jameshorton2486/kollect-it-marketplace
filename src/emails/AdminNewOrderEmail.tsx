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
} from "@react-email/components";
import * as React from "react";

interface AdminNewOrderEmailProps {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  total: number;
  items: {
    title: string;
    price: number;
    quantity: number;
  }[];
  siteUrl: string;
}

export const AdminNewOrderEmail = ({
  orderNumber = "KI-1234567890-ABC123",
  customerName = "John Doe",
  customerEmail = "john@example.com",
  total = 1250.0,
  items = [
    { title: "Classical Landscape Oil Painting", price: 850.0, quantity: 1 },
    { title: "Antique Pocket Watch", price: 300.0, quantity: 1 },
  ],
  siteUrl = "http://localhost:3000",
}: AdminNewOrderEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        New Order {orderNumber} - ${total.toLocaleString()}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Heading style={logo}>KOLLECT • IT ADMIN</Heading>
          </Section>

          {/* Main Content */}
          <Section style={content}>
            <Text style={emoji}>🎉</Text>

            <Heading style={h1}>New Order Received!</Heading>

            <Text style={text}>
              A new order has been placed and is awaiting processing.
            </Text>

            {/* Order Summary Box */}
            <Section style={summaryBox}>
              <Text style={summaryLabel}>Order Number:</Text>
              <Text style={orderNumberStyle}>{orderNumber}</Text>

              <Hr style={miniDivider} />

              <Text style={summaryLabel}>Customer:</Text>
              <Text style={customerInfo}>{customerName}</Text>
              <Text style={customerEmailStyle}>{customerEmail}</Text>

              <Hr style={miniDivider} />

              <Text style={summaryLabel}>Order Total:</Text>
              <Text style={totalAmount}>
                $
                {total.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </Text>
            </Section>

            {/* Items */}
            <Section>
              <Heading as="h2" style={h2}>
                Order Items ({items.length})
              </Heading>
              {items.map((item, index) => (
                <Section key={index} style={itemRow}>
                  <Text style={itemTitle}>{item.title}</Text>
                  <Text style={itemDetails}>
                    Qty: {item.quantity} × ${item.price.toLocaleString()} = $
                    {(item.price * item.quantity).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </Text>
                </Section>
              ))}
            </Section>

            <Hr style={divider} />

            {/* Action Required */}
            <Section style={alertBox}>
              <Text style={alertTitle}>⚠️ Action Required</Text>
              <Text style={alertText}>
                Please process this order in the admin dashboard and prepare
                items for shipment.
              </Text>
            </Section>

            {/* CTA Button */}
            <Section style={buttonContainer}>
              <Link href={`${siteUrl}/admin/orders`} style={button}>
                View in Admin Dashboard
              </Link>
            </Section>

            {/* Quick Stats */}
            <Section>
              <Heading as="h2" style={h2}>
                Quick Actions
              </Heading>
              <Text style={quickAction}>
                📧{" "}
                <Link href={`mailto:${customerEmail}`} style={actionLink}>
                  Email Customer
                </Link>
              </Text>
              <Text style={quickAction}>
                📦{" "}
                <Link href={`${siteUrl}/admin/orders`} style={actionLink}>
                  Mark as Processing
                </Link>
              </Text>
              <Text style={quickAction}>
                🚚{" "}
                <Link href={`${siteUrl}/admin/orders`} style={actionLink}>
                  Add Tracking Info
                </Link>
              </Text>
            </Section>
          </Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>Kollect-It Admin Notifications</Text>
            <Text style={footerText}>
              <Link href={`${siteUrl}/admin/dashboard`} style={footerLink}>
                Admin Dashboard
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default AdminNewOrderEmail;

// Styles
const main = {
  backgroundColor: "#f3f4f6",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  marginTop: "40px",
  marginBottom: "40px",
  maxWidth: "600px",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
};

const header = {
  backgroundColor: "#1f2937",
  padding: "30px 40px",
  textAlign: "center" as const,
};

const logo = {
  color: "#ffffff",
  fontSize: "24px",
  fontWeight: "600",
  letterSpacing: "2px",
  margin: "0",
  fontFamily: "'Courier New', monospace",
};

const content = {
  padding: "40px",
  textAlign: "center" as const,
};

const emoji = {
  fontSize: "64px",
  margin: "20px 0",
};

const h1 = {
  color: "#111827",
  fontSize: "32px",
  fontWeight: "600",
  margin: "0 0 20px 0",
};

const h2 = {
  color: "#111827",
  fontSize: "20px",
  fontWeight: "600",
  margin: "20px 0 15px 0",
  textAlign: "left" as const,
};

const text = {
  color: "#6b7280",
  fontSize: "16px",
  lineHeight: "26px",
  margin: "0 0 15px 0",
};

const summaryBox = {
  backgroundColor: "#f9fafb",
  padding: "25px",
  borderRadius: "8px",
  margin: "25px 0",
  border: "2px solid #e5e7eb",
};

const summaryLabel = {
  fontSize: "13px",
  fontWeight: "600",
  color: "#6b7280",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  margin: "0 0 5px 0",
};

const orderNumberStyle = {
  fontSize: "20px",
  fontWeight: "600",
  color: "#111827",
  fontFamily: "'Courier New', monospace",
  margin: "0",
};

const customerInfo = {
  fontSize: "16px",
  fontWeight: "500",
  color: "#111827",
  margin: "0 0 3px 0",
};

const customerEmailStyle = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0",
};

const totalAmount = {
  fontSize: "28px",
  fontWeight: "700",
  color: "#059669",
  margin: "0",
};

const miniDivider = {
  borderColor: "#e5e7eb",
  margin: "15px 0",
};

const divider = {
  borderColor: "#d1d5db",
  margin: "25px 0",
};

const itemRow = {
  marginBottom: "12px",
  paddingBottom: "12px",
  borderBottom: "1px solid #f3f4f6",
  textAlign: "left" as const,
};

const itemTitle = {
  fontSize: "15px",
  fontWeight: "500",
  color: "#111827",
  margin: "0 0 4px 0",
};

const itemDetails = {
  fontSize: "14px",
  color: "#6b7280",
  margin: "0",
};

const alertBox = {
  backgroundColor: "#fef3c7",
  padding: "20px",
  borderRadius: "6px",
  border: "2px solid #fbbf24",
  margin: "25px 0",
};

const alertTitle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#92400e",
  margin: "0 0 8px 0",
};

const alertText = {
  fontSize: "14px",
  color: "#92400e",
  margin: "0",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  backgroundColor: "#3b82f6",
  borderRadius: "4px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "600",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 40px",
};

const quickAction = {
  fontSize: "15px",
  color: "#4b5563",
  margin: "10px 0",
  textAlign: "left" as const,
};

const actionLink = {
  color: "#3b82f6",
  textDecoration: "underline",
};

const footer = {
  backgroundColor: "#f3f4f6",
  padding: "30px 40px",
  textAlign: "center" as const,
};

const footerText = {
  color: "#6b7280",
  fontSize: "13px",
  lineHeight: "20px",
  margin: "5px 0",
};

const footerLink = {
  color: "#3b82f6",
  textDecoration: "underline",
};

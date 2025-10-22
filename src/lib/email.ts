import { Resend } from 'resend';
import { OrderConfirmationEmail } from '@/emails/OrderConfirmationEmail';
import { OrderStatusUpdateEmail } from '@/emails/OrderStatusUpdateEmail';
import { WelcomeEmail } from '@/emails/WelcomeEmail';
import { AdminNewOrderEmail } from '@/emails/AdminNewOrderEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'Kollect-It <noreply@kollect-it.com>';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@kollect-it.com';
const SITE_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
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
}

interface StatusUpdateEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  status: string;
  trackingNumber?: string;
  carrier?: string;
}

interface WelcomeEmailData {
  name: string;
  email: string;
}

// Send Order Confirmation Email
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Order Confirmation - ${data.orderNumber}`,
      react: OrderConfirmationEmail({
        ...data,
        siteUrl: SITE_URL,
      }),
    });

    console.log(`✅ Order confirmation email sent to ${data.customerEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error);
    return { success: false, error };
  }
}

// Send Order Status Update Email
export async function sendOrderStatusUpdateEmail(data: StatusUpdateEmailData) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Order ${data.orderNumber} - Status Update`,
      react: OrderStatusUpdateEmail({
        ...data,
        siteUrl: SITE_URL,
      }),
    });

    console.log(`✅ Status update email sent to ${data.customerEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending status update email:', error);
    return { success: false, error };
  }
}

// Send Welcome Email (Newsletter Signup)
export async function sendWelcomeEmail(data: WelcomeEmailData) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject: 'Welcome to Kollect-It!',
      react: WelcomeEmail({
        ...data,
        siteUrl: SITE_URL,
      }),
    });

    console.log(`✅ Welcome email sent to ${data.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error);
    return { success: false, error };
  }
}

// Send Admin New Order Alert
export async function sendAdminNewOrderEmail(data: OrderEmailData) {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: `🎉 New Order: ${data.orderNumber}`,
      react: AdminNewOrderEmail({
        ...data,
        siteUrl: SITE_URL,
      }),
    });

    console.log(`✅ Admin alert email sent for order ${data.orderNumber}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending admin alert email:', error);
    return { success: false, error };
  }
}

// Test Email Connection
export async function testEmailConnection() {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: ADMIN_EMAIL,
      subject: 'Kollect-It Email Test',
      html: '<p>Your email service is configured correctly! ✅</p>',
    });

    console.log('✅ Test email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Email test failed:', error);
    return { success: false, error };
  }
}

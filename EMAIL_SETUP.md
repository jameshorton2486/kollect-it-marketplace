# Email Notification System Guide

## Overview

Kollect-It now has a complete email notification system powered by Resend! Send beautiful, professional emails for orders, updates, and customer engagement.

---

## Features Implemented

### ✅ **Transactional Emails**
- Order confirmation emails to customers
- Order status update notifications
- Admin new order alerts
- Welcome emails for newsletter signups

### ✅ **Professional Templates**
- React-based email components
- Responsive design for all devices
- Branded with Kollect-It colors and fonts
- Clean, modern layouts

### ✅ **Automated Triggers**
- Emails sent automatically on key events
- Order creation → Confirmation + Admin alert
- Status update → Customer notification
- Newsletter signup → Welcome email

### ✅ **Easy Testing**
- Test API endpoint for trying templates
- Console logging for development
- Error handling and retry logic

---

## Setup Instructions

### **1. Create Resend Account**

1. Visit [https://resend.com](https://resend.com)
2. Click "Sign Up" (it's free for up to 100 emails/day)
3. Verify your email address
4. Complete onboarding

### **2. Get Your API Key**

1. Go to [https://resend.com/api-keys](https://resend.com/api-keys)
2. Click "Create API Key"
3. Name it: `Kollect-It Production`
4. Permission: **Full access**
5. Click "Create"
6. **Copy the API key** (you'll only see it once!)

### **3. Add Domain (Production Only)**

For production, you need to verify your domain:

1. Go to [https://resend.com/domains](https://resend.com/domains)
2. Click "Add Domain"
3. Enter your domain: `kollect-it.com`
4. Add the DNS records to your domain provider
5. Wait for verification (usually 5-15 minutes)

**For Development/Testing:**
- Use the default: `onboarding@resend.dev`
- Emails will only be sent to your verified email addresses

### **4. Update Environment Variables**

Open your `.env` file and add:

```env
# Email Configuration (Resend)
RESEND_API_KEY="re_your_actual_api_key_here"
EMAIL_FROM="Kollect-It <noreply@kollect-it.com>"
ADMIN_EMAIL="admin@kollect-it.com"
```

**Example:**
```env
RESEND_API_KEY="re_abc123def456ghi789jkl012"
EMAIL_FROM="Kollect-It <noreply@kollect-it.com>"
ADMIN_EMAIL="admin@kollect-it.com"
```

**Important:**
- Replace `noreply@kollect-it.com` with your actual domain after verification
- For development, use: `EMAIL_FROM="Kollect-It <onboarding@resend.dev>"`
- Update `ADMIN_EMAIL` to your actual admin email

### **5. Restart Development Server**

```bash
cd kollect-it-dynamic
bun run dev
```

---

## Email Templates

### **1. Order Confirmation Email**

**Sent When:** Customer completes checkout
**Recipient:** Customer
**Includes:**
- Order number
- Complete item list with prices
- Subtotal, shipping, tax, total
- Shipping address
- "View Order Status" button

**Preview:**
```
Subject: Order Confirmation - KI-1234567890-ABC123

Order Confirmed!

Hi John Doe,

Thank you for your purchase! We're excited to get your items to you...

Order #KI-1234567890-ABC123

Order Items:
- Classical Landscape Oil Painting × 1 - $850.00
- Antique Pocket Watch × 1 - $300.00

Total: $1,250.00

[View Order Status Button]
```

### **2. Order Status Update Email**

**Sent When:** Admin updates order status
**Recipient:** Customer
**Includes:**
- Order number
- New status with emoji
- Tracking number (if available)
- Carrier information (if available)
- Estimated delivery

**Preview:**
```
Subject: Order KI-1234567890-ABC123 - Status Update

🚚 Order Shipped!

Hi John Doe,

Your order is on its way!

Order #KI-1234567890-ABC123
Status: Shipped

Tracking Information:
Carrier: USPS
Tracking Number: 9400111899223344556677

[View Order Details Button]
```

### **3. Welcome Email**

**Sent When:** Customer signs up for newsletter
**Recipient:** New subscriber
**Includes:**
- Welcome message
- What to expect (features)
- Browse collections CTA
- Category links

**Preview:**
```
Subject: Welcome to Kollect-It!

Welcome to Kollect-It!

Hi John,

Thank you for joining our community of collectors...

What to Expect:
🎨 Curated Collections
✨ Expert Authentication
📧 Exclusive Updates
🌟 Special Offers

[Browse Collections Button]
```

### **4. Admin New Order Alert**

**Sent When:** New order is placed
**Recipient:** Admin
**Includes:**
- Order number
- Customer information
- Order total
- Item list
- Quick actions

**Preview:**
```
Subject: 🎉 New Order: KI-1234567890-ABC123

New Order Received!

Order Number: KI-1234567890-ABC123
Customer: John Doe (john@example.com)
Order Total: $1,250.00

⚠️ Action Required
Please process this order in the admin dashboard...

[View in Admin Dashboard Button]
```

---

## Testing Emails

### **Method 1: API Test Endpoint (Recommended)**

1. Make sure you're logged in as admin
2. Use a tool like Postman or curl:

```bash
# Test connection
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"type": "connection"}'

# Test order confirmation
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"type": "order-confirmation"}'

# Test status update
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"type": "status-update"}'

# Test welcome email
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"type": "welcome"}'

# Test admin alert
curl -X POST http://localhost:3000/api/email/test \
  -H "Content-Type: application/json" \
  -d '{"type": "admin-alert"}'
```

### **Method 2: Real Flow Testing**

**Test Order Confirmation:**
1. Add items to cart
2. Complete checkout with test card: `4242 4242 4242 4242`
3. Check your email inbox

**Test Status Update:**
1. Go to admin dashboard
2. View an order
3. Click "Edit" and change status to "Shipped"
4. Add tracking number
5. Save changes
6. Check customer email inbox

---

## Email Events & Triggers

| Event                    | Email Sent           | Recipient |
|--------------------------|----------------------|-----------|
| Order Created            | Order Confirmation   | Customer  |
| Order Created            | Admin New Order      | Admin     |
| Order Status Changed     | Status Update        | Customer  |
| Newsletter Signup        | Welcome Email        | Subscriber|

---

## Customizing Email Templates

All email templates are React components located in `src/emails/`:

```
src/emails/
├── OrderConfirmationEmail.tsx
├── OrderStatusUpdateEmail.tsx
├── WelcomeEmail.tsx
└── AdminNewOrderEmail.tsx
```

### **How to Edit:**

1. Open the template file (e.g., `OrderConfirmationEmail.tsx`)
2. Edit the JSX/styles
3. Save and restart server
4. Test using API endpoint

**Example - Change Button Color:**

```tsx
// In any email template file
const button = {
  backgroundColor: '#C9A66B',  // Change this color
  borderRadius: '4px',
  color: '#ffffff',
  // ... other styles
};
```

### **Preview Emails (Development)**

Install React Email CLI:
```bash
bun add -d react-email
```

Add preview script to `package.json`:
```json
{
  "scripts": {
    "email": "email dev -p 3001"
  }
}
```

Run preview:
```bash
bun run email
```

Visit: http://localhost:3001

---

## Email Service (Resend)

### **Why Resend?**

✅ **Modern & Developer-Friendly**
- React Email component support
- Simple API
- Great documentation

✅ **Generous Free Tier**
- 100 emails/day free
- 3,000 emails/month free
- Perfect for testing and small shops

✅ **Production Ready**
- 99.9% uptime SLA
- Built-in analytics
- Bounce and spam handling

### **Pricing**

| Plan       | Emails/Month | Price    |
|------------|--------------|----------|
| Free       | 3,000        | $0       |
| Pro        | 50,000       | $20/mo   |
| Business   | 100,000      | $80/mo   |

[See full pricing](https://resend.com/pricing)

---

## Production Checklist

Before going live:

### **1. Domain Verification**
- [ ] Add domain to Resend
- [ ] Configure DNS records
- [ ] Verify domain (green checkmark)

### **2. Email Addresses**
- [ ] Update `EMAIL_FROM` with your domain
- [ ] Update `ADMIN_EMAIL` with real admin email
- [ ] Test with real recipient addresses

### **3. Template Review**
- [ ] Check all templates render correctly
- [ ] Verify links work (especially on mobile)
- [ ] Test on multiple email clients (Gmail, Outlook, Apple Mail)

### **4. Compliance**
- [ ] Add unsubscribe link to marketing emails
- [ ] Include physical address in footer (if required)
- [ ] Review anti-spam regulations (CAN-SPAM, GDPR)

### **5. Monitoring**
- [ ] Set up Resend webhooks for bounce tracking
- [ ] Monitor email deliverability
- [ ] Check spam score regularly

---

## Troubleshooting

### **Emails Not Sending**

**Check API Key:**
```bash
# In your .env file
RESEND_API_KEY="re_..."  # Must start with "re_"
```

**Check Console Logs:**
```bash
# Look for these messages:
✅ Order confirmation email sent to customer@example.com
❌ Error sending order confirmation email: [error details]
```

**Verify Email Address (Development):**
- In Resend dashboard, go to Settings → Team
- Make sure recipient email is verified
- Or use `onboarding@resend.dev` as FROM address

### **Emails Going to Spam**

**Solutions:**
1. Verify your sending domain
2. Add SPF and DKIM records
3. Warm up your domain (start with low volume)
4. Avoid spam trigger words
5. Include unsubscribe link

### **Template Not Rendering**

**Check Syntax:**
```tsx
// Ensure all components are imported
import { Html, Body, Container, ... } from '@react-email/components';

// Verify JSX is valid
<Text style={text}>
  Content here
</Text>
```

**Restart Server:**
```bash
# Kill and restart dev server
bun run dev
```

---

## API Reference

### **Email Service Functions**

**Send Order Confirmation:**
```typescript
import { sendOrderConfirmationEmail } from '@/lib/email';

await sendOrderConfirmationEmail({
  orderNumber: 'KI-123',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  total: 1250.00,
  subtotal: 1150.00,
  tax: 92.00,
  shipping: 0,
  items: [...],
  shippingAddress: {...},
});
```

**Send Status Update:**
```typescript
import { sendOrderStatusUpdateEmail } from '@/lib/email';

await sendOrderStatusUpdateEmail({
  orderNumber: 'KI-123',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  status: 'shipped',
  trackingNumber: '9400...',
  carrier: 'USPS',
});
```

**Send Welcome Email:**
```typescript
import { sendWelcomeEmail } from '@/lib/email';

await sendWelcomeEmail({
  name: 'John Doe',
  email: 'john@example.com',
});
```

**Send Admin Alert:**
```typescript
import { sendAdminNewOrderEmail } from '@/lib/email';

await sendAdminNewOrderEmail({
  orderNumber: 'KI-123',
  customerName: 'John Doe',
  customerEmail: 'john@example.com',
  total: 1250.00,
  items: [...],
  // ... other order data
});
```

---

## Advanced Features

### **Add New Email Template**

1. Create new file: `src/emails/YourEmailTemplate.tsx`
2. Copy structure from existing template
3. Customize content and styles
4. Export template component
5. Add function to `src/lib/email.ts`
6. Use in your application

### **Email Analytics**

Resend provides analytics:
- Open rates
- Click rates
- Bounce tracking
- Delivery status

Access at: [https://resend.com/emails](https://resend.com/emails)

### **Webhooks**

Set up webhooks to track email events:

1. Go to [https://resend.com/webhooks](https://resend.com/webhooks)
2. Add endpoint: `https://your-site.com/api/webhooks/email`
3. Select events: delivered, bounced, opened, clicked
4. Create webhook handler in your app

---

## Summary

✅ Complete email notification system with Resend
✅ 4 professional email templates (order, status, welcome, admin)
✅ Automated triggers on key events
✅ Easy testing with API endpoint
✅ React-based templates for easy customization
✅ Production-ready with domain verification
✅ Free tier for development and testing

**The email system is ready to use!** Just add your Resend API key and start sending beautiful emails.

Happy emailing! 📧🎨📚⚔️

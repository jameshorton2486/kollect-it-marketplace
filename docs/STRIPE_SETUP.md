# Stripe Payment Integration Guide

## Overview

Kollect-It now has a complete Stripe checkout system! Customers can securely pay for their purchases using credit cards, and orders are automatically created in the database.

---

## Features Implemented

### ✅ **Secure Stripe Checkout**
- Two-step checkout flow (Shipping → Payment)
- Stripe Payment Elements for secure card processing
- PCI-compliant payment handling
- Real-time payment validation

### ✅ **Order Management**
- Automatic order creation after successful payment
- Unique order numbers (e.g., `KI-1234567890-ABC123`)
- Order history in customer account
- Email receipts (via Stripe)

### ✅ **Checkout Flow**
- **Step 1**: Shipping information form with validation
- **Step 2**: Secure Stripe payment form
- **Success Page**: Order confirmation with order number

### ✅ **Payment Processing**
- Support for all major credit cards
- Real-time payment authorization
- Automatic payment intent creation
- Duplicate order prevention

---

## Stripe Setup Instructions

### **1. Create a Stripe Account**

1. Visit [https://stripe.com](https://stripe.com)
2. Click "Start now" or "Sign up"
3. Complete the registration process
4. Verify your email address

### **2. Get Your API Keys**

1. Log in to your Stripe Dashboard: [https://dashboard.stripe.com](https://dashboard.stripe.com)
2. Click on **"Developers"** in the left sidebar
3. Click on **"API keys"**
4. You'll see two types of keys:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

⚠️ **IMPORTANT**:
- Never commit your **Secret key** to version control
- Use **test keys** for development
- Switch to **live keys** only for production

### **3. Update Environment Variables**

Open your `.env` file and add your Stripe keys:

```env
# Stripe Configuration
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_your-actual-publishable-key-here"
STRIPE_SECRET_KEY="sk_test_your-actual-secret-key-here"
```

**Example:**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51ABC123DEF456GHI789JKL012MNO345PQR678"
STRIPE_SECRET_KEY="sk_test_51ABC123DEF456GHI789JKL012MNO345PQR678STU901VWX234YZ"
```

### **4. Restart Development Server**

After updating your `.env` file:

```bash
# Stop the server (Ctrl+C)
# Then restart it
cd kollect-it-dynamic
bun run dev
```

### **5. Test the Integration**

#### **Test Card Numbers (Stripe Test Mode)**

Stripe provides test card numbers that simulate different scenarios:

| Card Number         | Result           | CVC  | Expiry     |
|---------------------|------------------|------|------------|
| 4242 4242 4242 4242 | Success          | Any  | Any future |
| 4000 0025 0000 3155 | 3D Secure Auth   | Any  | Any future |
| 4000 0000 0000 9995 | Decline          | Any  | Any future |
| 4000 0000 0000 0002 | Charge declined  | Any  | Any future |

**For all test cards:**
- Use any valid future expiration date (e.g., `12/25`)
- Use any 3-digit CVC (e.g., `123`)
- Use any 5-digit ZIP code (e.g., `12345`)

---

## How to Test the Checkout Flow

### **Step 1: Add Items to Cart**

1. Visit http://localhost:3000
2. Click on any product
3. Click "Add to Cart"
4. Repeat for multiple products if desired

### **Step 2: View Cart**

1. Click the cart icon in the header
2. Review your items
3. Click "Proceed to Checkout"

### **Step 3: Enter Shipping Information**

1. Fill in all required fields:
   - Full Name
   - Email Address
   - Phone Number
   - Street Address
   - City, State, ZIP Code
2. Click "Continue to Payment"

### **Step 4: Complete Payment**

1. Enter test card number: `4242 4242 4242 4242`
2. Enter expiry: `12/25`
3. Enter CVC: `123`
4. Enter ZIP: `12345`
5. Click "Pay Now"

### **Step 5: View Confirmation**

1. You'll be redirected to the success page
2. Note your order number
3. Check your email for Stripe receipt
4. View order in account dashboard

---

## Checkout Page Routes

### **Public Routes**
- `/checkout` - Main checkout page (requires items in cart)
- `/checkout/success?payment_intent=xxx` - Order confirmation

### **API Routes**
- `POST /api/checkout/create-payment-intent` - Creates Stripe Payment Intent
- `POST /api/checkout/create-order` - Creates order in database after payment

---

## Payment Flow Diagram

```
1. User adds items to cart
   ↓
2. User clicks "Proceed to Checkout"
   ↓
3. User fills shipping information
   ↓
4. Backend creates Payment Intent with Stripe
   ↓
5. User enters payment details (Stripe Elements)
   ↓
6. Stripe processes payment securely
   ↓
7. Payment succeeds → Order created in database
   ↓
8. User redirected to success page
   ↓
9. Email receipt sent (by Stripe)
```

---

## Database Schema

### **Order Model**

```prisma
model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique
  user            User?       @relation(fields: [userId], references: [id])
  userId          String?
  items           OrderItem[]
  status          String      @default("processing")
  subtotal        Float
  tax             Float
  shipping        Float
  total           Float
  shippingAddress String
  shippingCity    String
  shippingState   String
  shippingZip     String
  shippingCountry String
  paymentMethod   String?     // Stores Payment Intent ID
  paymentStatus   String      @default("paid")
  notes           String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}
```

### **OrderItem Model**

```prisma
model OrderItem {
  id        String   @id @default(cuid())
  order     Order    @relation(fields: [orderId], references: [id])
  orderId   String
  product   Product  @relation(fields: [productId], references: [id])
  productId String
  title     String   // Store title at time of purchase
  price     Float    // Store price at time of purchase
  quantity  Int
  createdAt DateTime @default(now())
}
```

---

## Security Features

### **PCI Compliance**
- Card details never touch your server
- Stripe Elements handles all card data
- Secure tokenization before payment

### **Payment Verification**
- Payment Intent confirmation before order creation
- Duplicate order prevention
- Automatic retry handling

### **Data Protection**
- Environment variables for sensitive keys
- Secure server-side API routes
- Session-based authentication

---

## Stripe Dashboard

### **View Payments**

1. Go to [https://dashboard.stripe.com/test/payments](https://dashboard.stripe.com/test/payments)
2. See all test payments
3. Click on any payment to see details

### **View Customers**

1. Go to [https://dashboard.stripe.com/test/customers](https://dashboard.stripe.com/test/customers)
2. See customer information
3. Stripe automatically creates customer records

### **Test Webhooks (Optional)**

If you want to receive payment confirmation webhooks:

1. Go to **Developers → Webhooks**
2. Click "Add endpoint"
3. Use your deployed URL: `https://your-site.com/api/webhooks/stripe`
4. Select events: `payment_intent.succeeded`, `payment_intent.failed`

---

## Going Live (Production)

### **1. Activate Your Stripe Account**

1. Complete Stripe's business verification
2. Provide required business information
3. Add bank account for payouts

### **2. Switch to Live Keys**

Update your `.env` file:

```env
# Production Stripe Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_your-live-publishable-key"
STRIPE_SECRET_KEY="sk_live_your-live-secret-key"
```

### **3. Test in Production Mode**

- Use real card numbers
- Test the full flow end-to-end
- Verify emails are sent correctly

### **4. Enable Additional Features (Optional)**

- Set up Stripe Radar for fraud prevention
- Enable automatic tax calculation
- Configure email templates

---

## Troubleshooting

### **"Invalid API Key" Error**

- Check that you've added keys to `.env`
- Ensure keys start with `pk_test_` and `sk_test_`
- Restart development server after updating `.env`

### **Payment Not Processing**

- Verify you're using a valid test card
- Check Stripe Dashboard for error messages
- Look at browser console for errors

### **Order Not Created**

- Verify payment succeeded in Stripe Dashboard
- Check database for order with payment intent ID
- Look at server logs for API errors

### **Redirecting to Cart**

- Cart must have items before checkout
- Items are stored in localStorage
- Try clearing browser cache and re-adding items

---

## Pricing & Fees

### **Stripe Fees**
- **2.9% + $0.30** per successful card charge (US)
- No monthly fees
- No setup fees
- Pay only for successful payments

### **Kollect-It Implementation**
- Tax calculated at 8%
- Free shipping (you can modify this)
- Order minimum: None (you can add one)

---

## Email Receipts

Stripe automatically sends email receipts to customers when:
- Payment succeeds
- Receipt email is provided in Payment Intent
- Email settings enabled in Stripe Dashboard

**To customize emails:**
1. Go to **Settings → Emails**
2. Customize your receipt template
3. Add your logo and branding

---

## Future Enhancements

Ready to add:

- ✅ Automatic inventory deduction after purchase
- ✅ Refund processing through admin panel
- ✅ Shipping rate calculation (ShipStation, EasyPost)
- ✅ Discount codes and coupons
- ✅ Subscription products
- ✅ Digital product downloads
- ✅ Gift cards
- ✅ Apple Pay / Google Pay
- ✅ PayPal integration

---

## Testing Checklist

Before deploying to production, test:

- [ ] Add multiple items to cart
- [ ] Remove items from cart
- [ ] Update quantities
- [ ] Proceed to checkout
- [ ] Fill shipping form with validation
- [ ] Complete payment with test card
- [ ] View success page with order number
- [ ] Receive email receipt from Stripe
- [ ] Check order in account dashboard
- [ ] Verify order in database
- [ ] View payment in Stripe Dashboard

---

## Support

### **Stripe Documentation**
- [https://stripe.com/docs](https://stripe.com/docs)
- [https://stripe.com/docs/testing](https://stripe.com/docs/testing)

### **Stripe Support**
- Email: support@stripe.com
- Dashboard: [https://dashboard.stripe.com](https://dashboard.stripe.com)

### **Need Help?**
If you encounter issues:
1. Check Stripe Dashboard for payment errors
2. Review server logs for API errors
3. Test with different test cards
4. Contact Stripe support for payment issues

---

## Summary

✅ Full Stripe checkout integration with Payment Elements
✅ Two-step checkout flow (Shipping → Payment)
✅ Automatic order creation and tracking
✅ Email receipts via Stripe
✅ Secure, PCI-compliant payment processing
✅ Test mode ready with test card numbers
✅ Production-ready with live keys

**The checkout system is ready to process real payments!** Just add your Stripe API keys and test the flow.

Happy selling! 🎨📚⚔️

# Stripe Payment Setup Guide

**Stripe Integration**: Payment processing for Kollect-It marketplace

---

## 🎯 Overview

The Kollect-It marketplace uses Stripe for secure payment processing:

- **Test Mode**: For development and verification (`pk_test_`, `sk_test_`)
- **Live Mode**: For production (switch after full testing)
- **Payment Intents**: Secure two-step checkout flow
- **Server-side validation**: Prevents price tampering

---

## 🔧 Setup Instructions

### 1. Create Stripe Account

1. Go to: **https://stripe.com**
2. Click **"Start now"** → Sign up
3. Complete business verification (required for live mode)
4. Activate account

### 2. Get Test API Keys

1. Go to: **https://dashboard.stripe.com/test/apikeys**
2. **Important**: Make sure "Viewing test data" toggle is **ON** (top right)
3. Copy **Publishable key**: `pk_test_...`
4. Click **"Reveal test key"** → Copy **Secret key**: `sk_test_...`

### 3. Add to Environment Variables

**Local (.env)**:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51ABC123..."
STRIPE_SECRET_KEY="sk_test_51XYZ789..."
```

**Netlify**:

1. Site settings → Environment variables
2. Add both variables
3. Deploy

### 4. Verify Integration

**Test Checkout**:

1. Add product to cart
2. Go to checkout
3. Use **Test Card**: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/25`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `10001`)
4. Complete payment
5. Verify order created in admin dashboard

**Check Stripe Dashboard**:

1. Go to: https://dashboard.stripe.com/test/payments
2. Verify test payment appears
3. Check payment status: "Succeeded"

---

## 💳 Test Cards

### Successful Payments

| Card Number | Description |
|-------------|-------------|
| `4242 4242 4242 4242` | Visa (succeeds) |
| `4000 0566 5566 5556` | Visa (requires 3D Secure) |
| `5555 5555 5555 4444` | Mastercard (succeeds) |

### Failed Payments (for testing error handling)

| Card Number | Error |
|-------------|-------|
| `4000 0000 0000 0002` | Card declined (generic) |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0069` | Expired card |
| `4000 0000 0000 0127` | Incorrect CVC |

**All test cards**:

- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **ZIP**: Any 5 digits

**Full list**: https://stripe.com/docs/testing#cards

---

## 🔐 Security Features

### Server-Side Validation

The marketplace validates cart prices **server-side** before creating payment:

```typescript
// src/app/api/checkout/create-payment-intent/route.ts
// 1. Validates cart items against database prices
// 2. Creates Payment Intent with validated amounts
// 3. Returns client secret for payment
```

**Prevents**:

- ❌ Price tampering via browser dev tools
- ❌ Quantity manipulation
- ❌ Fake checkout flows

### Payment Verification

Orders are created **only after** payment succeeds:

```typescript
// src/app/api/checkout/create-order/route.ts
// 1. Retrieves Payment Intent from Stripe
// 2. Verifies status === 'succeeded'
// 3. Creates order in database
// 4. Sends confirmation emails
```

**Prevents**:

- ❌ Orders without payment
- ❌ Failed payment orders
- ❌ Duplicate orders

---

## 🚀 Going Live (Switch to Production)

### Prerequisites Checklist

Before switching to live keys:

- [ ] **Full testing complete**: Test all scenarios with test cards
- [ ] **Business verified**: Stripe account activated
- [ ] **Bank account connected**: For payouts
- [ ] **Email verified**: Business contact email
- [ ] **All features tested**: Checkout, refunds, order management
- [ ] **Error handling verified**: Test failed payments work correctly

### Switch to Live Keys

#### 1. Get Live API Keys

1. Go to: **https://dashboard.stripe.com/apikeys** (not /test/)
2. **Important**: Toggle "Viewing test data" to **OFF**
3. Copy **Publishable key**: `pk_live_...`
4. Click **"Reveal live key"** → Copy **Secret key**: `sk_live_...`

#### 2. Update Environment Variables

**Netlify**:

1. Site settings → Environment variables
2. Update `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `pk_live_...`
3. Update `STRIPE_SECRET_KEY` to `sk_live_...`
4. **Critical**: Save changes
5. Redeploy site

**⚠️ WARNING**:

- Test cards **will NOT work** with live keys
- Real cards will be charged real money
- Ensure you're ready for production before switching

#### 3. Enable Radar (Fraud Protection)

1. Go to: https://dashboard.stripe.com/radar
2. Click **"Turn on Radar"**
3. Configure rules:
   - Block payments from high-risk countries
   - Require 3D Secure for large amounts
   - Review suspicious patterns

**Recommended Rules**:

- Block if CVC check fails
- Block if postal code check fails
- Review if shipping address doesn't match billing

#### 4. Verify Live Payments

1. Make a **real test purchase** (small amount)
2. Verify charge appears in dashboard
3. Verify email notifications sent
4. Verify order created correctly
5. Process a refund to verify refunds work

---

## 🔔 Webhooks (Optional but Recommended)

Webhooks enable Stripe to notify your app about payment events.

### Why Use Webhooks

- ✅ Handle asynchronous events (chargebacks, refunds)
- ✅ Redundancy if payment callback fails
- ✅ Keep order status in sync with Stripe
- ✅ Required for subscription features (future)

### Setup Webhook Endpoint

**Already created**: `src/app/api/webhooks/stripe/route.ts`

**Handles**:

- `payment_intent.succeeded` - Update order status to paid
- `payment_intent.payment_failed` - Mark order as failed
- `charge.succeeded` - Log successful charge
- `charge.failed` - Log failed charge

### Configure in Stripe Dashboard

#### 1. Add Webhook Endpoint

1. Go to: https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. **Endpoint URL**: `https://your-site.netlify.app/api/webhooks/stripe`
4. **Events to send**: Select:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.succeeded`
   - `charge.failed`
5. Click **"Add endpoint"**

#### 2. Get Webhook Secret

1. Click on the newly created endpoint
2. **Signing secret**: Click **"Reveal"**
3. Copy secret (starts with `whsec_`)

#### 3. Add to Environment Variables

**Netlify**:

1. Site settings → Environment variables
2. Add variable:
   - **Key**: `STRIPE_WEBHOOK_SECRET`
   - **Value**: `whsec_...` (your secret)
3. Redeploy

#### 4. Test Webhook

1. Go to webhook endpoint in dashboard
2. Click **"Send test webhook"**
3. Select event: `payment_intent.succeeded`
4. Click **"Send test event"**
5. Verify response: `200 OK`

**Check logs**:

- Netlify: Functions → stripe webhook → Recent logs
- Should show: "Received webhook event: payment_intent.succeeded"

---

## 💰 Pricing & Fees

### Stripe Fees (Standard)

- **Per transaction**: 2.9% + $0.30
- **International cards**: +1.5%
- **Currency conversion**: +1%

**Example**:

- Product: $100.00
- Stripe fee: $3.20 (2.9% + $0.30)
- You receive: $96.80

### Fee Handling Options

**Option 1: Absorb fees** (current setup)

```typescript
// Customer pays $100, you receive ~$96.80
const amount = product.price * 100; // $100.00
```

**Option 2: Pass fees to customer**

```typescript
// Customer pays $103.20, you receive $100
const subtotal = product.price;
const stripeFee = (subtotal * 0.029) + 0.30;
const total = subtotal + stripeFee;
```

**Recommendation**: Absorb fees (better customer experience)

---

## 🆘 Troubleshooting

### "Stripe publishable key is invalid"

**Fix**:

1. Verify key starts with `pk_test_` (test) or `pk_live_` (live)
2. Check for extra spaces or quotes
3. Ensure variable name is `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
4. Redeploy after changing

### "Payment Intent creation failed"

**Check**:

1. `STRIPE_SECRET_KEY` is set correctly
2. Key starts with `sk_test_` or `sk_live_`
3. Test mode toggle matches key type (test vs live)
4. Check Stripe Dashboard → Logs for specific error

### "Payment succeeds but order not created"

**Debug**:

1. Check browser console for errors
2. Verify `/api/checkout/create-order` endpoint works
3. Check Netlify function logs
4. Verify database connection
5. Check health endpoint: `/api/health`

### "Test card declined"

**Verify**:

1. Using correct test card: `4242 4242 4242 4242`
2. Expiry is future date
3. Stripe is in test mode
4. Using test keys (not live keys)

### Webhook not receiving events

**Fix**:

1. Verify endpoint URL is correct (HTTPS, not HTTP)
2. Check `STRIPE_WEBHOOK_SECRET` is set
3. Endpoint must be publicly accessible
4. Check Netlify function logs for errors
5. Test with "Send test webhook" in Stripe dashboard

---

## 📊 Monitoring & Analytics

### Stripe Dashboard

**Key sections**:

- **Payments**: All transactions
- **Customers**: Customer records
- **Logs**: API calls and errors
- **Radar**: Fraud detection
- **Reports**: Financial reports

### Best Practices

1. **Check daily**: Review payments and disputes
2. **Monitor fraud**: Review Radar alerts
3. **Track refunds**: Monitor refund rate (should be <2%)
4. **Review logs**: Check for API errors
5. **Analyze patterns**: Identify peak sales times

---

## 🔄 Refunds

### Process Refund via Stripe Dashboard

1. Go to: https://dashboard.stripe.com/payments
2. Find payment to refund
3. Click payment → **"Refund"**
4. Enter amount (full or partial)
5. Reason: Select reason
6. Click **"Refund"**

**Timeline**:

- Credit card: 5-10 business days
- Debit card: 5-10 business days
- Customer sees "pending" immediately

### Process Refund via API (Future Enhancement)

```typescript
// src/app/api/admin/orders/[id]/refund/route.ts
const refund = await stripe.refunds.create({
  payment_intent: order.paymentMethod,
  amount: order.total * 100, // cents
  reason: 'requested_by_customer',
});
```

---

## 📚 Additional Resources

- **Stripe Documentation**: https://stripe.com/docs
- **Testing Guide**: https://stripe.com/docs/testing
- **Payment Intents**: https://stripe.com/docs/payments/payment-intents
- **Webhooks**: https://stripe.com/docs/webhooks
- **API Reference**: https://stripe.com/docs/api

---

**Last Updated**: October 24, 2025
**Version**: 1.0.0
**Integration**: Stripe Payment Intents API

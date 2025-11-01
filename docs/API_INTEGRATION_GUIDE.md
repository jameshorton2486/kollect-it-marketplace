# API Integration Guide

Complete guide to integrating and testing ImageKit, Resend, and Stripe.

---

## 🖼️ ImageKit Integration

### Step 1: Get ImageKit Credentials

1. Go to https://imagekit.io/dashboard
2. Sign up or log in
3. Navigate to **Developer options**
4. Copy the following:
   - URL Endpoint (e.g., `https://ik.imagekit.io/your-id/`)
   - Public Key (starts with `public_`)
   - Private Key (starts with `private_`)

### Step 2: Update Environment Variables

Add to `.env`:

```bash
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/YOUR_IMAGEKIT_ID/
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_your_key_here
IMAGEKIT_PRIVATE_KEY=private_your_key_here
```

### Step 3: Create Upload Folder

1. Go to https://imagekit.io/dashboard/media-library
2. Create folder structure: `Home/Kollect-it/products/`
3. This is where product images will be uploaded

### Step 4: Test ImageKit Auth

```bash
# Start dev server
bun run dev

# Test auth endpoint
curl http://localhost:3000/api/imagekit-auth
```

Expected response:

```json
{
  "token": "uuid-here",
  "expire": 1234567890,
  "signature": "hex-signature"
}
```

### Step 5: Upload Test Image

From admin dashboard:

1. Go to `/admin/products/new`
2. Upload an image
3. Verify it appears in ImageKit media library under `/Kollect-it/products/`

### Image Transformations

Use the helper functions in `src/lib/imagekit.ts`:

```typescript
import { getImageKitUrl, imageTransformations } from '@/lib/imagekit';

// Get thumbnail
const thumb = getImageKitUrl('/products/image.jpg', imageTransformations.thumbnail);
// Result: https://ik.imagekit.io/xxx/tr:w-400,h-400,fo-auto,q-80/products/image.jpg

// Get product card image
const card = getImageKitUrl('/products/image.jpg', imageTransformations.productCard);
```

Available transformations:

- `thumbnail`: 400x400, auto-focus, 80% quality
- `productCard`: 600x600, auto-focus, 85% quality
- `productDetail`: 1200x1200, auto-focus, 90% quality
- `gallery`: 1600x1600, auto-focus, 95% quality

---

## 📧 Resend Email Integration

### Step 1: Get Resend API Key

1. Go to https://resend.com/api-keys
2. Sign up or log in
3. Click "Create API Key"
4. Copy the key (starts with `re_`)

### Step 2: Verify Domain (Production Only)

For production, verify your domain:

1. Go to https://resend.com/domains
2. Click "Add Domain"
3. Add DNS records (TXT, MX, CNAME)
4. Wait for verification (up to 48 hours)

For development, use Resend's sandbox domain:

```bash
EMAIL_FROM="Kollect-It <onboarding@resend.dev>"
```

### Step 3: Update Environment Variables

Add to `.env`:

```bash
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=Kollect-It <noreply@yourdomain.com>
ADMIN_EMAIL=admin@yourdomain.com
```

**Important**:

- `EMAIL_FROM` must use a verified domain (or resend.dev for testing)
- `ADMIN_EMAIL` receives admin notifications

### Step 4: Test Email Sending

```bash
# Start dev server
bun run dev

# Send test email
curl http://localhost:3000/api/email/test
```

Expected response:

```json
{
  "success": true,
  "message": "Test email sent successfully",
  "messageId": "re_...",
  "sentTo": "admin@yourdomain.com",
  "sentFrom": "Kollect-It <noreply@yourdomain.com>"
}
```

### Step 5: Check Your Inbox

Check your `ADMIN_EMAIL` inbox for the test email.

**If email doesn't arrive**:

1. Check spam folder
2. Verify RESEND_API_KEY is correct
3. Verify EMAIL_FROM uses verified domain
4. Check Resend dashboard: https://resend.com/emails

### Step 6: Verify Email Templates

Email templates are in `src/emails/`:

- `OrderConfirmationEmail.tsx` - Sent to customers after purchase
- `AdminNewOrderEmail.tsx` - Sent to admin for new orders
- `OrderStatusUpdateEmail.tsx` - Sent when order status changes
- `WelcomeEmail.tsx` - Sent to new newsletter subscribers

---

## 💳 Stripe Payment Integration

### Step 1: Get Stripe API Keys

1. Go to https://dashboard.stripe.com/test/apikeys
2. Sign up or log in
3. Copy **Publishable key** (starts with `pk_test_`)
4. Click "Reveal test key token" on **Secret key**
5. Copy **Secret key** (starts with `sk_test_`)

### Step 2: Update Environment Variables

Add to `.env`:

```bash
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
```

### Step 3: Verify Configuration

Stripe is already configured in `src/lib/stripe.ts` with:

- ✅ API key validation
- ✅ TypeScript support
- ✅ Amount formatting helpers
- ✅ Uses account default API version (safest approach)

### Step 4: Test Payment Flow

1. Start dev server: `bun run dev`
2. Add product to cart
3. Go to checkout
4. Use Stripe test card:
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date
   - CVC: Any 3 digits
   - ZIP: Any 5 digits

5. Complete payment
6. Check order confirmation

### Step 5: Verify in Stripe Dashboard

1. Go to https://dashboard.stripe.com/test/payments
2. Verify test payment appears
3. Check payment details

### Test Cards

Stripe provides test cards for different scenarios:

| Card Number | Scenario |
|-------------|----------|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0000 0000 9995` | Declined (insufficient funds) |
| `4000 0025 0000 3155` | Requires authentication (3D Secure) |

See more: https://stripe.com/docs/testing

---

## 🔍 Health Check Endpoint

Test all integrations at once:

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "status": "healthy",
  "timestamp": "2025-10-24T...",
  "database": "connected",
  "environment": {
    "DATABASE_URL": true,
    "NEXTAUTH_SECRET": true,
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": true,
    "STRIPE_SECRET_KEY": true,
    "RESEND_API_KEY": true,
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT": true,
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY": true,
    "IMAGEKIT_PRIVATE_KEY": true
  }
}
```

**Status Codes**:

- `200`: All systems healthy
- `503`: Degraded (some services unavailable)

---

## ✅ Integration Checklist

Before deploying to production, verify:

### ImageKit

- [ ] API keys added to environment variables
- [ ] `/api/imagekit-auth` returns valid auth params
- [ ] Test image upload from admin dashboard
- [ ] Images appear in ImageKit media library
- [ ] Images display on product pages with transformations

### Resend

- [ ] API key added to environment variables
- [ ] Domain verified (production only)
- [ ] Test email endpoint returns success
- [ ] Test email received in inbox
- [ ] All email templates exist and render correctly

### Stripe

- [ ] API keys added to environment variables (test mode)
- [ ] Test checkout flow completes successfully
- [ ] Payment appears in Stripe dashboard
- [ ] Order confirmation email sent
- [ ] For production: Switch to live keys

### Overall

- [ ] `/api/health` returns healthy status
- [ ] All environment variables set in Netlify
- [ ] Production domains/keys configured
- [ ] Test all features end-to-end

---

## 🚨 Troubleshooting

### ImageKit Issues

**Error**: "Failed to generate authentication parameters"

- Check `IMAGEKIT_PRIVATE_KEY` is set correctly
- Verify private key has no extra spaces/newlines

**Error**: Upload fails

- Check public key matches private key
- Verify URL endpoint is correct (must end with `/`)
- Check ImageKit dashboard for upload limits

### Resend Issues

**Error**: "Email test endpoint is not available in production"

- Test endpoint only works in development
- Set `NODE_ENV=development` for testing

**Error**: Email not received

- Check spam folder
- Verify `EMAIL_FROM` uses verified domain
- Check Resend dashboard for delivery status
- Verify `RESEND_API_KEY` is correct

**Error**: "Domain not verified"

- Add DNS records in your domain registrar
- Wait up to 48 hours for propagation
- Use `onboarding@resend.dev` for testing

### Stripe Issues

**Error**: "Missing STRIPE_SECRET_KEY"

- Verify key is set in `.env`
- Restart dev server after adding key
- Check key starts with `sk_test_` or `sk_live_`

**Error**: Payment fails

- Use Stripe test card numbers
- Check Stripe dashboard for declined reasons
- Verify webhook configuration (if using)

---

## 📚 Additional Resources

- [ImageKit Docs](https://docs.imagekit.io/)
- [Resend Docs](https://resend.com/docs)
- [Stripe Docs](https://stripe.com/docs)
- [Same Documentation](https://docs.same.new)

---

*For additional help, check the health endpoint or contact support.*

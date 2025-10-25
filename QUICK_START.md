# Quick Start Guide

Get your Kollect-It marketplace up and running in **15 minutes**.

---

## 📋 Prerequisites

- ✅ Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- ✅ Git installed
- ✅ PostgreSQL database (free from Supabase, Neon, or Vercel)
- ✅ GitHub account (for deployment)

---

## 🚀 Setup Steps

### Step 1: Clone Repository (1 min)

```bash
git clone https://github.com/jameshorton2486/kollect-it-marketplace.git
cd kollect-it-marketplace
```

### Step 2: Install Dependencies (1 min)

```bash
bun install
```

Expected output:
```
✔ Generated Prisma Client (v6.18.0)
Checked 640 packages
```

### Step 3: Set Up Environment Variables (3 min)

```bash
# Copy example file
cp .env.example .env

# Edit with your values
nano .env  # or code .env
```

**Required Variables** (see below for how to get them):

```bash
# Database (PostgreSQL) - CRITICAL
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# Authentication - CRITICAL
NEXTAUTH_SECRET=your-random-secret  # Generate: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Stripe (Payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
STRIPE_SECRET_KEY=sk_test_your_key

# Resend (Email)
RESEND_API_KEY=re_your_key
EMAIL_FROM=Kollect-It <noreply@yourdomain.com>
ADMIN_EMAIL=admin@yourdomain.com

# ImageKit (Images)
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/YOUR_ID/
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_your_key
IMAGEKIT_PRIVATE_KEY=private_your_key

# Environment
NODE_ENV=development
```

### Step 4: Get API Keys (5 min)

#### PostgreSQL Database:
1. Go to **https://supabase.com** (recommended) or https://neon.tech
2. Create new project
3. Go to **Settings** → **Database**
4. Copy **Connection Pooling** string (port 6543)
5. Paste as `DATABASE_URL`

#### Stripe (Payments):
1. Go to **https://dashboard.stripe.com/test/apikeys**
2. Copy **Publishable key** → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
3. Reveal and copy **Secret key** → `STRIPE_SECRET_KEY`

#### Resend (Email):
1. Go to **https://resend.com/api-keys**
2. Create API key
3. Copy to `RESEND_API_KEY`
4. For testing, use: `EMAIL_FROM=Kollect-It <onboarding@resend.dev>`

#### ImageKit (Images):
1. Go to **https://imagekit.io/dashboard**
2. Go to **Developer options**
3. Copy all three keys (URL endpoint, Public key, Private key)

### Step 5: Initialize Database (2 min)

```bash
# Generate Prisma Client
bun run db:generate

# Push schema to database
bun run db:push

# Seed with sample data
bun run db:seed
```

Expected output:
```
✔ Generated Prisma Client
Database schema in sync
🌱 Seeding database...
✅ Admin user created
✅ 4 categories created
✅ 6 products created
```

### Step 6: Start Development Server (1 min)

```bash
bun run dev
```

Expected output:
```
▲ Next.js 15.5.6 (Turbopack)
- Local:        http://localhost:3000
✓ Starting...
✓ Ready in 2.3s
```

### Step 7: Verify Setup (2 min)

#### Test Health Check:
```bash
curl http://localhost:3000/api/health | jq
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "environment": {
    "DATABASE_URL": true,
    "NEXTAUTH_SECRET": true,
    // ... all variables should be true
  }
}
```

#### Test Email (Optional):
```bash
curl http://localhost:3000/api/email/test
```

Check your `ADMIN_EMAIL` inbox for test email.

#### Test ImageKit Auth (Optional):
```bash
curl http://localhost:3000/api/imagekit-auth
```

Should return auth parameters.

---

## 🎯 Access the Application

### Customer Site:
**URL**: http://localhost:3000

Features:
- Browse products by category
- Add items to cart
- Checkout with Stripe
- Create account
- Order history

### Admin Dashboard:
**URL**: http://localhost:3000/admin/login

**Default Credentials**:
- Email: `admin@kollect-it.com`
- Password: `admin123`

⚠️ **CHANGE THESE IMMEDIATELY!**

Features:
- Manage products (add, edit, delete)
- Upload images (ImageKit multi-upload)
- **Process orders** (full order management system)
- **Update order status** (pending → processing → shipped → delivered)
- **Add tracking numbers** (USPS, UPS, FedEx, DHL)
- View analytics (revenue, orders, stats)
- Manage inventory

---

## 🧪 Test Checkout Flow

1. **Add Product to Cart**:
   - Browse to http://localhost:3000
   - Click "Add to Cart" on any product

2. **Proceed to Checkout**:
   - Click cart icon → "Checkout"
   - Fill shipping information
   - Click "Continue to Payment"

3. **Complete Payment** (Test Mode):
   - Card: `4242 4242 4242 4242`
   - Expiry: Any future date (e.g., `12/25`)
   - CVC: Any 3 digits (e.g., `123`)
   - ZIP: Any 5 digits (e.g., `12345`)
   - Click "Pay Now"

4. **Verify Order**:
   - Note your order number (e.g., `KI-1234567890-ABC123`)
   - Check email for order confirmation
   - Check Stripe Dashboard: https://dashboard.stripe.com/test/payments
   - Check Orders in Admin Dashboard: http://localhost:3000/admin/orders

5. **Test Order Management** (Admin):
   - Login to admin: http://localhost:3000/admin/login
   - Go to "Manage Orders"
   - Click "View Details" on your order
   - Click "Edit" in Status & Tracking
   - Update status to "Shipped"
   - Add tracking: `9400111899223344556677`
   - Select carrier: USPS
   - Save changes
   - Customer receives email notification!

---

## ✅ Verification Checklist

After setup, verify:

### Required for Basic Functionality:
- [ ] `bun run dev` starts without errors
- [ ] Homepage loads at http://localhost:3000
- [ ] Products display with images
- [ ] `/api/health` returns `"status": "healthy"`
- [ ] Database connection shows `"connected"`
- [ ] Admin login works with default credentials

### Required for Full Functionality:
- [ ] Test checkout completes successfully
- [ ] Payment appears in Stripe Dashboard
- [ ] Order appears in admin orders dashboard
- [ ] Order confirmation email received
- [ ] Test email sends (check inbox)
- [ ] Image upload works from admin dashboard
- [ ] Images appear in ImageKit media library
- [ ] Order status update sends email notification

---

## 📚 Documentation

### Core Guides:
- **[README.md](README.md)** - Project overview
- **[DEPLOYMENT_STATUS.md](DEPLOYMENT_STATUS.md)** - Production deployment
- **[PRODUCTION_HARDENING.md](PRODUCTION_HARDENING.md)** - Security improvements

### API Integration:
- **[docs/API_INTEGRATION_GUIDE.md](docs/API_INTEGRATION_GUIDE.md)** - Complete API setup
- **[docs/STRIPE_SETUP.md](docs/STRIPE_SETUP.md)** - Stripe configuration
- **[docs/DATABASE_SETUP.md](docs/DATABASE_SETUP.md)** - Database setup

### Features:
- **[docs/AUTH_GUIDE.md](docs/AUTH_GUIDE.md)** - Authentication system
- **[docs/EMAIL_SETUP.md](docs/EMAIL_SETUP.md)** - Email configuration
- **[docs/ADMINISTRATOR-GUIDE.md](docs/ADMINISTRATOR-GUIDE.md)** - Admin features

---

## 🐛 Troubleshooting

### "Prisma Client not generated"

```bash
bun run db:generate
```

### "Can't reach database server"

- Verify `DATABASE_URL` is correct
- Check database is running
- For Supabase, use connection pooling (port 6543)

### "Missing environment variable"

```bash
# Check which vars are missing
curl http://localhost:3000/api/health | jq '.environment'
```

Look for `false` values and add those to `.env`

### "Port 3000 already in use"

```bash
# Kill existing process
lsof -ti:3000 | xargs kill

# Or use different port
PORT=3001 bun run dev
```

### Build errors

```bash
# Reinstall dependencies
rm -rf node_modules
bun install

# Regenerate Prisma Client
bun run db:generate
```

---

## 🚀 Deploy to Production

Once everything works locally:

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial setup complete"
git push origin main
```

### 2. Deploy to Netlify

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Connect your GitHub repository
4. Configure environment variables (same as `.env` but update URLs)
5. Deploy!

See [DEPLOYMENT_STATUS.md](DEPLOYMENT_STATUS.md) for complete deployment guide.

---

## 🎉 Next Steps

Once setup is complete:

1. **Customize Design**
   - Edit colors in `src/app/kollect-it-styles.css`
   - Update logo and branding
   - Customize product categories

2. **Add Your Products**
   - Login to admin dashboard
   - Upload product images via ImageKit
   - Add product details
   - Set pricing

3. **Test Everything**
   - Complete a test purchase
   - Verify emails are sent
   - Check order in admin dashboard
   - Test on mobile devices

4. **Go Live**
   - Switch Stripe to live keys
   - Verify domain in Resend
   - Configure webhooks
   - Deploy to production

---

## 💡 Pro Tips

- **Use Prisma Studio** to view database: `bun run db:studio`
- **Monitor health endpoint** in production: `/api/health`
- **Check build locally** before deploying: `bun run build`
- **Test emails** thoroughly before going live
- **Use test mode** in Stripe until ready for real payments

---

## 📞 Support

- **Documentation**: See `/docs` folder
- **GitHub Issues**: https://github.com/jameshorton2486/kollect-it-marketplace/issues
- **Stripe Support**: https://support.stripe.com
- **Same.new**: https://same.new

---

**Estimated Setup Time**: 15 minutes
**Status**: ✅ **Production Ready**

Happy selling! 🎨📚⚔️

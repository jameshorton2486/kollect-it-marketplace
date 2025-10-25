# Environment Variables - Quick Reference

⚠️ **IMPORTANT:** All placeholder values MUST be replaced with real API keys before the app will work!

Copy this template to your `.env` file and replace with your actual values.

```bash
# Database (PostgreSQL) - ⚠️ MUST BE A REAL CONNECTION STRING
# Get free database: https://supabase.com or https://neon.tech
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require

# NextAuth.js (Authentication)
NEXTAUTH_SECRET=your-random-secret
NEXTAUTH_URL=https://kollect-it.netlify.app

# Stripe (Payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Resend (Email Notifications)
RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=Kollect-It <noreply@kollect-it.com>
ADMIN_EMAIL=admin@kollect-it.com

# ImageKit (Image Hosting)
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/YOUR_IMAGEKIT_ID/
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key

# Node Environment
NODE_ENV=production
```

## Where to Get API Keys

| Service | Dashboard URL | What to Get |
|---------|--------------|-------------|
| **PostgreSQL** | [Supabase](https://supabase.com) or [Neon](https://neon.tech) | Connection string |
| **NextAuth** | Generate locally | `openssl rand -base64 32` |
| **Stripe** | [dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys) | Publishable & Secret keys |
| **ImageKit** | [imagekit.io/dashboard](https://imagekit.io/dashboard) | URL Endpoint, Public & Private keys |
| **Resend** | [resend.com/api-keys](https://resend.com/api-keys) | API key |

## Setting Variables Locally

```bash
cp .env.example .env
# Edit .env and add your values
bun run dev
```

## Setting Variables on Netlify

### Option 1: Netlify Dashboard
1. Go to **Site settings** → **Environment variables**
2. Click **Add a variable** for each
3. Paste key and value
4. Click **Save**

### Option 2: Netlify CLI (Faster)

```bash
netlify login
netlify link

# Database
netlify env:set DATABASE_URL "postgresql://user:pass@host:5432/db?sslmode=require"

# Auth
netlify env:set NEXTAUTH_SECRET "$(openssl rand -base64 32)"
netlify env:set NEXTAUTH_URL "https://your-site.netlify.app"

# Stripe
netlify env:set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY "pk_test_..."
netlify env:set STRIPE_SECRET_KEY "sk_test_..."

# ImageKit
netlify env:set NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT "https://ik.imagekit.io/YOUR_ID/"
netlify env:set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY "public_..."
netlify env:set IMAGEKIT_PRIVATE_KEY "private_..."

# Resend
netlify env:set RESEND_API_KEY "re_..."
netlify env:set EMAIL_FROM "Kollect-It <noreply@kollect-it.com>"
netlify env:set ADMIN_EMAIL "admin@kollect-it.com"

# Node
netlify env:set NODE_ENV "production"
```

## Verify Setup

```bash
# Check local variables loaded
bun run dev

# Check Netlify deployment logs
netlify deploy --prod
```

---

**Need detailed setup instructions?** See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md)

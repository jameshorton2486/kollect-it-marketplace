# Environment Variables Reference

Complete guide to all environment variables required for the Kollect-It marketplace.

## 📋 Quick Checklist

- [ ] Database (PostgreSQL)
- [ ] NextAuth.js (Authentication)
- [ ] Stripe (Payments)
- [ ] ImageKit (Image Hosting)
- [ ] Resend (Email)
- [ ] Node Environment

## 🔑 Required Variables

### 1. Database (PostgreSQL)

**Variable:** `DATABASE_URL`

**Format:**
```
postgresql://user:password@host:5432/database?schema=public
```

**Where to get:**
- **Supabase** (Recommended): https://supabase.com
  1. Create new project
  2. Go to Settings → Database
  3. Copy "Connection Pooling" string (use port 6543)

- **Neon**: https://neon.tech
  1. Create new project
  2. Copy connection string from dashboard

- **Vercel Postgres**: https://vercel.com/storage/postgres
  1. Create database
  2. Copy `POSTGRES_PRISMA_URL`

**Example:**
```env
DATABASE_URL="postgresql://postgres.abc123:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres"
```

---

### 2. NextAuth.js (Authentication)

**Variables:**
- `NEXTAUTH_SECRET` - Secret key for encryption
- `NEXTAUTH_URL` - Your site URL

**How to generate secret:**
```bash
openssl rand -base64 32
```

**Example:**
```env
NEXTAUTH_SECRET="your-generated-secret-key-here"
NEXTAUTH_URL="https://your-site.netlify.app"
```

⚠️ **Important:** Never commit NEXTAUTH_SECRET to Git!

---

### 3. Stripe (Payments)

**Variables:**
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Public key (client-side)
- `STRIPE_SECRET_KEY` - Secret key (server-side)

**Where to get:** https://dashboard.stripe.com/test/apikeys

1. Sign up/login to Stripe
2. Go to Developers → API keys
3. Copy "Publishable key" (starts with `pk_test_`)
4. Copy "Secret key" (starts with `sk_test_`)

**Example:**
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_51AbC123..."
STRIPE_SECRET_KEY="sk_test_51AbC123..."
```

**For production:** Use live keys (starts with `pk_live_` and `sk_live_`)

---

### 4. ImageKit (Image Hosting & Optimization)

**Variables:**
- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` - Your ImageKit CDN URL
- `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` - Public key (client-side)
- `IMAGEKIT_PRIVATE_KEY` - Private key (server-side)

**Where to get:** https://imagekit.io/dashboard

1. Sign up for a free ImageKit account
2. Go to **Developer options** in the dashboard
3. Copy the following:
   - **URL Endpoint** (e.g., `https://ik.imagekit.io/your-id/`)
   - **Public Key** (starts with `public_`)
   - **Private Key** (starts with `private_`)

**Example:**
```env
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/YOUR_IMAGEKIT_ID/
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_abc123...
IMAGEKIT_PRIVATE_KEY=private_xyz789...
```

**Features:**
- Real-time image optimization
- Automatic format conversion (WebP, AVIF)
- Responsive images
- Fast global CDN
- Free tier includes 20GB bandwidth/month

---

### 5. Resend (Email Notifications)

**Variables:**
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `ADMIN_EMAIL`

**Where to get:** https://resend.com/api-keys

1. Sign up/login to Resend
2. Go to API Keys
3. Create new API key
4. Copy the key (starts with `re_`)

**Example:**
```env
RESEND_API_KEY="re_abc123xyz789..."
EMAIL_FROM="Kollect-It <noreply@your-domain.com>"
ADMIN_EMAIL="admin@your-domain.com"
```

**Note:** For production, verify your domain in Resend settings.

---

### 6. Node Environment

**Variable:** `NODE_ENV`

**Value:** `production` (for production) or `development` (for local)

**Example:**
```env
NODE_ENV="production"
```

---

## 🚀 Setting Variables Locally

1. Copy the example file:
```bash
cp .env.example .env
```

2. Edit `.env` and add your real values:
```bash
# Use your favorite editor
nano .env
# or
code .env
```

3. Restart your development server:
```bash
bun run dev
```

---

## ☁️ Setting Variables on Netlify

### Via Dashboard

1. Go to your Netlify site
2. Click **Site settings**
3. Go to **Environment variables** (left sidebar)
4. Click **Add a variable**
5. Enter key and value
6. Click **Save**
7. Repeat for all variables

### Via Netlify CLI (Faster)

Install Netlify CLI:
```bash
npm install -g netlify-cli
netlify login
```

Set variables:
```bash
# Database
netlify env:set DATABASE_URL "postgresql://user:pass@host:5432/db"

# Auth
netlify env:set NEXTAUTH_SECRET "$(openssl rand -base64 32)"
netlify env:set NEXTAUTH_URL "https://your-site.netlify.app"

# Stripe
netlify env:set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY "pk_test_..."
netlify env:set STRIPE_SECRET_KEY "sk_test_..."

# ImageKit
netlify env:set NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT "https://ik.imagekit.io/YOUR_IMAGEKIT_ID/"
netlify env:set NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY "public_..."
netlify env:set IMAGEKIT_PRIVATE_KEY "private_..."

# Resend
netlify env:set RESEND_API_KEY "re_..."
netlify env:set EMAIL_FROM "Kollect-It <noreply@your-domain.com>"
netlify env:set ADMIN_EMAIL "admin@your-domain.com"

# Node
netlify env:set NODE_ENV "production"
```

After setting variables, trigger a new deploy:
```bash
netlify deploy --prod
```

---

## 🔒 Security Best Practices

1. **Never commit `.env` to Git**
   - Already in `.gitignore`
   - Only commit `.env.example`

2. **Use different keys for development and production**
   - Test keys for local development
   - Live keys for production deployment

3. **Rotate secrets regularly**
   - Change NEXTAUTH_SECRET periodically
   - Regenerate API keys if compromised

4. **Restrict API key permissions**
   - Use test mode in Stripe during development
   - Limit Cloudinary/ImageKit upload permissions

5. **Use environment-specific values**
   - Different DATABASE_URL for dev/staging/prod
   - Different NEXTAUTH_URL for each environment

---

## 🧪 Testing Variables

After setting variables locally, test with:

```bash
# Check if variables are loaded
bun run dev

# Test database connection
bun run db:studio

# Test Stripe (try checkout)
# Test email (trigger a test email)
# Test image upload (add product in admin)
```

On Netlify, check the build logs for any missing variables.

---

## ❓ Troubleshooting

### "Environment variable not defined"
- Check spelling (case-sensitive)
- Restart dev server after changing `.env`
- Clear build cache on Netlify

### "Database connection failed"
- Verify DATABASE_URL format
- Check IP whitelist in database provider
- Ensure database is running

### "Stripe key invalid"
- Ensure using correct key (test vs live)
- Check for extra spaces in key
- Verify key is active in Stripe dashboard

### "Image upload failed"
- Verify Cloudinary/ImageKit credentials
- Check upload preset exists (Cloudinary)
- Ensure API keys have upload permissions

---

## 📚 Additional Resources

- [Prisma Environment Variables](https://www.prisma.io/docs/guides/development-environment/environment-variables)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Stripe API Keys](https://stripe.com/docs/keys)
- [Cloudinary Upload Presets](https://cloudinary.com/documentation/upload_presets)

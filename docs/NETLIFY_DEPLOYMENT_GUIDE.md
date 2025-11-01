# Netlify Deployment Guide

Complete guide for deploying the Kollect-It marketplace to Netlify.

---

## Prerequisites

- [x] GitHub repository with latest code pushed
- [x] PostgreSQL database provisioned (Supabase/Neon/Vercel)
- [x] Stripe account (test mode keys)
- [x] Resend account (email API keys)
- [x] ImageKit account (image hosting keys)
- [x] Netlify account (free tier works)

---

## Step 1: Connect Repository to Netlify

### Via Netlify UI (Recommended)

1. **Login to Netlify**
   - Go to: https://app.netlify.com
   - Sign in with GitHub (recommended) or email

2. **Import Project**
   - Click **"Add new site"** button
   - Select **"Import an existing project"**

3. **Connect Git Provider**
   - Click **"GitHub"**
   - Authorize Netlify if prompted
   - Search for: `kollect-it-marketplace`
   - Click on the repository

4. **Auto-Detected Settings**
   - Netlify will detect Next.js automatically
   - Build command: `bun install && bunx prisma generate && bun run build`
   - Publish directory: `.next`
   - Framework: Next.js

   **Note**: Build settings come from `netlify.toml` (already configured)

5. **DO NOT DEPLOY YET**
   - Click **"Show advanced"** to add environment variables first

---

## Step 2: Configure Environment Variables

### Required Variables (11 total)

Click **"New variable"** for each of these:

#### Database

```bash
Variable: DATABASE_URL
Value: postgresql://user:pass@host:6543/db?pgbouncer=true&connection_limit=1
```

**Important**: Use connection pooling (port 6543 for Supabase)

```bash
Variable: DIRECT_URL
Value: postgresql://user:pass@host:5432/db
```

**Important**: Direct connection (port 5432) - used for migrations only

#### Authentication

```bash
Variable: NEXTAUTH_SECRET
Value: [Generate with: openssl rand -base64 32]
```

Example: `wK9x5vN2mP8qR3tY6u7Z0A1b4C5d8E9f`

```bash
Variable: NEXTAUTH_URL
Value: https://your-site-name.netlify.app
```

**⚠️ CRITICAL**: You won't know this until after first deploy. Use placeholder for now, **MUST UPDATE AFTER DEPLOY**.

#### Stripe (Payments)

```bash
Variable: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: pk_test_...
```

Get from: https://dashboard.stripe.com/test/apikeys

```bash
Variable: STRIPE_SECRET_KEY
Value: sk_test_...
```

**⚠️ KEEP TEST MODE** until fully tested!

#### Resend (Email)

```bash
Variable: RESEND_API_KEY
Value: re_...
```

Get from: https://resend.com/api-keys

```bash
Variable: EMAIL_FROM
Value: Kollect-It <noreply@resend.dev>
```

**Note**: For testing, use `onboarding@resend.dev`. For production, verify your domain.

```bash
Variable: ADMIN_EMAIL
Value: your-email@example.com
```

**Note**: Where admin notifications will be sent

#### ImageKit (Image Hosting)

```bash
Variable: NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT
Value: https://ik.imagekit.io/YOUR_ID/
```

Get from: https://imagekit.io/dashboard

```bash
Variable: NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY
Value: public_...
```

```bash
Variable: IMAGEKIT_PRIVATE_KEY
Value: private_...
```

#### Environment (Optional but Recommended)

```bash
Variable: NODE_ENV
Value: production
```

```bash
Variable: CI
Value: true
```

**Note**: Enables strict TypeScript/ESLint checking

---

## Step 3: Deploy

1. **Click "Deploy site"**
   - Build will start automatically
   - Takes 2-4 minutes

2. **Monitor Build**
   - Click "Deploying" badge to see live logs
   - Wait for "Site is live" message

3. **Note Your URL**
   - Format: `https://[random-name].netlify.app`
   - Example: `https://kollect-it-abc123.netlify.app`

---

## Step 4: Update NEXTAUTH_URL (CRITICAL!)

**This is required or authentication won't work!**

1. **Go to Site Settings**
   - Click "Site settings" tab
   - Click "Environment variables" in left sidebar

2. **Update NEXTAUTH_URL**
   - Find `NEXTAUTH_URL` variable
   - Click "Options" → "Edit"
   - Update to your actual Netlify URL:

     ```
     https://your-actual-site-name.netlify.app
     ```

   - Click "Save"

3. **Trigger Redeploy**
   - Go to "Deploys" tab
   - Click "Trigger deploy" → "Deploy site"
   - Wait for new deploy to finish

---

## Step 5: Run Database Migrations

**Database migrations must run OUTSIDE Netlify build**

### From Local Machine

```bash
cd kollect-it-marketplace

# Set production database URL (use DIRECT_URL, not pooled)
export DATABASE_URL="postgresql://user:pass@host:5432/db"

# Run migrations
bunx prisma migrate deploy

# Optional: Seed with sample data (DEV ONLY - blocked in production)
bun run db:seed
```

### Expected Output

```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma

2 migrations found in prisma/migrations

Applying migration `20231001000000_initial_schema`
Applying migration `20231002000000_add_orders`

The following migration(s) have been applied:

migrations/
  └─ 20231001000000_initial_schema/
      └─ migration.sql
  └─ 20231002000000_add_orders/
      └─ migration.sql

All migrations have been successfully applied.
```

---

## Step 6: Verify Deployment

### Health Check

```bash
curl https://your-site.netlify.app/api/health | jq
```

**Expected Response** (healthy):

```json
{
  "status": "healthy",
  "timestamp": "2025-10-24T...",
  "database": "connected",
  "environment": {
    "DATABASE_URL": true,
    "NEXTAUTH_SECRET": true,
    "NEXTAUTH_URL": true,
    "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY": true,
    "STRIPE_SECRET_KEY": true,
    "RESEND_API_KEY": true,
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT": true,
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY": true,
    "IMAGEKIT_PRIVATE_KEY": true
  }
}
```

**If "status": "degraded"**:

- Check which environment variables are `false`
- Add missing variables in Netlify dashboard
- Redeploy

---

## Step 7: Test Features

### Test Admin Login

1. Navigate to: `https://your-site.netlify.app/admin/login`
2. Email: `admin@kollect-it.com`
3. Password: `admin123`
4. **⚠️ CHANGE THIS IMMEDIATELY!**

### Test Checkout

1. Add product to cart
2. Go to checkout
3. Fill shipping information
4. Use Stripe test card: `4242 4242 4242 4242`
5. Complete payment
6. Check order in admin dashboard
7. Verify email notifications

### Test Email

```bash
curl https://your-site.netlify.app/api/email/test
```

Check `ADMIN_EMAIL` inbox for test email.

---

## Troubleshooting

### Build Fails

#### Error: "Prisma Client not generated"

**Fix**: Already in build command, but verify:

```toml
[build]
  command = "bun install && bunx prisma generate && bun run build"
```

#### Error: "Can't reach database"

**This is normal** - static pages use fallback data during build.

Check these files have database fallbacks:

- `src/app/page.tsx`
- `src/app/about/page.tsx`

#### Error: "TypeScript errors"

**Fix**: Run locally with CI mode:

```bash
CI=true bun run build
```

Fix all TypeScript errors before pushing.

---

### Runtime Errors

#### "503 Service Unavailable" on /api/health

**Causes**:

1. Missing environment variables
2. Database not reachable
3. Wrong DATABASE_URL format

**Fix**:

```bash
# Check health endpoint response
curl https://your-site.netlify.app/api/health

# Look for environment: { ... } with false values
# Add missing variables in Netlify dashboard
```

#### "Unauthorized" on Admin Routes

**Causes**:

1. NEXTAUTH_SECRET not set
2. NEXTAUTH_URL incorrect
3. Cookies not working

**Fix**:

1. Verify NEXTAUTH_URL matches your Netlify URL exactly
2. Clear browser cookies
3. Check NEXTAUTH_SECRET is set
4. Try incognito mode

#### "Payment Intent Failed"

**Causes**:

1. Using wrong Stripe keys
2. Stripe API key invalid
3. Cart validation failed

**Fix**:

1. Check Stripe Dashboard: https://dashboard.stripe.com/test/payments
2. Verify STRIPE_SECRET_KEY starts with `sk_test_`
3. Check browser console for errors

#### "Email Not Sending"

**Causes**:

1. RESEND_API_KEY invalid
2. EMAIL_FROM domain not verified (production)
3. Resend service down

**Fix**:

```bash
# Test email endpoint
curl https://your-site.netlify.app/api/email/test

# Check Resend logs
# https://resend.com/emails
```

For production emails, verify domain:

1. Go to https://resend.com/domains
2. Add your domain
3. Add DNS records
4. Update EMAIL_FROM to use your domain

---

## Deployment Logs

### Viewing Logs

1. Go to Netlify Dashboard
2. Click on your site
3. Click "Deploys" tab
4. Click on specific deploy
5. Click "Deploy log" or "Function log"

### Build Logs

Shows:

- Dependency installation
- Prisma client generation
- Next.js build output
- Route generation (29 routes)
- Build success/failure

### Function Logs

Shows:

- API route calls
- Database queries
- Email sends
- Errors

**Access**: Deploys → [Specific Deploy] → Functions

---

## Redeployment

### Trigger Redeploy

**When to redeploy**:

- Environment variable changed
- New code pushed to GitHub
- Fix build error

**How**:

1. Go to "Deploys" tab
2. Click "Trigger deploy"
3. Select "Deploy site" or "Clear cache and deploy site"

### Auto-Deployment

**Netlify auto-deploys when**:

- New commit pushed to `main` branch
- Pull request merged

**Disable auto-deploy**:

1. Site settings → Build & deploy
2. Build settings → Stop builds

---

## Custom Domain (Optional)

### Add Custom Domain

1. Go to "Domain management"
2. Click "Add custom domain"
3. Enter your domain: `kollect-it.com`
4. Click "Verify"

### Update DNS

Add these records at your domain registrar:

**A Record**:

```
Type: A
Name: @
Value: 75.2.60.5
TTL: 3600
```

**CNAME Record** (for www):

```
Type: CNAME
Name: www
Value: [your-site].netlify.app
TTL: 3600
```

### Update Environment Variables

After domain is active:

1. Update `NEXTAUTH_URL` to: `https://yourdomain.com`
2. Redeploy site

### SSL Certificate

- Netlify auto-provisions Let's Encrypt SSL
- HTTPS enabled automatically
- Certificate auto-renews

---

## Production Checklist

Before going live:

- [ ] **Custom domain** configured (optional)
- [ ] **NEXTAUTH_URL** updated to final domain
- [ ] **Admin password** changed from default
- [ ] **Stripe live keys** added (when ready for real payments)
  - [ ] Switch from `pk_test_` to `pk_live_`
  - [ ] Switch from `sk_test_` to `sk_live_`
- [ ] **Resend domain** verified (for production emails)
  - [ ] Update `EMAIL_FROM` to verified domain
- [ ] **Database backups** enabled
- [ ] **Monitoring** set up (Uptime robot, Pingdom, etc.)
- [ ] **Stripe webhooks** configured
  - [ ] URL: `https://yourdomain.com/api/webhooks/stripe`
  - [ ] Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- [ ] **Error tracking** set up (Sentry, LogRocket, etc.)
- [ ] **Full checkout test** completed successfully
- [ ] **Email notifications** tested and working
- [ ] **Order management** tested by admin
- [ ] **Mobile testing** completed

---

## Environment Variable Reference

Quick reference for all required environment variables:

| Variable | Format | Where to Get | Required |
|----------|--------|--------------|----------|
| `DATABASE_URL` | `postgresql://user:pass@host:6543/db?pgbouncer=true` | Supabase/Neon | ✅ Yes |
| `DIRECT_URL` | `postgresql://user:pass@host:5432/db` | Supabase/Neon | ✅ Yes |
| `NEXTAUTH_SECRET` | Random 32-byte string | `openssl rand -base64 32` | ✅ Yes |
| `NEXTAUTH_URL` | `https://your-site.netlify.app` | Netlify deployment URL | ✅ Yes |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` | Stripe Dashboard | ✅ Yes |
| `STRIPE_SECRET_KEY` | `sk_test_...` | Stripe Dashboard | ✅ Yes |
| `RESEND_API_KEY` | `re_...` | Resend Dashboard | ✅ Yes |
| `EMAIL_FROM` | `Name <email@domain.com>` | Your choice | ✅ Yes |
| `ADMIN_EMAIL` | `admin@yourdomain.com` | Your email | ✅ Yes |
| `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` | `https://ik.imagekit.io/ID/` | ImageKit Dashboard | ✅ Yes |
| `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` | `public_...` | ImageKit Dashboard | ✅ Yes |
| `IMAGEKIT_PRIVATE_KEY` | `private_...` | ImageKit Dashboard | ✅ Yes |
| `NODE_ENV` | `production` | Set manually | ⚠️ Recommended |
| `CI` | `true` | Set manually | ⚠️ Recommended |

---

## Security Best Practices

### Environment Variables

- ✅ **Never commit** secrets to Git
- ✅ `.env` files are in `.gitignore`
- ✅ Use different keys for test vs production
- ✅ Rotate keys if exposed

### Admin Access

- ✅ Change default admin password immediately
- ✅ Use strong password (12+ characters, mixed case, numbers, symbols)
- ✅ Consider adding 2FA (future enhancement)

### Stripe Security

- ✅ Keep test mode until fully tested
- ✅ Test with all test card scenarios (success, decline, 3D Secure)
- ✅ Enable Stripe Radar (fraud detection) in production
- ✅ Configure webhook signing secret verification

---

## Performance Optimization

### Netlify Settings

**Build optimizations** (already configured):

- Bun for faster installs
- Image optimization via ImageKit CDN
- Static page pre-rendering

**Edge optimization**:

1. Go to Site settings → Build & deploy
2. Enable "Post processing"
   - Asset optimization
   - Bundle CSS
   - Minify JS

### Monitoring

Set up monitoring:

1. **Uptime**: https://uptimerobot.com
   - Monitor: `https://yoursite.netlify.app/api/health`
   - Frequency: Every 5 minutes
   - Alert if status != 200

2. **Analytics**: Netlify Analytics
   - Go to Analytics tab
   - Enable ($9/month but provides real user metrics)

---

## Support Resources

### Netlify

- Docs: https://docs.netlify.com
- Support: https://answers.netlify.com
- Status: https://www.netlifystatus.com

### Build Issues

- Check build logs in Netlify dashboard
- Test build locally: `CI=true bun run build`
- Check health endpoint: `/api/health`

### Runtime Issues

- Check Function logs in Netlify dashboard
- Test API endpoints with curl
- Check browser console for errors

---

**Status**: ✅ Ready for Production Deployment
**Last Updated**: October 24, 2025
**Next Step**: Push to GitHub and import to Netlify

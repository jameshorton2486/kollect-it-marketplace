# 🚀 Quick Deployment Guide - Kollect-It Marketplace

**Status**: ✅ **PRODUCTION READY**
**Latest Commit**: `7686a31 - Add GitHub push instructions with authentication guide`
**Build Status**: ✅ Passes CI=true (strict mode)
**Routes Generated**: 29
**Build Errors**: 0

---

## 📋 Pre-Deployment Summary

### ✅ Completed

- **Prisma Schema**: Fixed (single `directUrl`, no duplicates)
- **Static Fallback**: Homepage and About page work without database
- **Build Verification**: 29 routes generate successfully
- **TypeScript**: All strict mode errors fixed (0 errors)
- **Git Repository**: Configured for `https://github.com/jameshorton2486/kollect-it-marketplace.git`
- **Documentation**: Complete deployment guides created

### 🚨 Required Environment Variables (11 total)

You'll need values for these (get from your service dashboards):

- `DATABASE_URL` - Supabase/Neon pooled connection (port 6543, with `?pgbouncer=true`)
- `DIRECT_URL` - Supabase/Neon direct connection (port 5432, for migrations only)
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Will be your Netlify URL (set after first deploy)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - From Stripe Dashboard (test mode: `pk_test_...`)
- `STRIPE_SECRET_KEY` - From Stripe Dashboard (test mode: `sk_test_...`)
- `RESEND_API_KEY` - From Resend Dashboard (`re_...`)
- `EMAIL_FROM` - Format: `Kollect-It <noreply@your-domain.com>`
- `ADMIN_EMAIL` - Your email for admin notifications
- `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` - From ImageKit Dashboard
- `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` - From ImageKit Dashboard
- `IMAGEKIT_PRIVATE_KEY` - From ImageKit Dashboard

**⚠️ DO NOT include secret values in code or docs - only variable names**

---

## STEP 1: Push to GitHub

Choose **Option A** (recommended) or **Option B** below.

### Option A: Personal Access Token (Recommended)

#### 1.1 Generate Token

1. Open: **https://github.com/settings/tokens/new**
2. Fill out:
   - **Note**: `Kollect-It Marketplace Deployment`
   - **Expiration**: `90 days` (or your preference)
   - **Scopes**: Check `repo` (full control of private repositories)
3. Click **"Generate token"**
4. **Copy the token immediately** - format: `ghp_xxxxxxxxxxxx...`

#### 1.2 Push via CLI

```bash
cd kollect-it-marketplace

# Ensure remote is HTTPS
git remote set-url origin https://github.com/jameshorton2486/kollect-it-marketplace.git

# Check for any uncommitted changes
git status

# If changes exist, commit them
git add -A
git commit -m "chore: final deployment preparation"

# Push to GitHub
git push origin main
```

#### 1.3 Authenticate

When prompted:
- **Username**: `jameshorton2486`
- **Password**: **Paste your Personal Access Token** (the `ghp_xxx...` value, NOT your GitHub password)

#### 1.4 Verify Success

Expected output:
```
Enumerating objects: 342, done.
Counting objects: 100% (342/342), done.
...
To https://github.com/jameshorton2486/kollect-it-marketplace.git
   main -> main
```

✅ **Success!** Visit https://github.com/jameshorton2486/kollect-it-marketplace to confirm files uploaded.

---

### Option B: SSH Key (Alternative)

#### 1.1 Generate SSH Key

```bash
# Generate new key (skip if you already have one)
ssh-keygen -t ed25519 -C "your-email@example.com"

# Press Enter to accept default location (~/.ssh/id_ed25519)
# Press Enter twice to skip passphrase (or set one)
```

#### 1.2 Add Key to GitHub

```bash
# Copy public key to clipboard
cat ~/.ssh/id_ed25519.pub
# Output will be: ssh-ed25519 AAAA... your-email@example.com
```

1. Go to: **https://github.com/settings/keys**
2. Click **"New SSH key"**
3. **Title**: `Same.new Deployment`
4. **Key**: Paste the output from above
5. Click **"Add SSH key"**

#### 1.3 Update Remote and Push

```bash
cd kollect-it-marketplace

# Change remote to SSH
git remote set-url origin git@github.com:jameshorton2486/kollect-it-marketplace.git

# Check status
git status

# Push
git push origin main
```

✅ **Success!** Visit https://github.com/jameshorton2486/kollect-it-marketplace to confirm.

---

## STEP 2: Deploy to Netlify (UI Method)

### 2.1 Create Site from GitHub

1. **Login**: Go to https://app.netlify.com
2. **New Site**: Click **"Add new site"** → **"Import an existing project"**
3. **Connect GitHub**:
   - Click **"GitHub"**
   - Authorize Netlify if prompted
   - Search for: `kollect-it-marketplace`
   - Click on the repository

### 2.2 Configure Build Settings

Netlify will auto-detect Next.js. Verify:

- **Build command**: `bun install && bunx prisma generate && bun run build`
  *(Already set in `netlify.toml` - no need to change)*
- **Publish directory**: `.next`
  *(Already set in `netlify.toml` - no need to change)*
- **Framework**: Next.js

**⚠️ DO NOT DEPLOY YET** - Click **"Show advanced"** to add environment variables first.

### 2.3 Add Environment Variables

Click **"New variable"** for each variable below. Get values from your service dashboards.

#### Database (Supabase/Neon)

**Variable**: `DATABASE_URL`
**Value**: `postgresql://user:password@host:6543/database?pgbouncer=true`
**Notes**:
- Use **pooled** connection (port `6543`)
- Include `?pgbouncer=true` for connection pooling
- Get from Supabase: Settings → Database → Connection string (Pooler)

**Variable**: `DIRECT_URL`
**Value**: `postgresql://user:password@host:5432/database`
**Notes**:
- Use **direct** connection (port `5432`)
- For local migrations ONLY (not used in Netlify build)
- Get from Supabase: Settings → Database → Connection string (Direct)

#### Authentication (NextAuth.js)

**Variable**: `NEXTAUTH_SECRET`
**Value**: Generate a random 32-byte string
**How to generate**:
```bash
openssl rand -base64 32
```
Example output: `wK9x5vN2mP8qR3tY6u7Z0A1b4C5d8E9f`

**Variable**: `NEXTAUTH_URL`
**Value**: `https://placeholder.netlify.app`
**⚠️ CRITICAL**:
- Leave as placeholder for now
- **MUST UPDATE** after first deploy with actual Netlify URL
- Example final value: `https://kollect-it-abc123.netlify.app`

#### Stripe (Payments)

**Variable**: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
**Value**: `pk_test_...`
**Get from**: https://dashboard.stripe.com/test/apikeys

**Variable**: `STRIPE_SECRET_KEY`
**Value**: `sk_test_...`
**Get from**: https://dashboard.stripe.com/test/apikeys
**⚠️ Keep TEST mode** until fully tested in production

#### Resend (Email)

**Variable**: `RESEND_API_KEY`
**Value**: `re_...`
**Get from**: https://resend.com/api-keys

**Variable**: `EMAIL_FROM`
**Value**: `Kollect-It <noreply@your-verified-domain.com>`
**Notes**:
- For testing: Use `Kollect-It <onboarding@resend.dev>`
- For production: Verify your domain in Resend first

**Variable**: `ADMIN_EMAIL`
**Value**: `your-email@example.com`
**Notes**: Where admin order notifications will be sent

#### ImageKit (Image Hosting)

**Variable**: `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
**Value**: `https://ik.imagekit.io/YOUR_ID/`
**Get from**: https://imagekit.io/dashboard → URL-endpoint

**Variable**: `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`
**Value**: `public_...`
**Get from**: https://imagekit.io/dashboard → Developer options

**Variable**: `IMAGEKIT_PRIVATE_KEY`
**Value**: `private_...`
**Get from**: https://imagekit.io/dashboard → Developer options

#### Optional (Recommended)

**Variable**: `NODE_ENV`
**Value**: `production`

**Variable**: `CI`
**Value**: `true`
**Notes**: Enables strict TypeScript/ESLint checking during build

### 2.4 First Deploy

1. Click **"Deploy site"** button
2. **Monitor build**: Click "Deploying..." badge to watch live logs
3. **Wait for completion**: Build takes 2-4 minutes
4. **Note your URL**: Format `https://[random-name].netlify.app`

Example: `https://kollect-it-abc123.netlify.app`

---

## STEP 3: Health Check

### 3.1 Test Health Endpoint

Open in browser or use curl:

```bash
curl https://YOUR-SITE.netlify.app/api/health
```

### 3.2 Expected Response (Healthy)

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
    "EMAIL_FROM": true,
    "ADMIN_EMAIL": true,
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT": true,
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY": true,
    "IMAGEKIT_PRIVATE_KEY": true
  }
}
```

**Status Code**: `200 OK`

### 3.3 If Status is "degraded" or "unhealthy"

**Check**:
1. Which environment variables show `false`?
2. Is Supabase project active (not paused)?
3. Is `DATABASE_URL` format correct?
   - Must use port `6543` (pooled)
   - Must include `?pgbouncer=true`
4. Are all 11+ variables set in Netlify?

**Fix**:
1. Go to Netlify: **Site settings → Environment variables**
2. Add or correct missing variables
3. Go to **Deploys → Trigger deploy → Deploy site**
4. Re-test health endpoint

---

## STEP 4: Run Production Migrations (One-Time, Local)

**⚠️ Run from your LOCAL machine, NOT in Netlify**

### 4.1 Add DIRECT_URL to Local .env

Edit `kollect-it-marketplace/.env`:

```bash
# Use DIRECT connection (port 5432) for migrations
DATABASE_URL="postgresql://user:password@host:5432/database"
```

### 4.2 Run Migrations

```bash
cd kollect-it-marketplace

# Apply all migrations to production database
bunx prisma migrate deploy
```

### 4.3 Expected Output

```
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma

2 migrations found in prisma/migrations

Applying migration `20231001000000_initial_schema`
Applying migration `20231002000000_add_orders`

All migrations have been successfully applied.
```

### 4.4 Verify Database

Re-check health endpoint:

```bash
curl https://YOUR-SITE.netlify.app/api/health
```

Should now show `"database": "connected"`

---

## STEP 5: Set Final NEXTAUTH_URL

### 5.1 Update Environment Variable

1. Go to Netlify: **Site settings → Environment variables**
2. Find `NEXTAUTH_URL`
3. Click **"Options" → "Edit"**
4. Update value to your **exact Netlify URL**:
   - For preview: `https://kollect-it-abc123.netlify.app`
   - For custom domain (later): `https://shop.kollect-it.com`
5. Click **"Save"**

### 5.2 Redeploy

1. Go to **Deploys** tab
2. Click **"Trigger deploy" → "Deploy site"**
3. Wait for build to complete

**⚠️ CRITICAL**: Authentication will NOT work until this is set correctly!

---

## STEP 6: Quick Smoke Test (Production Preview)

### 6.1 Admin Login

1. Navigate to: `https://YOUR-SITE.netlify.app/admin/login`
2. **Email**: `admin@kollect-it.com`
3. **Password**: `admin123`
4. **⚠️ CHANGE THIS IMMEDIATELY!**

**If login fails**:
- Check `NEXTAUTH_URL` matches your Netlify URL exactly
- Check `NEXTAUTH_SECRET` is set
- Clear browser cookies and try again

### 6.2 Add a Product

1. Go to: `/admin/products`
2. Click **"Add Product"**
3. Fill in:
   - **Title**: "Test Collectible"
   - **Price**: 100
   - **Description**: "Test item"
   - **Category**: Select any
   - **Images**: Upload via ImageKit
4. Click **"Create Product"**

**If image upload fails**:
- Check ImageKit variables are set
- Check ImageKit dashboard for API errors

### 6.3 Test Checkout

1. Browse to homepage: `https://YOUR-SITE.netlify.app`
2. Add product to cart
3. Click cart icon → **"Checkout"**
4. Fill shipping information
5. Use Stripe **test card**:
   - **Card number**: `4242 4242 4242 4242`
   - **Expiry**: Any future date (e.g., `12/25`)
   - **CVC**: Any 3 digits (e.g., `123`)
   - **ZIP**: Any 5 digits (e.g., `10001`)
6. Complete payment
7. Verify redirect to success page

**If payment fails**:
- Check Stripe keys are set (test mode)
- Check browser console for errors
- Check Stripe Dashboard: https://dashboard.stripe.com/test/payments

### 6.4 Verify Order in Admin

1. Go to: `/admin/orders`
2. Confirm order appears in list
3. Click order to view details
4. Update status to "Shipped"
5. Verify status update email sent

### 6.5 Verify Emails

Check your `ADMIN_EMAIL` inbox for:
- **Order confirmation** (customer copy)
- **New order notification** (admin alert)
- **Order status update** (when you changed to "Shipped")

**If emails not received**:
- Test email endpoint: `https://YOUR-SITE.netlify.app/api/email/test`
- Check Resend logs: https://resend.com/emails
- Verify `RESEND_API_KEY` is set
- For production: Verify domain in Resend

### 6.6 Re-check Health

Final verification:

```bash
curl https://YOUR-SITE.netlify.app/api/health
```

Should return:
- `"status": "healthy"`
- `"database": "connected"`
- All environment variables: `true`

---

## ✅ Deployment Preparation Complete!

### Summary of Actions

✅ **Prisma**: Fixed (single `directUrl`)
✅ **Static Fallback**: Pages work without database
✅ **Build Success**: 29 routes generated, 0 errors
✅ **Git Remote**: Configured for GitHub
✅ **Documentation**: Complete deployment guides created

### 🚨 Actions Required

1. **Push to GitHub** (Option A or B above)
2. **Deploy to Netlify** (Step 2)
3. **Set Environment Variables** (11 required in Step 2.3)
4. **Health Check** (Step 3)
5. **Run Migrations** (Step 4, from local machine)
6. **Set NEXTAUTH_URL** (Step 5, after first deploy)
7. **Change Admin Password** (Step 6.1)
8. **Smoke Test** (Step 6)

### Estimated Timeline

- Push to GitHub: **2 minutes**
- Deploy to Netlify: **5 minutes**
- Set environment variables: **10 minutes**
- Health check: **2 minutes**
- Run migrations: **1 minute**
- Update NEXTAUTH_URL & redeploy: **3 minutes**
- Smoke testing: **10 minutes**

**Total**: ~30 minutes to production deployment ✅

---

## 🆘 Troubleshooting

### Push Fails: "Permission denied"

**Fix**: Use Option A (Personal Access Token) instead of SSH

### Push Fails: "Invalid credentials"

**Fix**: Make sure you're using the **token** as password, NOT your GitHub password

### Build Fails: "Prisma Client not generated"

**Fix**: Already in build command (`bunx prisma generate`) - check Netlify build logs

### Build Fails: "Can't reach database"

**Fix**: This is **normal** during build - static pages use fallback data

### Health Returns 503: "degraded"

**Fix**:
1. Check which env vars show `false` in response
2. Add missing variables in Netlify
3. Redeploy

### Admin Login Fails: "Unauthorized"

**Fix**:
1. Verify `NEXTAUTH_URL` matches your Netlify URL **exactly**
2. Verify `NEXTAUTH_SECRET` is set
3. Clear browser cookies
4. Try incognito mode

### Payments Fail

**Fix**:
1. Use test card: `4242 4242 4242 4242`
2. Check Stripe Dashboard for errors
3. Verify Stripe keys are **test mode** (`pk_test_`, `sk_test_`)
4. Check browser console

### Emails Don't Send

**Fix**:
1. Test endpoint: `/api/email/test`
2. Check Resend logs: https://resend.com/emails
3. For production: Verify domain in Resend
4. Use `onboarding@resend.dev` for testing

---

## 📚 Additional Documentation

- **DEPLOYMENT_READY.md** - Comprehensive deployment overview
- **docs/NETLIFY_DEPLOYMENT_GUIDE.md** - Detailed Netlify guide (600+ lines)
- **QUICK_START.md** - Local development setup
- **docs/ORDER_MANAGEMENT_GUIDE.md** - Order system guide
- **docs/STRIPE_SETUP.md** - Payment configuration
- **docs/EMAIL_SETUP.md** - Email notifications
- **docs/SECURITY.md** - Security best practices

---

**🎉 Ready to Deploy!**

Follow Steps 1-6 above in order. Once complete, your Kollect-It marketplace will be live!

---

*Last Updated: October 24, 2025*
*Commit: 7686a31*
*Generated with [Same](https://same.new)*

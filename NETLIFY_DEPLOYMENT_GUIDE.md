# 🚀 Netlify Deployment Guide for Kollect-It Marketplace

This guide will help you deploy the Kollect-It marketplace to Netlify.

## ⚠️ Current Issue

Your Netlify site (https://same-a42equ68lfz-latest.netlify.app/) is **NOT** deploying from your GitHub repository. It's showing a completely different static Shopify site instead of your Next.js marketplace.

## 🔧 Step-by-Step Fix

### 1. Connect to Your GitHub Repository

1. Log into [Netlify](https://app.netlify.com)
2. Go to your site settings
3. Navigate to "Build & deploy" → "Continuous deployment"
4. Click "Link repository"
5. Select **GitHub** as your provider
6. Choose the repository: `jameshorton2486/kollect-it-marketplace`
7. Select the `main` branch (or whatever your primary branch is)

### 2. Configure Build Settings

In your Netlify site settings, set:

- **Base directory:** (leave empty)
- **Build command:** `npm install && npx prisma generate && npm run build`
- **Publish directory:** (leave empty - the Next.js plugin handles this automatically)
- **Node version:** `20`

### 3. Set Environment Variables

Go to **Site settings** → **Environment variables** and add ALL of these:

#### Required Variables:

```bash
# Database (use an in-memory DB or proper PostgreSQL for production)
DATABASE_URL=file:./dev.db

# NextAuth.js - CRITICAL!
NEXTAUTH_SECRET=your-very-secret-random-string-at-least-32-characters-long
NEXTAUTH_URL=https://same-a42equ68lfz-latest.netlify.app

# Stripe (use test keys for now, get from https://dashboard.stripe.com/test/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here

# Cloudinary (get from https://cloudinary.com/console)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=kollect-it-uploads
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (get from https://resend.com/api-keys)
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=Kollect-It <noreply@kollect-it.com>
ADMIN_EMAIL=admin@kollect-it.com

# Node Environment
NODE_ENV=production
```

#### How to Generate NEXTAUTH_SECRET:

Run this command in your terminal:

```bash
openssl rand -base64 32
```

Or use this online tool: https://generate-secret.vercel.app/32

### 4. Database Considerations

**⚠️ IMPORTANT:** SQLite (`file:./dev.db`) **will NOT work** on Netlify because the file system is read-only.

You have two options:

#### Option A: Use PostgreSQL (Recommended for Production)

1. Get a free PostgreSQL database from:
   - [Supabase](https://supabase.com) (recommended, free tier)
   - [Neon](https://neon.tech) (serverless PostgreSQL)
   - [Railway](https://railway.app)

2. Update your `DATABASE_URL` environment variable to the PostgreSQL connection string:
   ```
   DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
   ```

3. Run migrations:
   ```bash
   npx prisma migrate deploy
   ```

#### Option B: Use Netlify Blob Store (Simple, but limited)

For testing only, you could use Netlify's blob storage, but this requires code changes.

### 5. Install Required Netlify Plugin

The `netlify.toml` file already includes the Next.js plugin. Make sure it's installed:

1. In your Netlify site dashboard
2. Go to **Plugins**
3. Search for "@netlify/plugin-nextjs"
4. Click **Install** if not already installed

### 6. Trigger a New Deploy

After configuring everything:

1. Go to **Deploys** tab
2. Click **Trigger deploy** → **Clear cache and deploy site**
3. Watch the build logs for any errors

## 🐛 Common Issues & Solutions

### Issue: Build fails with "Module not found"

**Solution:** Make sure all dependencies are in `package.json`, not just `devDependencies`.

### Issue: Database connection error

**Solution:** You MUST use PostgreSQL, not SQLite. See "Database Considerations" above.

### Issue: NextAuth errors

**Solution:**
1. Ensure `NEXTAUTH_SECRET` is set (32+ character random string)
2. Ensure `NEXTAUTH_URL` matches your Netlify domain exactly (including https://)

### Issue: Stripe not working

**Solution:**
1. Get your keys from https://dashboard.stripe.com/test/apikeys
2. Use `pk_test_...` and `sk_test_...` keys for testing
3. Make sure `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` starts with `NEXT_PUBLIC_`

### Issue: Images not uploading

**Solution:**
1. Create a Cloudinary account at https://cloudinary.com
2. Get your credentials from the dashboard
3. Create an unsigned upload preset named "kollect-it-uploads"
4. Set all 4 Cloudinary environment variables

### Issue: Site shows 404 or wrong content

**Solution:**
1. Verify the GitHub repository is correctly connected
2. Check that you're deploying from the correct branch
3. Clear cache and redeploy

## 📝 Pre-Deployment Checklist

- [ ] GitHub repository connected
- [ ] All 13 environment variables set
- [ ] PostgreSQL database setup (NOT SQLite)
- [ ] `NEXTAUTH_SECRET` generated and set
- [ ] `NEXTAUTH_URL` points to your Netlify domain
- [ ] Stripe test keys obtained and set
- [ ] Cloudinary account created and configured
- [ ] Resend email API key obtained
- [ ] Build command includes `npx prisma generate`
- [ ] @netlify/plugin-nextjs plugin installed

## ✅ Verification Steps

After deployment:

1. **Homepage loads:** Visit `https://your-site.netlify.app/`
2. **Products show:** Should see dynamic products from database
3. **Admin works:** Visit `/admin/login`
4. **Auth works:** Try logging in
5. **Cart works:** Add items to cart
6. **No console errors:** Check browser developer console

## 🆘 Still Having Issues?

1. Check the **Deploy logs** in Netlify for specific error messages
2. Look at **Function logs** for runtime errors
3. Verify all environment variables are set correctly
4. Make sure you're using PostgreSQL, NOT SQLite

## 📚 Additional Resources

- [Netlify Next.js Documentation](https://docs.netlify.com/frameworks/next-js/overview/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with PostgreSQL](https://www.prisma.io/docs/getting-started/setup-prisma/start-from-scratch/relational-databases-typescript-postgresql)
- [NextAuth.js Deployment](https://next-auth.js.org/deployment)

---

**Need help?** Check the build logs in Netlify for specific error messages.

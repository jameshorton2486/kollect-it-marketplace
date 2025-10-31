# 🚀 How to Trigger Deployment in Netlify

## Quick Steps (5 minutes)

### 1. Log into Netlify

Go to: https://app.netlify.com

### 2. Find Your Site

- Look for: `same-a42equ68lfz-latest`
- Or go directly to: https://app.netlify.com/sites/same-a42equ68lfz-latest

### 3. Connect GitHub Repository (IF NOT ALREADY CONNECTED)

**Check if connected:**

- Go to **Site Settings** → **Build & deploy**
- Look for "Repository" section
- Should show: `jameshorton2486/kollect-it-marketplace`

**If NOT connected:**

1. Click **"Link site to Git repository"**
2. Choose **GitHub**
3. Select repository: `jameshorton2486/kollect-it-marketplace`
4. Branch: `master`
5. Build settings: (auto-detected from netlify.toml)

### 4. Set Environment Variables (CRITICAL!)

**Go to:** Site Settings → Environment Variables

**Add these 13 variables:**

```bash
# Database (MUST be PostgreSQL for Netlify!)
DATABASE_URL=postgresql://user:pass@host:5432/db

# Auth (REQUIRED)
NEXTAUTH_SECRET=your-32-char-secret-here
NEXTAUTH_URL=https://same-a42equ68lfz-latest.netlify.app

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=kollect-it-uploads
CLOUDINARY_API_KEY=123456789
CLOUDINARY_API_SECRET=abc...xyz

# Email
RESEND_API_KEY=re_...
EMAIL_FROM=Kollect-It <noreply@kollect-it.com>
ADMIN_EMAIL=admin@kollect-it.com

# Environment
NODE_ENV=production
```

### 5. Clear Cache & Deploy

1. Go to **Deploys** tab
2. Click **"Trigger deploy"** dropdown
3. Select **"Clear cache and deploy site"**
4. Wait for build to complete (~3-5 minutes)

### 6. Watch Build Logs

The build should show:

```
✓ Detected Bun (via bun.lockb)
✓ Installing dependencies...
✓ Running: bun install
✓ Running: bunx prisma generate
✓ Building Next.js...
✓ @netlify/plugin-nextjs processing...
✓ Site is live!
```

### 7. Verify Deployment

Visit: https://same-a42equ68lfz-latest.netlify.app/

**Should see:**

- Kollect-It marketplace homepage
- Product grid
- Header with cart icon
- NO "Powered by Shopify"
- NO Lone Fox content

**Should NOT see:**

- Shopify furniture store
- "Drew's Projects"
- Newsletter popup

---

## 🐛 If Build Fails

### Error: "Module not found"

- Missing environment variable
- Check all 13 variables are set

### Error: "Database connection failed"

- Using SQLite (won't work on Netlify)
- Must use PostgreSQL (Supabase/Neon)

### Error: "Prisma client not generated"

- Should be fixed in latest netlify.toml
- Check build command includes: `bunx prisma generate`

### Still Shows Shopify Content

- Repository not connected
- Clear cache again
- Verify deploying from `master` branch

---

## ⚡ Expected Build Time

- First build: ~3-5 minutes
- Subsequent builds: ~2-3 minutes

---

## ✅ Success Checklist

- [ ] Repository connected to GitHub
- [ ] All 13 environment variables set
- [ ] PostgreSQL database set up
- [ ] Build completed successfully
- [ ] Site shows Kollect-It marketplace (not Shopify)
- [ ] Can navigate to /admin/login
- [ ] Products display correctly
- [ ] No console errors

---

**Need the full guide?** See `DEPLOYMENT_STATUS.md` in the repository.

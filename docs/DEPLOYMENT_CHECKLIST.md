# Final Deployment Checklist

Complete this checklist before deploying to Netlify.

## ✅ Netlify Configuration Verified

- [x] **Build Command**: `bun install && bunx prisma generate && bunx prisma migrate deploy && bun run build`
- [x] **Publish Directory**: `.next`
- [x] **Node Version**: 20
- [x] **Plugin**: `@netlify/plugin-nextjs` enabled
- [x] **Runtime**: Bun (faster than npm)

## 🔑 Environment Variables (Required)

Set these in Netlify dashboard before deploying:

### Critical (App won't work without these):
- [ ] `DATABASE_URL` - PostgreSQL connection string
- [ ] `NEXTAUTH_SECRET` - Random secret (generate with: `openssl rand -base64 32`)
- [ ] `NEXTAUTH_URL` - Your Netlify URL (e.g., `https://your-site.netlify.app`)
- [ ] `NODE_ENV` - Set to `production`

### Payment Processing:
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- [ ] `STRIPE_SECRET_KEY`

### Image Hosting:
- [ ] `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT`
- [ ] `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`
- [ ] `IMAGEKIT_PRIVATE_KEY`

### Email Notifications:
- [ ] `RESEND_API_KEY`
- [ ] `EMAIL_FROM`
- [ ] `ADMIN_EMAIL`

## 🗄️ Database Setup

- [ ] PostgreSQL database created (Supabase/Neon/Vercel)
- [ ] Database migrations ready in `prisma/migrations/`
- [ ] Seed data script tested locally
- [ ] Database connection string added to Netlify env vars

## 🧪 Local Testing

- [ ] Production build tested locally: `bun run build`
- [ ] No build errors
- [ ] No TypeScript errors (ESLint disabled in build)
- [ ] All pages load correctly
- [ ] Database queries work
- [ ] Images load properly

## 📦 Code Quality

- [ ] Latest code pushed to GitHub
- [ ] All required files committed:
  - `netlify.toml`
  - `next.config.js`
  - `package.json`
  - `prisma/schema.prisma`
  - `prisma/migrations/`
- [ ] `.env` NOT committed (in `.gitignore`)
- [ ] No sensitive data in code

## 🚀 Netlify Setup

- [ ] Netlify account created
- [ ] Repository connected to Netlify
- [ ] Build settings configured:
  - Build command: (auto-detected from `netlify.toml`)
  - Publish directory: `.next`
  - Node version: 20
- [ ] All environment variables set in Netlify dashboard
- [ ] Domain name configured (optional)

## ⚡ Pre-Deploy Final Checks

- [ ] Review deployment settings in Netlify
- [ ] Verify all env vars are set (check for typos!)
- [ ] Database is accessible from internet
- [ ] Test API keys are valid
- [ ] Ready to deploy! 🎉

## 🔄 After Deployment

- [ ] Check build logs for errors
- [ ] Verify site loads: `https://your-site.netlify.app`
- [ ] Test homepage
- [ ] Test category pages
- [ ] Test product detail pages
- [ ] Test admin login
- [ ] Test image uploads
- [ ] Test checkout flow
- [ ] Check email notifications
- [ ] Monitor for runtime errors

## 🆘 If Deployment Fails

1. **Check build logs** in Netlify dashboard
2. **Common issues**:
   - Missing environment variables
   - Database connection failed
   - Prisma migration errors
   - Module not found errors
3. **Fixes**:
   - Verify all env vars are set
   - Check DATABASE_URL format
   - Ensure migrations are committed
   - Clear build cache and redeploy

## 📚 Quick Reference

**Netlify CLI Deploy:**
```bash
netlify deploy --prod
```

**Set Environment Variables:**
```bash
netlify env:set VARIABLE_NAME "value"
```

**View Deployment:**
```bash
netlify open
```

**View Build Logs:**
```bash
netlify deploy:list
```

---

**Ready to deploy?** Push to GitHub or run `netlify deploy --prod`!

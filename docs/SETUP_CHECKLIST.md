# Setup Checklist - Get Started in 10 Minutes

Follow these steps to get your Kollect-It marketplace up and running.

## ✅ Prerequisites

- [ ] Bun installed (`curl -fsSL https://bun.sh/install | bash`)
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## 🚀 Quick Start

### Step 1: Clone & Install (2 min)

```bash
cd kollect-it-marketplace
bun install
```

### Step 2: Set Up PostgreSQL Database (3 min)

**Choose ONE option:**

#### Option A: Supabase (Recommended)
1. Go to https://supabase.com
2. Click "Start your project"
3. Create a new project (wait 2-3 minutes for setup)
4. Go to **Settings** → **Database**
5. Copy the "Connection Pooling" string (use port 6543, not 5432)
6. Paste it as your `DATABASE_URL` in `.env`

#### Option B: Neon
1. Go to https://neon.tech
2. Sign up and create a new project
3. Copy the connection string from the dashboard
4. Paste it as your `DATABASE_URL` in `.env`

### Step 3: Configure Environment Variables (2 min)

```bash
cp .env.example .env
```

Edit `.env` and add your DATABASE_URL:
```bash
DATABASE_URL=postgresql://postgres.xxx:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

Generate a random secret:
```bash
openssl rand -base64 32
```

Add it to `.env`:
```bash
NEXTAUTH_SECRET=<paste-your-generated-secret>
```

### Step 4: Initialize Database (1 min)

```bash
bun run db:setup
```

This will:
- ✅ Generate Prisma Client
- ✅ Create database tables
- ✅ Seed with sample data (admin user + products)

### Step 5: Start Development Server (30 sec)

```bash
bun run dev
```

Visit http://localhost:3000 🎉

## 🔑 Default Credentials

**Admin Login:**
- URL: http://localhost:3000/admin/login
- Email: `admin@kollect-it.com`
- Password: `admin123`

⚠️ Change these in production!

## 📋 Next Steps (Optional - Required for Full Features)

These can be set up later but are needed for full functionality:

### For Payments (Stripe)
- [ ] Sign up at https://dashboard.stripe.com
- [ ] Get test API keys
- [ ] Add to `.env`:
  ```bash
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
  STRIPE_SECRET_KEY=sk_test_...
  ```

### For Image Uploads (ImageKit)
- [ ] Sign up at https://imagekit.io
- [ ] Get your keys from Developer options
- [ ] Add to `.env`:
  ```bash
  NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/YOUR_ID/
  NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=public_...
  IMAGEKIT_PRIVATE_KEY=private_...
  ```

### For Email Notifications (Resend)
- [ ] Sign up at https://resend.com
- [ ] Create API key
- [ ] Add to `.env`:
  ```bash
  RESEND_API_KEY=re_...
  ```

## 🐛 Troubleshooting

### "Prisma Client Initialization Error"
**Problem:** DATABASE_URL is not set or invalid

**Solution:**
1. Check `.env` file exists
2. Verify DATABASE_URL is a real PostgreSQL connection
3. Run `bun run db:generate`
4. Restart dev server

### "Can't reach database server"
**Problem:** Database connection failed

**Solution:**
1. Verify your IP is whitelisted (Supabase: Settings → Database → Connection pooling)
2. Check connection string format
3. Try connection pooling port (6543) instead of direct (5432)

### "Table doesn't exist"
**Problem:** Database not initialized

**Solution:**
```bash
bun run db:setup
```

### "Module not found"
**Problem:** Dependencies not installed

**Solution:**
```bash
bun install
```

## 📚 Documentation

- [ENV_QUICK_REFERENCE.md](./ENV_QUICK_REFERENCE.md) - All environment variables
- [DATABASE_SETUP.md](./DATABASE_SETUP.md) - Detailed database guide
- [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) - Complete API key setup
- [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md) - Production deployment guide

## ✨ What's Working

After basic setup (Steps 1-5), you'll have:

✅ **Working:**
- Homepage with product grid
- Category browsing
- Product detail pages
- Admin dashboard (view products)
- Shopping cart (localStorage)
- User authentication
- Database-driven content

⚠️ **Requires Additional Setup:**
- Image uploads (need ImageKit)
- Checkout/Payments (need Stripe)
- Email notifications (need Resend)

## 🚀 Deploy to Production

Once everything works locally:

1. Push to GitHub
2. Connect to Netlify
3. Set environment variables in Netlify dashboard
4. Deploy!

See [DEPLOYMENT_STATUS.md](./DEPLOYMENT_STATUS.md) for detailed instructions.

---

**Need help?** Check the documentation files listed above or open an issue on GitHub.

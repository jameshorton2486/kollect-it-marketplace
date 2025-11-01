# Environment Variables Setup Guide

**⚠️ SECURITY WARNING**: Never commit real secrets to Git. All sensitive values should be stored in `.env` (local) or Netlify environment variables (deployment).

---

## 📋 Complete Environment Variables List

### Database (Supabase PostgreSQL)

#### `DATABASE_URL` (Required)

**Purpose**: Pooled connection for all application queries
**Format**: `postgresql://postgres:<PASSWORD>@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true`

**Where to get**:

1. Go to https://supabase.com/dashboard
2. Select your project
3. Settings → Database
4. Connection string → **Connection Pooler** (port 6543)
5. Copy and **MUST include `?pgbouncer=true`**

**Critical**: Use port **6543** (pooled) for application queries

#### `DIRECT_URL` (Required)

**Purpose**: Direct connection for migrations ONLY
**Format**: `postgresql://postgres:<PASSWORD>@aws-0-us-east-1.pooler.supabase.com:5432/postgres`

**Where to get**:

1. Same Supabase dashboard
2. Connection string → **Direct Connection** (port 5432)
3. Used ONLY for `bunx prisma migrate deploy` (local execution)

**Critical**: Use port **5432** (direct) for migrations, NOT in Netlify

---

### Authentication (NextAuth.js)

#### `NEXTAUTH_SECRET` (Required)

**Purpose**: Encrypts session tokens and cookies
**Format**: Random 32-byte base64 string

**How to generate**:

```bash
openssl rand -base64 32
```

**Example output**: `wK9x5vN2mP8qR3tY6u7Z0A1b4C5d8E9f`

**Critical**: Generate a **fresh** secret, never reuse examples

#### `NEXTAUTH_URL` (Required)

**Purpose**: Callback URL for authentication
**Format**: Your site's URL

**Values**:

- **Local dev**: `http://localhost:3000`
- **Netlify**: `https://your-site.netlify.app` (set AFTER first deploy)

**Critical**: Must match your deployment URL **exactly** or auth will fail

---

### Payments (Stripe)

#### `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (Required)

**Purpose**: Client-side Stripe initialization
**Format**: `pk_test_...` (test) or `pk_live_...` (production)

**Where to get**:

1. Go to https://dashboard.stripe.com/test/apikeys
2. Copy **Publishable key**
3. **Start with test keys** (`pk_test_...`)

**Security**: Safe to expose in client-side code (prefix `NEXT_PUBLIC_`)

#### `STRIPE_SECRET_KEY` (Required)

**Purpose**: Server-side payment processing
**Format**: `sk_test_...` (test) or `sk_live_...` (production)

**Where to get**:

1. Same Stripe dashboard
2. Copy **Secret key**
3. **Start with test keys** (`sk_test_...`)

**Security**: **NEVER expose** - server-side only, no `NEXT_PUBLIC_` prefix

**Switch to live keys**: Only after full verification with test cards

---

### Email (Resend)

#### `RESEND_API_KEY` (Required)

**Purpose**: Send transactional emails
**Format**: `re_...`

**Where to get**:

1. Go to https://resend.com/api-keys
2. Click "Create API Key"
3. Name: "Kollect-It Production"
4. Copy API key

**Security**: **NEVER expose** - server-side only

#### `EMAIL_FROM` (Required)

**Purpose**: "From" address for emails
**Format**: `Name <email@domain.com>`

**Values**:

- **Testing**: `Kollect-It <onboarding@resend.dev>` (Resend sandbox)
- **Production**: `Kollect-It <noreply@your-verified-domain.com>`

**For production**:

1. Go to https://resend.com/domains
2. Add your domain
3. Add DNS records to your domain registrar
4. Wait for verification
5. Use verified domain in `EMAIL_FROM`

#### `ADMIN_EMAIL` (Required)

**Purpose**: Where admin order notifications are sent
**Format**: `your-email@example.com`

**Value**: Your actual email address

---

### Images (ImageKit CDN)

#### `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` (Required)

**Purpose**: Base URL for image uploads/delivery
**Format**: `https://ik.imagekit.io/<YOUR_ID>/`

**Where to get**:

1. Go to https://imagekit.io/dashboard
2. Copy "URL-endpoint" (top right)
3. **Must end with `/`**

**Security**: Safe to expose (prefix `NEXT_PUBLIC_`)

#### `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY` (Required)

**Purpose**: Client-side image upload authentication
**Format**: `public_...`

**Where to get**:

1. ImageKit dashboard
2. Developer options → API keys
3. Copy "Public key"

**Security**: Safe to expose (prefix `NEXT_PUBLIC_`)

#### `IMAGEKIT_PRIVATE_KEY` (Required)

**Purpose**: Server-side image operations
**Format**: `private_...`

**Where to get**:

1. Same ImageKit dashboard
2. Developer options → API keys
3. Copy "Private key"

**Security**: **NEVER expose** - server-side only

---

## 🔧 Setup Instructions

### Local Development

#### 1. Copy Template

```bash
cd kollect-it-marketplace
cp .env.example .env
```

#### 2. Fill in Values

Edit `.env` and replace all placeholders with real values from service dashboards above.

**Example**:

```bash
# Before
DATABASE_URL="postgresql://postgres:<PASSWORD>@..."

# After (with your actual password)
DATABASE_URL="postgresql://postgres:MyRealPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
```

#### 3. Verify

```bash
# Start dev server
bun run dev

# Should connect to database and start without errors
```

#### 4. Never Commit

```bash
# Verify .env is ignored
git status

# .env should NOT appear (already in .gitignore)
```

---

### Netlify Deployment

#### 1. Access Environment Variables

1. Go to https://app.netlify.com
2. Select your site
3. Site settings → Environment variables
4. Click "Add a variable"

#### 2. Add Each Variable

For **each** variable above:

1. **Key**: Variable name (e.g., `DATABASE_URL`)
2. **Value**: Real value from service dashboard
3. **Scopes**: Production, Deploy previews, Branch deploys (all checked)
4. Click "Create variable"

#### 3. Critical Variables Checklist

- [ ] `DATABASE_URL` (pooled, port 6543, includes `?pgbouncer=true`)
- [ ] `DIRECT_URL` (direct, port 5432)
- [ ] `NEXTAUTH_SECRET` (freshly generated)
- [ ] `NEXTAUTH_URL` (**set AFTER first deploy** to actual Netlify URL)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (test key)
- [ ] `STRIPE_SECRET_KEY` (test key)
- [ ] `RESEND_API_KEY`
- [ ] `EMAIL_FROM`
- [ ] `ADMIN_EMAIL`
- [ ] `NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT` (ends with `/`)
- [ ] `NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY`
- [ ] `IMAGEKIT_PRIVATE_KEY`

#### 4. Deploy

After adding all variables:

1. Deploys → Trigger deploy → Deploy site
2. Wait for build to complete
3. Verify: `https://your-site.netlify.app/api/health`

---

## ✅ Verification

### Health Check Endpoint

Visit: `https://your-site.netlify.app/api/health`

**Healthy response**:

```json
{
  "status": "healthy",
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

**All variables should show `true`**

If any show `false`:

1. Go back to Netlify environment variables
2. Add the missing variable
3. Redeploy
4. Retest health endpoint

---

## 🔒 Security Best Practices

### DO

- ✅ Store all secrets in `.env` (local) or Netlify env vars (deployment)
- ✅ Use `.env.example` as template (with placeholders only)
- ✅ Generate fresh `NEXTAUTH_SECRET` for each environment
- ✅ Use test Stripe keys until fully verified
- ✅ Rotate secrets if exposed
- ✅ Use different secrets for dev/staging/production

### DON'T

- ❌ Commit `.env` files to Git
- ❌ Share secrets in chat/email
- ❌ Hardcode secrets in source code
- ❌ Reuse example secrets from documentation
- ❌ Use production secrets in development
- ❌ Expose server-side secrets with `NEXT_PUBLIC_` prefix

---

## 🔄 Secret Rotation

If secrets are exposed:

### 1. Database

1. Supabase → Settings → Database → Reset database password
2. Update `DATABASE_URL` and `DIRECT_URL` everywhere

### 2. NEXTAUTH_SECRET

1. Generate new: `openssl rand -base64 32`
2. Update in Netlify environment variables
3. Redeploy
4. All users will be logged out (expected)

### 3. Stripe

1. Stripe Dashboard → Developers → API keys → Roll keys
2. Update `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` and `STRIPE_SECRET_KEY`
3. Redeploy

### 4. Resend

1. Resend Dashboard → API Keys → Revoke old key
2. Create new API key
3. Update `RESEND_API_KEY`
4. Redeploy

### 5. ImageKit

1. ImageKit Dashboard → Developer options → Regenerate keys
2. Update all 3 ImageKit variables
3. Redeploy

---

## 🆘 Troubleshooting

### Variable not working after adding

**Fix**:

1. Verify variable name is **exact** (case-sensitive)
2. Verify no extra spaces in value
3. Redeploy after changing variables
4. Clear browser cache
5. Check health endpoint

### Database connection fails

**Check**:

1. `DATABASE_URL` uses port **6543** (pooled)
2. Includes `?pgbouncer=true` at end
3. Password is correct
4. Supabase project is not paused

### Authentication fails

**Check**:

1. `NEXTAUTH_URL` matches site URL **exactly**
2. No trailing slash: `https://site.netlify.app` (correct)
3. No trailing slash: `https://site.netlify.app/` (wrong)
4. Protocol matches: use `https://` for deployed sites

### Emails not sending

**Check**:

1. `RESEND_API_KEY` is set
2. For testing: Use `EMAIL_FROM="Kollect-It <onboarding@resend.dev>"`
3. For production: Verify domain in Resend dashboard
4. Test: `https://your-site.netlify.app/api/email/test`

---

**Last Updated**: October 24, 2025
**Version**: 1.0.0

# Database Setup Guide

**Comprehensive guide to PostgreSQL database configuration with Supabase/Neon**

---

## 🎯 Overview

The Kollect-It marketplace uses **PostgreSQL** with **two connection types**:

1. **Pooled Connection** (`DATABASE_URL`) - For application queries
2. **Direct Connection** (`DIRECT_URL`) - For database migrations

This ensures optimal performance and prevents connection issues during deployments.

---

## 📊 Connection Types Explained

### DATABASE_URL (Pooled - Port 6543)

**Purpose:** Used by your application at runtime  
**Technology:** PgBouncer connection pooling  
**Port:** 6543  
**Mode:** Transaction mode  
**Used by:**

- Next.js app queries
- Prisma Client
- API routes
- Server components

**Why pooled?**

- Handles many concurrent connections
- Prevents "too many connections" errors
- Better performance under load
- Required for serverless (Netlify Functions)

**Example:**

```
postgresql://user:pass@host:6543/db?pgbouncer=true
```

### DIRECT_URL (Direct - Port 5432)

**Purpose:** Used for database schema changes  
**Technology:** Direct PostgreSQL connection  
**Port:** 5432  
**Mode:** Session mode  
**Used by:**

- `prisma migrate deploy`
- `prisma migrate dev`
- `prisma db push`
- `prisma db pull`

**Why direct?**

- Migrations require session-level features
- PgBouncer doesn't support all migration commands
- Ensures schema changes apply correctly

**Example:**

```
postgresql://user:pass@host:5432/db
```

---

## 🚀 Getting Started

### Option 1: Supabase (Recommended)

#### Step 1: Create Project

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in:
   - **Name:** kollect-it-production
   - **Database Password:** (generate strong password)
   - **Region:** Choose closest to your users
4. Click "Create new project"
5. Wait ~2 minutes for provisioning

#### Step 2: Get Connection Strings

1. Go to **Project Settings** → **Database**
2. Scroll to "Connection string" section
3. Select "Connection Pooling" tab
4. Copy **Transaction Mode** string (port 6543) → This is `DATABASE_URL`
5. Select "Direct Connection" tab
6. Copy **Session Mode** string (port 5432) → This is `DIRECT_URL`

#### Step 3: Add to .env

```bash
# Pooled connection (port 6543) with pgbouncer parameter
DATABASE_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"

# Direct connection (port 5432) without pgbouncer
DIRECT_URL="postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-us-west-1.pooler.supabase.com:5432/postgres"
```

**⚠️ Important:**

- Replace `[YOUR-PASSWORD]` with your actual database password
- DATABASE_URL **must** have `?pgbouncer=true` at the end
- DIRECT_URL **must NOT** have pgbouncer parameter
- Both use same credentials, just different ports

### Option 2: Neon

#### Step 1: Create Project

1. Go to https://neon.tech
2. Click "Create a project"
3. Choose:
   - **Name:** kollect-it
   - **Region:** Closest to users
   - **PostgreSQL version:** 15 (latest)
4. Click "Create project"

#### Step 2: Get Connection String

1. Go to **Dashboard** → **Connection Details**
2. Copy the connection string
3. **Modify for both connections:**

```bash
# Original Neon connection string:
postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb

# For DATABASE_URL (change port to 6543):
DATABASE_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech:6543/neondb?sslmode=require"

# For DIRECT_URL (keep port 5432):
DIRECT_URL="postgresql://user:pass@ep-xxx.region.aws.neon.tech:5432/neondb?sslmode=require"
```

**Note:** Neon uses connection pooling by default on all ports.

---

## 🛠️ Database Commands

### Setup Scripts (package.json)

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:studio": "prisma studio",
    "db:seed": "tsx prisma/seed.ts",
    "db:setup": "prisma generate && prisma db push && prisma db seed"
  }
}
```

### Development Workflow

#### First Time Setup

```bash
# 1. Install dependencies
bun install

# 2. Set up .env file with DATABASE_URL and DIRECT_URL
cp .env.example .env
# Edit .env and add your connection strings

# 3. Generate Prisma Client
bun run db:generate

# 4. Push schema to database (uses DIRECT_URL)
bun run db:push

# 5. Seed with sample data (DEV ONLY)
bun run db:seed
```

**Or use the combined setup command:**

```bash
bun run db:setup
```

#### Daily Development

```bash
# Start dev server
bun run dev

# View database in GUI
bun run db:studio
```

### Production Deployment

#### Pre-Deployment

```bash
# 1. Create migration (development only)
bun run db:migrate

# This creates a new migration file in prisma/migrations/
# Commit this file to version control
```

#### Deployment (Netlify)

**⚠️ IMPORTANT:** Migrations run **separately** from build, not during build!

**Option 1: Manual Deployment** (Recommended)

```bash
# After Netlify build succeeds, run migrations:
DATABASE_URL="your-direct-url-here" bun run db:migrate:deploy
```

**Option 2: Netlify Deploy Hook** (Advanced)

1. Create deploy hook in Netlify
2. Set up post-deploy command:

```bash
bunx prisma migrate deploy
```

**Never run during build:** Migrations are removed from build command to prevent issues.

---

## 🌱 Database Seeding

### Seed Safety

The seed script (`prisma/seed.ts`) has built-in production protection:

```typescript
// Top of seed.ts
if (process.env.NODE_ENV === 'production') {
  throw new Error('❌ SEEDING BLOCKED: Do not run database seeding in production!');
}
```

**What the seed includes:**

- Sample admin account (email: `admin@kollect-it.com`, password: `admin123`)
- 4 product categories (Fine Art, Antique Books, Collectibles, Militaria)
- 6 sample products

### When to Seed

 **Do seed:**

- Local development
- Testing environments
- Demo instances

 **Never seed:**

- Production database
- Live customer data
- After real orders exist

### How to Seed

```bash
# Development only
bun run db:seed
```

**Output:**

```
  Running in development mode only
 Admin user created: admin@kollect-it.com
 Categories created: 4
 Products created: 6
```

---

## 🔍 Verification & Diagnostics

### Check Environment Variables

```bash
curl http://localhost:3000/api/diagnostics/env
```

**Should return:**

```json
{
  "status": "complete",
  "missing": 0,
  "missingVariables": []
}
```

### Test Database Connection

```bash
# Opens Prisma Studio GUI
bun run db:studio
```

**Should:**

- Open browser at http://localhost:5555
- Show all database tables
- Allow browsing data

### Test Pooled vs Direct

```bash
# Test pooled connection (app runtime)
DATABASE_URL="your-pooled-url" bun run dev

# Test direct connection (migrations)
DIRECT_URL="your-direct-url" bun run db:migrate:deploy
```

---

## 🐛 Troubleshooting

### "Can't reach database server"

**Problem:** Connection string is wrong

**Check:**

- [ ] Port number (6543 for DATABASE_URL, 5432 for DIRECT_URL)
- [ ] Password is correct
- [ ] Host name is correct
- [ ] Database name exists

**Test connection:**

```bash
# Using psql (if installed)
psql "your-connection-string-here"
```

### "Too many connections"

**Problem:** Using direct connection (port 5432) instead of pooled (6543)

**Fix:**

```bash
# Make sure DATABASE_URL uses port 6543
DATABASE_URL="postgresql://...@host:6543/db?pgbouncer=true"
```

### "Migration failed: prepared statement not supported"

**Problem:** Trying to run migrations through pooled connection

**Fix:**

```bash
# Make sure DIRECT_URL uses port 5432
DIRECT_URL="postgresql://...@host:5432/db"

# Migrations automatically use DIRECT_URL
bun run db:migrate:deploy
```

### "Prisma Client not generated"

**Fix:**

```bash
bun run db:generate
```

### "Seeding blocked in production"

**This is intentional!** Production guard is working.

**Solutions:**

- Use development environment for seeding
- Manually add data through Prisma Studio
- Create production data import script

---

## 📋 Production Checklist

### Before Deploying

- [ ] DATABASE_URL uses pooled connection (port 6543)
- [ ] DIRECT_URL uses direct connection (port 5432)
- [ ] Both URLs have SSL enabled (`?sslmode=require`)
- [ ] Migrations created and committed to repo
- [ ] Database backups enabled in Supabase/Neon
- [ ] Environment variables set in Netlify

### After Deploying

- [ ] Run migrations: `bun run db:migrate:deploy`
- [ ] Verify tables created: `bun run db:studio`
- [ ] Test app connection: Visit deployed site
- [ ] Check diagnostics: `/api/diagnostics/env`
- [ ] **DO NOT** run seed in production

### Ongoing Maintenance

- [ ] Weekly: Check database size/usage
- [ ] Monthly: Review slow queries
- [ ] Quarterly: Rotate database password
- [ ] Regular: Database backups automated

---

## 🔄 Migration Workflow

### Creating Migrations (Development)

```bash
# 1. Edit prisma/schema.prisma
# (add new model, field, etc.)

# 2. Create migration
bun run db:migrate

# 3. Name the migration (e.g., "add-user-profile")

# 4. Migration file created in prisma/migrations/

# 5. Commit to git
git add prisma/migrations/
git commit -m "Add user profile migration"
```

### Applying Migrations (Production)

```bash
# Option 1: Manual (recommended)
DATABASE_URL="your-direct-url" bun run db:migrate:deploy

# Option 2: Via CI/CD
# Add to deployment pipeline after build succeeds
```

### Migration Best Practices

 **Do:**

- Test migrations in development first
- Create migration for every schema change
- Commit migration files to version control
- Run migrations separately from app deployment

 **Don't:**

- Run migrations during build process
- Skip creating migrations (using db:push in production)
- Delete migration files
- Run migrations through pooled connection

---

## 🔒 Security Best Practices

### Connection Strings

- ❌ Never commit to version control
- ✅ Use environment variables
- ✅ Rotate passwords quarterly
- ✅ Use SSL/TLS (`?sslmode=require`)

### Database Access

- ✅ Use least-privilege access
- ✅ Enable Row Level Security (RLS) in Supabase
- ✅ Set up database backups
- ✅ Monitor query performance

### Prisma Studio

- ❌ Don't expose publicly
- ✅ Only use locally
- ✅ Require authentication if needed
- ✅ Use read-only mode for production viewing

---

## 📚 Related Documentation

- [ENV_SETUP.md](./ENV_SETUP.md) - Environment variables guide
- [SECURITY.md](./SECURITY.md) - Security best practices
- [DEPLOYMENT_STATUS.md](../DEPLOYMENT_STATUS.md) - Deployment guide

---

## 🎯 Quick Reference

### Environment Variables

```bash
# Required for database
DATABASE_URL=    # Pooled (6543)
DIRECT_URL=      # Direct (5432)
```

### Common Commands

```bash
# Development
bun run db:setup        # First time setup
bun run db:studio       # View database
bun run db:seed         # Add sample data

# Migrations
bun run db:migrate      # Create migration (dev)
bun run db:migrate:deploy  # Apply migrations (prod)

# Utilities
bun run db:generate     # Generate Prisma Client
bun run db:push         # Push schema without migration
```

### Connection Formats

```bash
# Supabase
DATABASE_URL="postgresql://postgres.xxx:pass@host.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.xxx:pass@host.supabase.com:5432/postgres"

# Neon
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech:6543/db?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxx.neon.tech:5432/db?sslmode=require"
```

---

**Last Updated:** October 24, 2025  
**Status:** ✅ Production ready with pooled connections

**Need help?** Check troubleshooting section or Prisma docs: https://pris.ly/d/prisma-schema

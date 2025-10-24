# Database Setup Guide - PostgreSQL

This project uses **PostgreSQL** with **Prisma ORM** for database management.

## Prerequisites

- PostgreSQL database instance (see options below)
- Database connection string in `.env` file

## Getting a PostgreSQL Database

Choose one of these free options:

### Option 1: Supabase (Recommended)
1. Go to https://supabase.com
2. Create a new project
3. Go to Settings → Database
4. Copy the connection string (Connection Pooling)
5. Format: `postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres`

### Option 2: Neon (Serverless)
1. Go to https://neon.tech
2. Create a new project
3. Copy the connection string from the dashboard
4. Format: `postgresql://[user]:[password]@[endpoint].neon.tech/[database]?sslmode=require`

### Option 3: Vercel Postgres
1. Go to https://vercel.com/storage/postgres
2. Create a new database
3. Copy the `POSTGRES_PRISMA_URL` connection string

## Environment Setup

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update `DATABASE_URL` in `.env` with your PostgreSQL connection string:
   ```env
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
   ```

## Available Database Commands

### For Local Development

#### Full Setup (First Time)
Generates Prisma Client, creates migration, and seeds database:
```bash
bun run db:setup
```

#### Individual Commands
```bash
# Generate Prisma Client (run after schema changes)
bun run db:generate

# Create and apply migration
bun run db:migrate

# Seed the database with sample data
bun run db:seed

# Open Prisma Studio (database GUI)
bun run db:studio

# Push schema changes without migration (for prototyping)
bun run db:push
```

### For Production Deployment

#### On Netlify/Vercel (Automated)
The build process automatically runs:
```bash
bunx prisma generate && bunx prisma migrate deploy && npm run build
```

This happens in `netlify.toml` or during the build step.

#### Manual Production Migration
```bash
bun run db:migrate:deploy
```

## Step-by-Step First Time Setup

1. **Set up your PostgreSQL database** (see options above)

2. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env and add your DATABASE_URL
   ```

3. **Run the complete setup**:
   ```bash
   bun run db:setup
   ```
   This will:
   - Generate Prisma Client
   - Create the initial migration
   - Create all database tables
   - Seed with sample data (admin user, categories, products)

4. **Start the development server**:
   ```bash
   bun run dev
   ```

## Default Admin Credentials

After seeding, you can log in with:
- **Email**: `admin@kollect-it.com`
- **Password**: `admin123`

⚠️ **Change these credentials in production!**

## Troubleshooting

### "Can't reach database server"
- Verify your DATABASE_URL is correct
- Check that your IP is whitelisted (for cloud databases)
- Ensure SSL mode is properly configured

### "Migration failed"
- Ensure the database is empty for the first migration
- Or reset with: `bunx prisma migrate reset` (⚠️ deletes all data)

### "Prisma Client not generated"
- Run: `bun run db:generate`
- Restart your dev server

## Database Schema Changes

When you modify `prisma/schema.prisma`:

1. **Development**:
   ```bash
   bun run db:migrate
   # Follow the prompts to name your migration
   ```

2. **Production**:
   - Commit your migration files to git
   - Deploy - migrations will run automatically

## Reset Database (Development Only)

⚠️ **This deletes all data!**
```bash
bunx prisma migrate reset
```
This will:
- Drop the database
- Recreate it
- Run all migrations
- Seed with sample data

## Migration Files

Migrations are stored in `prisma/migrations/`.

**Important**:
- Always commit migration files to version control
- Never edit migration files after they've been applied
- Never delete migration files that have been deployed to production

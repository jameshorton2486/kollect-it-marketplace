# Security Policy & Guidelines

**Kollect-It Marketplace - Security Best Practices**

---

## 🚨 CRITICAL: Never Commit Secrets

**ABSOLUTELY NEVER commit these to version control:**

- ❌ `.env` files with real values
- ❌ API keys (Stripe, Resend, ImageKit, etc.)
- ❌ Database credentials
- ❌ Private keys
- ❌ Authentication secrets
- ❌ Service account credentials

**Consequences of leaked secrets:**
- Unauthorized access to your database
- Financial loss (Stripe charges)
- Email quota abuse (Resend)
- Image hosting abuse (ImageKit)
- Data breaches
- Service account compromise

---

## ✅ Security Audit Results (Current Status)

### Audit Performed: October 24, 2025

**✅ SECURE:**
- `.env` is in `.gitignore` ✅
- No `.env` files committed to git history ✅
- Only `.env.example` committed (with placeholders) ✅
- No hardcoded secrets in source code ✅
- All documentation uses example values only ✅

**STATUS: Repository is CLEAN** 🎉

---

## 🔐 Credential Rotation Guide

**If you suspect credentials were exposed, rotate IMMEDIATELY:**

### A) Supabase (Database)

1. **Reset Database Password:**
   - Go to https://supabase.com/dashboard
   - Select your project → Settings → Database
   - Click "Reset database password"
   - Update `DATABASE_URL` in `.env` and Netlify

2. **Rotate Service Keys:**
   - Settings → API
   - Generate new `anon` and `service_role` keys
   - Update in environment variables

### B) Resend (Email)

1. **Create New API Key:**
   - Go to https://resend.com/api-keys
   - Click "Create API Key"
   - Copy new key

2. **Delete Old Key:**
   - Find the compromised key
   - Click "Delete"
   - Update `RESEND_API_KEY` everywhere

### C) ImageKit

1. **Rotate Private Key:**
   - Go to https://imagekit.io/dashboard
   - Developer options → API keys
   - Click "Reset private key"
   - Update `IMAGEKIT_PRIVATE_KEY`

2. **Public key can remain** (it's meant to be public)

### D) Stripe

**⚠️ CRITICAL: Confirm TEST vs LIVE keys**

1. **Check Current Keys:**
   ```bash
   # Test keys start with:
   pk_test_... (safe for development)
   sk_test_... (safe for development)
   
   # Live keys start with:
   pk_live_... (NEVER commit!)
   sk_live_... (NEVER commit!)
   ```

2. **If TEST keys leaked:**
   - Go to https://dashboard.stripe.com/test/apikeys
   - Click "Roll" on the secret key
   - Update in `.env` and Netlify

3. **If LIVE keys leaked:**
   - **IMMEDIATELY** roll keys in Stripe Dashboard
   - Go to https://dashboard.stripe.com/apikeys
   - Roll secret key
   - Update everywhere
   - Monitor for fraudulent activity

### E) NextAuth Secret

1. **Generate New Secret:**
   ```bash
   openssl rand -base64 32
   ```

2. **Update:**
   - Replace `NEXTAUTH_SECRET` in `.env`
   - Update in Netlify
   - **NOTE:** All users will be logged out

---

## 🛡️ Prevention: How to Keep Secrets Safe

### 1. Use .gitignore (Already Configured ✅)

Current `.gitignore` includes:
```
.env
.env*.local
.env.production
*.pem
*.key
```

**Never remove these entries!**

### 2. Use .env Files Correctly

**✅ CORRECT:**
```bash
# .env (NOT committed)
STRIPE_SECRET_KEY=sk_test_abc123...
DATABASE_URL=postgresql://user:pass@host:5432/db
```

**❌ WRONG:**
```typescript
// src/lib/stripe.ts (committed)
const STRIPE_KEY = 'sk_test_abc123...'; // ❌ NEVER DO THIS
```

### 3. Use Environment Variables

**✅ CORRECT:**
```typescript
const stripeKey = process.env.STRIPE_SECRET_KEY;
if (!stripeKey) {
  throw new Error('Missing STRIPE_SECRET_KEY');
}
```

**❌ WRONG:**
```typescript
const stripeKey = 'sk_test_hardcoded'; // ❌ NEVER
```

### 4. Netlify Environment Variables

**Set in Netlify Dashboard:**
- Site settings → Environment variables
- Add each variable individually
- **NEVER** commit values to code

**Example netlify.toml (✅ SAFE):**
```toml
# Comments explain which vars are needed
# STRIPE_SECRET_KEY = "set in Netlify dashboard"
```

**Example netlify.toml (❌ DANGEROUS):**
```toml
[build.environment]
  STRIPE_SECRET_KEY = "sk_test_abc123" # ❌ NEVER DO THIS
```

---

## 🔍 How to Check for Exposed Secrets

### Quick Scan Commands

```bash
# Check if .env is committed
git ls-files | grep '\.env$'
# Expected: (no output)

# Check git history for .env
git log --all --full-history -- .env
# Expected: (no commits)

# Search committed files for potential secrets
git ls-files | xargs grep -l 'sk_test_\|sk_live_\|re_[a-zA-Z0-9]\{32\}'
# Expected: only .env.example and docs (with placeholders)

# Check current working directory
ls -la .env*
# Expected: .env (not committed), .env.example (committed)
```

### Manual Review

1. **Check all committed files:**
   ```bash
   git ls-files
   ```

2. **Look for suspicious patterns:**
   - `sk_test_` or `sk_live_` followed by long strings
   - `re_` followed by 32+ characters
   - `postgresql://username:password@host`
   - Long base64 strings
   - JWT tokens

3. **Review recent commits:**
   ```bash
   git log -p -5
   ```

---

## 🚨 If Secrets Were Committed

**DO NOT just delete the file in a new commit!**

Git history still contains the secrets. You must:

### Option 1: Use git-filter-repo (Recommended)

**⚠️ This rewrites history - coordinate with team first!**

```bash
# Install git-filter-repo
# macOS: brew install git-filter-repo
# Ubuntu: apt install git-filter-repo

# Remove .env from all history
git filter-repo --path .env --invert-paths

# Force push (dangerous!)
git push origin --force --all
```

### Option 2: BFG Repo-Cleaner

```bash
# Download BFG
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# Remove .env files
java -jar bfg-1.14.0.jar --delete-files .env

# Clean up
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

### Option 3: Create New Repository

If secrets are in many commits:
1. Create fresh repository
2. Copy current working directory (excluding .git)
3. Initialize new git repo
4. First commit: clean codebase
5. Update remote URL

**After cleaning:** Rotate ALL exposed credentials immediately!

---

## 📋 Security Checklist

### Before Every Commit

- [ ] Check what's being committed: `git status`
- [ ] Review changes: `git diff --staged`
- [ ] Ensure no `.env` files: `git ls-files | grep .env`
- [ ] Search for secrets: `git diff --staged | grep -E 'sk_|re_'`

### Before Every Push

- [ ] Review commit history: `git log -p -3`
- [ ] Scan for secrets in diff
- [ ] Verify `.gitignore` is working

### Monthly Security Audit

- [ ] Rotate database passwords
- [ ] Rotate API keys
- [ ] Review Netlify env variables
- [ ] Check Stripe webhook secrets
- [ ] Audit access logs
- [ ] Review team access

---

## 🔒 Additional Security Best Practices

### 1. Database Security

- Use connection pooling (Supabase pooler port 6543)
- Enable SSL/TLS (`?sslmode=require`)
- Use read-only users for analytics
- Regular backups
- Row-level security (RLS) when possible

### 2. API Key Security

- Use separate keys for dev/staging/prod
- Rotate keys every 90 days
- Monitor usage and set alerts
- Restrict API key permissions
- Use IP allowlists when available

### 3. Stripe Security

- Always use test keys in development
- Never log full card numbers
- Enable Stripe Radar for fraud detection
- Set up webhook signature verification
- Monitor for unusual activity

### 4. Environment Variables

- Never log environment variables
- Use separate values per environment
- Document all required variables
- Validate on app startup
- Fail fast if missing

### 5. Code Review

- Review all PRs for secrets
- Use automated scanning (GitHub Secret Scanning)
- Reject commits with potential secrets
- Educate team on security

---

## 🚨 Incident Response

### If Secrets Are Leaked

1. **STOP** - Don't panic, act methodically
2. **ROTATE** - Change compromised credentials immediately
3. **AUDIT** - Check for unauthorized access
4. **CLEAN** - Remove secrets from git history
5. **MONITOR** - Watch for suspicious activity
6. **DOCUMENT** - Record what happened
7. **PREVENT** - Update processes to avoid repeat

### Who to Contact

- **Stripe:** https://support.stripe.com (for payment fraud)
- **Supabase:** https://supabase.com/support
- **Resend:** support@resend.com
- **GitHub:** https://github.com/security (for leaked secrets)

---

## 📚 Tools & Resources

### Secret Scanning Tools

- **GitHub Secret Scanning** (automatic for public repos)
- **git-secrets** (https://github.com/awslabs/git-secrets)
- **truffleHog** (https://github.com/trufflesecurity/truffleHog)
- **detect-secrets** (https://github.com/Yelp/detect-secrets)

### Pre-commit Hooks

Install git hooks to prevent commits with secrets:

```bash
# Install git-secrets
brew install git-secrets

# Set up hooks
cd kollect-it-marketplace
git secrets --install
git secrets --register-aws

# Add custom patterns
git secrets --add 'sk_test_[a-zA-Z0-9]+'
git secrets --add 'sk_live_[a-zA-Z0-9]+'
git secrets --add 're_[a-zA-Z0-9]{32,}'
```

---

## ✅ Current Repository Status

**Last Audited:** October 24, 2025

- ✅ No secrets in git history
- ✅ .gitignore properly configured
- ✅ Only example values in documentation
- ✅ No hardcoded credentials
- ✅ Environment variables used correctly

**STATUS:** 🟢 **SECURE**

---

## 📝 Quick Reference

### Safe to Commit

- ✅ `.env.example` (with placeholder values)
- ✅ Code referencing `process.env.VAR_NAME`
- ✅ Documentation with example values
- ✅ Config files without secrets

### Never Commit

- ❌ `.env` (real values)
- ❌ API keys
- ❌ Database passwords
- ❌ Private keys
- ❌ Session secrets
- ❌ Webhook secrets

---

**Remember: Once committed to git, secrets are compromised forever!**

Even if you delete them in a later commit, they remain in git history.

**When in doubt, DON'T COMMIT IT!**

---

**Last Updated:** October 24, 2025
**Security Officer:** Same AI
**Next Audit:** Monthly

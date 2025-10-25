# Credential Rotation Checklist

**Use this checklist if you need to rotate credentials due to suspected exposure.**

---

## 🚨 Immediate Actions (Do First)

### Priority 1: Payment Systems (Stripe)

- [ ] **Check if LIVE or TEST keys are exposed**
  ```bash
  grep -r "sk_live_\|pk_live_" . --exclude-dir=node_modules
  ```
  
- [ ] **If LIVE keys exposed:**
  - [ ] Go to https://dashboard.stripe.com/apikeys IMMEDIATELY
  - [ ] Click "Roll" on Secret key
  - [ ] Update in Netlify environment variables
  - [ ] Update local `.env` file
  - [ ] Check Stripe Dashboard for suspicious transactions
  - [ ] Contact Stripe support if fraud suspected
  
- [ ] **If TEST keys exposed:**
  - [ ] Go to https://dashboard.stripe.com/test/apikeys
  - [ ] Click "Roll" on Secret key
  - [ ] Update everywhere (less critical but still do it)

### Priority 2: Database (Supabase/Neon)

- [ ] **Reset Database Password:**
  - [ ] Login to https://supabase.com (or your DB provider)
  - [ ] Go to Project → Settings → Database
  - [ ] Click "Reset database password"
  - [ ] Copy new connection string
  
- [ ] **Update DATABASE_URL:**
  - [ ] Update `.env` file locally
  - [ ] Update Netlify: Site settings → Environment variables
  - [ ] Test connection: `bun run db:studio`
  
- [ ] **Rotate service keys (if using Supabase):**
  - [ ] Settings → API
  - [ ] Generate new `anon` key
  - [ ] Generate new `service_role` key
  - [ ] Update in environment variables

### Priority 3: Email (Resend)

- [ ] **Create New API Key:**
  - [ ] Go to https://resend.com/api-keys
  - [ ] Click "Create API Key"
  - [ ] Name it (e.g., "Production Key - Oct 2025")
  - [ ] Copy the key IMMEDIATELY (shown only once)
  
- [ ] **Delete Old Key:**
  - [ ] Find the compromised key in list
  - [ ] Click "Delete"
  - [ ] Confirm deletion
  
- [ ] **Update RESEND_API_KEY:**
  - [ ] Update `.env` file
  - [ ] Update Netlify environment variables
  - [ ] Test: `curl http://localhost:3000/api/email/test`

### Priority 4: Image Hosting (ImageKit)

- [ ] **Rotate Private Key:**
  - [ ] Go to https://imagekit.io/dashboard
  - [ ] Navigate to Developer options → API keys
  - [ ] Click "Reset private key"
  - [ ] Copy new private key
  
- [ ] **Update IMAGEKIT_PRIVATE_KEY:**
  - [ ] Update `.env` file
  - [ ] Update Netlify environment variables
  - [ ] Test image upload in admin panel
  
- [ ] **Note:** Public key does NOT need rotation (it's public)

### Priority 5: Authentication (NextAuth)

- [ ] **Generate New Secret:**
  ```bash
  openssl rand -base64 32
  ```
  
- [ ] **Update NEXTAUTH_SECRET:**
  - [ ] Replace in `.env` file
  - [ ] Update Netlify environment variables
  
- [ ] **Warning:** This will log out ALL users
  
- [ ] **Communicate to users if production:**
  - [ ] Send notification about security update
  - [ ] Explain they need to log in again

---

## 📋 Post-Rotation Verification

### Test All Services

- [ ] **Database Connection:**
  ```bash
  cd kollect-it-marketplace
  bun run db:studio
  # Should open without errors
  ```

- [ ] **Stripe Payment:**
  ```bash
  # Test checkout with card: 4242 4242 4242 4242
  # Should complete successfully
  ```

- [ ] **Email Sending:**
  ```bash
  curl http://localhost:3000/api/email/test
  # Should receive test email
  ```

- [ ] **Image Upload:**
  - [ ] Login to admin panel
  - [ ] Try uploading product image
  - [ ] Verify it appears in ImageKit dashboard

- [ ] **Authentication:**
  - [ ] Log out of admin
  - [ ] Log back in
  - [ ] Verify session works

### Netlify Deployment

- [ ] **Update all environment variables in Netlify:**
  - [ ] Go to: Site settings → Environment variables
  - [ ] Update each rotated credential
  - [ ] Click "Save"
  
- [ ] **Trigger new deployment:**
  ```bash
  git commit --allow-empty -m "Trigger deployment after credential rotation"
  git push origin main
  ```
  
- [ ] **Verify deployment:**
  - [ ] Check Netlify build logs
  - [ ] Visit deployed site
  - [ ] Test checkout flow
  - [ ] Test admin login

### Monitor for Issues

- [ ] **Check for errors (first 24 hours):**
  - [ ] Netlify function logs
  - [ ] Stripe Dashboard for failed payments
  - [ ] Resend Dashboard for bounced emails
  - [ ] ImageKit usage logs
  
- [ ] **Watch for suspicious activity:**
  - [ ] Unexpected database queries
  - [ ] Unusual payment patterns
  - [ ] High email sending volume
  - [ ] Abnormal image uploads

---

## 🧹 Clean Up Git History (If Needed)

**Only if secrets were actually committed to git!**

### Check If Cleanup Needed

```bash
# Check git history for .env files
git log --all --full-history -- .env

# Search all commits for potential secrets
git log -p --all -S "sk_test_" | head -100
```

### If Secrets Found in History

**⚠️ WARNING: This rewrites history. Coordinate with team!**

#### Option 1: git-filter-repo (Recommended)

```bash
# Install
# macOS: brew install git-filter-repo
# Linux: pip install git-filter-repo

# Remove .env from all history
git filter-repo --path .env --invert-paths

# Force push to remote
git push origin --force --all
git push origin --force --tags
```

#### Option 2: BFG Repo-Cleaner

```bash
# Download BFG
wget https://repo1.maven.org/maven2/com/madgag/bfg/1.14.0/bfg-1.14.0.jar

# Remove .env files from history
java -jar bfg-1.14.0.jar --delete-files .env

# Clean up repository
git reflog expire --expire=now --all
git gc --prune=now --aggressive

# Force push
git push origin --force --all
```

#### Option 3: Create New Repository

If secrets are scattered throughout history:

```bash
# 1. Create new empty repo on GitHub
# 2. Copy working directory (exclude .git)
mkdir ../kollect-it-clean
cp -r . ../kollect-it-clean
cd ../kollect-it-clean
rm -rf .git

# 3. Initialize fresh git repo
git init
git add .
git commit -m "Initial commit - clean repository"

# 4. Push to new repo
git remote add origin https://github.com/user/kollect-it-marketplace.git
git branch -M main
git push -u origin main
```

### After History Cleanup

- [ ] Verify secrets are gone: `git log -p --all -S "sk_test_"`
- [ ] All team members must re-clone the repository
- [ ] Update any CI/CD systems with new repo URL
- [ ] Rotate ALL credentials that were in history (even if removed)

---

## 📊 Rotation Log Template

**Keep a record of rotations for audit purposes:**

```
DATE: 2025-10-24
REASON: Routine security audit / Suspected exposure / [Other]
ROTATED BY: [Your name]

CREDENTIALS ROTATED:
- [ ] Stripe Secret Key (TEST/LIVE)
- [ ] Database Password
- [ ] Resend API Key
- [ ] ImageKit Private Key
- [ ] NextAuth Secret

VERIFICATION COMPLETED:
- [ ] All services tested
- [ ] Netlify redeployed
- [ ] No errors in logs
- [ ] Team notified

NOTES:
[Any additional information about the rotation]
```

---

## 🚨 Emergency Contacts

If you detect active exploitation:

- **Stripe Fraud:** https://support.stripe.com → "Report fraud"
- **Database Breach:** Contact your DB provider immediately
- **GitHub Leaked Secrets:** https://github.com/security
- **General Security:** Document everything, notify stakeholders

---

## ✅ Prevention for Next Time

After rotation, update processes:

- [ ] Install git pre-commit hooks (see SECURITY.md)
- [ ] Enable GitHub secret scanning
- [ ] Set up monthly credential rotation reminder
- [ ] Add security review to PR checklist
- [ ] Train team on secret management
- [ ] Implement automated secret detection

---

**Remember:** 
- Rotate immediately when in doubt
- Better safe than sorry
- Document everything
- Learn from incidents

**Status after completion:** Update SECURITY.md with rotation date

---

Last Updated: October 24, 2025

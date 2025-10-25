# Email Notifications Setup Guide

**Email Service**: Resend - Transactional email API for order notifications

---

## 🎯 Overview

The Kollect-It marketplace sends email notifications for:
- **Order Confirmations**: Sent to customers after successful checkout
- **Admin Alerts**: Notify admin of new orders
- **Status Updates**: Inform customers when order status changes (shipped, delivered)
- **Test Emails**: Verify email configuration

---

## 🔧 Setup Instructions

### 1. Create Resend Account

1. Go to: **https://resend.com**
2. Click **"Sign Up"**
3. Verify email address
4. Complete account setup

**Free Tier**: 100 emails/day, 3,000 emails/month (sufficient for testing)

### 2. Get API Key

1. Go to: **https://resend.com/api-keys**
2. Click **"Create API Key"**
3. **Name**: `Kollect-It Production`
4. **Permission**: Full Access
5. Click **"Create"**
6. **Copy API key** (starts with `re_`)
   - Format: `re_abc123...`
   - **Save immediately** - you won't see it again

### 3. Add to Environment Variables

**Local (.env)**:
```bash
RESEND_API_KEY="re_abc123..."
EMAIL_FROM="Kollect-It <onboarding@resend.dev>"
ADMIN_EMAIL="your-email@example.com"
```

**Netlify**:
1. Site settings → Environment variables
2. Add:
   - `RESEND_API_KEY`: Your API key
   - `EMAIL_FROM`: Sender address
   - `ADMIN_EMAIL`: Where admin notifications go
3. Deploy

### 4. Test Email Configuration

Visit: `https://your-site.netlify.app/api/email/test`

**Expected Response**:
```json
{
  "success": true,
  "message": "Test email sent successfully",
  "messageId": "abc-123...",
  "sentTo": "your-email@example.com",
  "sentFrom": "Kollect-It <onboarding@resend.dev>"
}
```

**Check Inbox**:
- Verify email received
- Subject: "Kollect-It Email Test - Configuration Successful! ✅"
- From: Kollect-It
- Contains configuration details

**If email not received**:
1. Check spam/junk folder
2. Verify `RESEND_API_KEY` is correct
3. Check Resend logs: https://resend.com/emails
4. Verify `ADMIN_EMAIL` is correct email address

---

## 📧 Email Templates

### 1. Order Confirmation (Customer)

**Sent**: After successful checkout
**To**: Customer email from checkout form
**Subject**: "Order Confirmation - #{orderNumber}"

**Includes**:
- Order number
- Order summary (items, quantities, prices)
- Totals (subtotal, tax, shipping, total)
- Shipping address
- Payment confirmation
- Estimated delivery

**Template**: `src/components/emails/OrderConfirmation.tsx`

### 2. Admin New Order Alert

**Sent**: After successful checkout
**To**: `ADMIN_EMAIL`
**Subject**: "New Order - #{orderNumber}"

**Includes**:
- Order number and timestamp
- Customer details (name, email, phone)
- Order items
- Shipping address
- Payment total
- Link to admin dashboard

**Template**: `src/components/emails/AdminNewOrder.tsx`

### 3. Order Status Update (Customer)

**Sent**: When admin updates order status
**To**: Customer email
**Subject**: "Order Update - #{orderNumber}"

**Includes**:
- Order number
- New status (Processing, Shipped, Delivered)
- Tracking number (if shipped)
- Carrier (USPS, UPS, FedEx, etc.)
- Estimated delivery date

**Template**: `src/components/emails/OrderStatusUpdate.tsx`

---

## 🌐 Domain Verification (Production)

### Why Verify Domain

**Testing** (onboarding@resend.dev):
- ✅ Works immediately
- ✅ No setup required
- ❌ "via resend.dev" in email
- ❌ Lower deliverability
- ❌ Limited to 100/day

**Production** (your-domain.com):
- ✅ Professional "From" address
- ✅ Higher deliverability
- ✅ No "via" message
- ✅ Builds sender reputation
- ❌ Requires DNS setup

### Verify Your Domain

#### 1. Add Domain in Resend

1. Go to: **https://resend.com/domains**
2. Click **"Add Domain"**
3. Enter your domain: `yourdomain.com`
4. Click **"Add"**

#### 2. Add DNS Records

Resend will provide DNS records to add:

**SPF Record** (Type: TXT):
```
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

**DKIM Record** (Type: TXT):
```
Name: resend._domainkey
Value: [Long string provided by Resend]
```

**DMARC Record** (Type: TXT):
```
Name: _dmarc
Value: v=DMARC1; p=none; rua=mailto:your-email@example.com
```

#### 3. Add Records to DNS Provider

**Where to add** (depends on domain registrar):
- **Namecheap**: Advanced DNS → Add New Record
- **GoDaddy**: DNS → Manage Zones → Add Record
- **Cloudflare**: DNS → Add Record
- **Google Domains**: DNS → Custom records

**Add each record**:
1. Copy **Name** from Resend
2. Select **Type** (TXT)
3. Copy **Value** from Resend
4. Save

#### 4. Verify in Resend

1. Return to https://resend.com/domains
2. Click **"Verify"** next to your domain
3. Wait for verification (can take up to 48 hours)
4. Status changes to **"Verified"** ✅

#### 5. Update EMAIL_FROM

After verification, update environment variable:

**Netlify**:
```bash
EMAIL_FROM="Kollect-It <noreply@yourdomain.com>"
```

**Redeploy** site for changes to take effect

---

## 📊 Email Delivery Monitoring

### Resend Dashboard

**View Sent Emails**:
1. Go to: **https://resend.com/emails**
2. See all sent emails
3. Click any email for details:
   - Delivery status
   - Opens/clicks (if tracking enabled)
   - Bounce/complaint status
   - Full content preview

**Filter Options**:
- By date range
- By status (delivered, bounced, failed)
- By recipient
- By subject

### Email Status Types

| Status | Meaning |
|--------|---------|
| **Sent** | Email accepted by Resend |
| **Delivered** | Email successfully delivered to recipient's server |
| **Bounced** | Email rejected (invalid address, full inbox) |
| **Failed** | Delivery attempt failed |
| **Complaint** | Recipient marked as spam |

### Troubleshooting Bounces

**Soft Bounce** (temporary):
- Inbox full
- Server temporarily unavailable
- Email too large

**Hard Bounce** (permanent):
- Invalid email address
- Domain doesn't exist
- Recipient blocked sender

**Fix**:
1. Verify email address format
2. Remove invalid addresses
3. Check domain reputation
4. Don't resend to hard bounces

---

## 🆘 Troubleshooting

### Emails Not Sending

**Check**:
1. `RESEND_API_KEY` is set correctly
2. No extra spaces or quotes
3. API key starts with `re_`
4. Redeploy after changing variables
5. Check health endpoint: `/api/health`

**Test**:
```bash
curl https://your-site.netlify.app/api/email/test
```

**Check Resend Logs**:
1. Go to: https://resend.com/emails
2. Look for failed sends
3. Click failed email for error details

### Emails Going to Spam

**Improve Deliverability**:
1. ✅ Verify your domain (most important)
2. ✅ Use professional "From" name
3. ✅ Warm up new domain (start with low volume)
4. ✅ Monitor bounce rate (keep <5%)
5. ✅ Don't use spam trigger words

**Spam Trigger Words to Avoid**:
- "Free", "Win", "Prize"
- "Act now", "Limited time"
- Excessive exclamation marks!!!

### Wrong "From" Address

**Check**:
1. `EMAIL_FROM` format: `Name <email@domain.com>`
2. No quotes around entire value
3. Email domain is verified (for production)
4. Redeploy after changing

**Valid Formats**:
```bash
# ✅ Correct
EMAIL_FROM="Kollect-It <noreply@yourdomain.com>"
EMAIL_FROM="Kollect-It Marketplace <orders@yourdomain.com>"

# ❌ Incorrect
EMAIL_FROM=noreply@yourdomain.com  # Missing name
EMAIL_FROM="<noreply@yourdomain.com>"  # Missing name
EMAIL_FROM="Kollect-It noreply@yourdomain.com"  # Missing brackets
```

### Test Email Not Received

**Check**:
1. Spam/junk folder
2. Promotions tab (Gmail)
3. `ADMIN_EMAIL` is correct
4. Resend API key has permission
5. Free tier limit not exceeded (100/day)

**Debug**:
```bash
# Check response
curl https://your-site.netlify.app/api/email/test

# Should return messageId if successful
{
  "success": true,
  "messageId": "abc-123..."
}
```

---

## 📈 Best Practices

### Email Content

- ✅ **Clear subject lines**: Include order number
- ✅ **Mobile-friendly**: Responsive design (already implemented)
- ✅ **Branded**: Use consistent styling and logo
- ✅ **Actionable**: Include relevant links (track order, contact support)
- ✅ **Personalized**: Use customer name

### Sending Practices

- ✅ **Send immediately**: Don't delay confirmation emails
- ✅ **Test thoroughly**: Use test endpoint before production
- ✅ **Monitor metrics**: Check bounce and complaint rates
- ✅ **Handle failures**: Log errors for investigation
- ✅ **Respect preferences**: Don't send marketing emails without consent

### Security

- ✅ **Never expose API key** in client code
- ✅ **Validate recipients** before sending
- ✅ **Sanitize content** to prevent injection
- ✅ **Use templates** to ensure consistent formatting
- ✅ **Rotate keys** if exposed

---

## 🔄 Email Templates Customization

Email templates are React components using `@react-email/components`.

**Location**: `src/components/emails/`

### Customize Order Confirmation

Edit: `src/components/emails/OrderConfirmation.tsx`

**Customizable**:
- Logo (replace ImageKit URL)
- Colors (update Tailwind classes)
- Font (change font family)
- Layout (modify sections)
- Content (add/remove sections)

**Preview Changes**:
```bash
# Run email dev server
bun run email:dev

# Visit http://localhost:3001
# See all email templates with live reload
```

**Test After Changes**:
```bash
# Send test email with new template
curl https://your-site.netlify.app/api/email/test
```

---

## 📚 Additional Resources

- **Resend Documentation**: https://resend.com/docs
- **React Email**: https://react.email/docs
- **Email Best Practices**: https://resend.com/docs/send-with-nodejs
- **Domain Verification**: https://resend.com/docs/dashboard/domains/introduction
- **Deliverability Guide**: https://resend.com/docs/knowledge-base/deliverability

---

**Last Updated**: October 24, 2025
**Version**: 1.0.0
**Email Service**: Resend API

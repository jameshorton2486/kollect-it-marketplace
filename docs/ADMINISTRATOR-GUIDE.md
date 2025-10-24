# 🏛️ Kollect-It Administrator Guide

**Version:** 64
**Last Updated:** January 22, 2025
**Status:** Production Ready

---

## 📚 Table of Contents

1. [Quick Start](#quick-start)
2. [Admin Access](#admin-access)
3. [Adding New Products](#adding-new-products)
4. [Managing Orders](#managing-orders)
5. [Managing Reviews](#managing-reviews)
6. [Updating Content](#updating-content)
7. [Database Management](#database-management)
8. [Deployment](#deployment)

---

## 🚀 Quick Start

### Prerequisites
- Bun installed (https://bun.sh)
- Git installed
- Text editor (VS Code recommended)

### Clone from GitHub
```bash
git clone https://github.com/jameshorton2486/kollect-it-marketplace.git
cd kollect-it-marketplace
```

### Install & Setup
```bash
# Install dependencies
bun install

# Set up database
bunx prisma generate
bunx prisma migrate dev
bunx prisma db seed

# Start development server
bun run dev
```

**Site will be live at:** http://localhost:3000

---

## 🔐 Admin Access

### Default Admin Credentials
- **Email:** `admin@kollect-it.com`
- **Password:** `admin123`

### Access Admin Dashboard
1. Go to http://localhost:3000/login
2. Enter admin credentials
3. You'll be redirected to the homepage
4. Navigate to http://localhost:3000/admin

### Admin Dashboard Features
- **Dashboard Home** - Revenue, order stats, recent activity
- **Orders Management** - View, update status, add tracking
- **Reviews Moderation** - Approve/reject customer reviews

---

## ➕ Adding New Products

### Method 1: Using the Seed File (Recommended for Bulk)

**Edit:** `prisma/seed.ts`

```typescript
// Add a new product after existing ones
await prisma.product.create({
  data: {
    title: 'Your Product Title Here',
    slug: 'your-product-slug',  // URL-friendly (no spaces, lowercase)
    description: 'Detailed description of your product...',
    price: 1250,  // Price in dollars

    // Optional details
    artist: 'Artist or Maker Name',
    year: '1890s',
    medium: 'Material type',
    dimensions: '24" × 36"',
    period: 'Victorian',
    provenance: 'Ownership history...',
    condition: 'Excellent',

    // Category (use one of: fineArt, rareBooks, militaria, collectibles)
    categoryId: fineArt.id,

    // Settings
    featured: true,  // Show on homepage
    status: 'active',  // 'active', 'draft', or 'sold'
    quantity: 1,

    // Images
    images: {
      create: [
        {
          url: 'https://images.unsplash.com/photo-xxx',
          alt: 'Image description',
          order: 0,  // First image
        },
        {
          url: 'https://images.unsplash.com/photo-yyy',
          alt: 'Second view',
          order: 1,  // Second image
        },
      ],
    },
  },
});
```

**Then run:**
```bash
bunx prisma db seed
```

### Method 2: Direct Database Access

**Open Prisma Studio:**
```bash
bunx prisma studio
```

This opens a GUI at http://localhost:5555 where you can:
- Add products visually
- Edit existing products
- Manage all database records

### Image Sources
- **Unsplash**: https://unsplash.com (free high-quality images)
- **Your own images**: Upload to a CDN or use relative paths
- **Product photos**: Take your own photos and upload

---

## 📦 Managing Orders

### View All Orders
1. Login as admin
2. Go to http://localhost:3000/admin/orders
3. See list of all orders with status

### Update Order Status
1. Click on any order
2. Change status:
   - **Pending** - Just received
   - **Processing** - Being prepared
   - **Shipped** - Sent to customer
   - **Delivered** - Received by customer
   - **Cancelled** - Order cancelled

### Add Tracking Information
1. Open order detail page
2. Select carrier (FedEx, UPS, USPS, DHL)
3. Enter tracking number
4. Click "Update Order"
5. Click "Send Shipping Notification" to email customer

### Order Email Notifications
- **Order Confirmation** - Sent automatically when order is placed
- **Shipping Update** - Sent manually from admin panel

---

## ⭐ Managing Reviews

### Access Reviews
- Go to http://localhost:3000/admin/reviews

### Moderate Reviews
**Pending Reviews** (require action):
- Click "Approve" to publish on product page
- Click "Reject" to delete

**Approved Reviews**:
- Click "Unapprove" to remove from product page

### Review Guidelines
Approve reviews that:
- ✓ Are genuine customer feedback
- ✓ Relate to the product
- ✓ Are respectful and appropriate

Reject reviews that:
- ✗ Contain profanity
- ✗ Are spam or advertising
- ✗ Are off-topic

---

## 📝 Updating Content

### Homepage
**Edit:** `src/app/page.tsx`

Change welcome text:
```typescript
<h2 className="text-5xl font-serif font-light mb-6">
  Your Custom Heading Here
</h2>
<p className="text-lg text-warm-stone-600">
  Your description here...
</p>
```

### About Us Page
**Edit:** `src/app/about/page.tsx`

Update company story, values, statistics.

### Contact Information
**Edit:** `src/app/contact/page.tsx`

Update:
- Email address
- Phone number
- Physical address
- Business hours

### Legal Pages
- **Privacy Policy:** `src/app/privacy/page.tsx`
- **Terms of Service:** `src/app/terms/page.tsx`
- **Shipping Policy:** `src/app/shipping/page.tsx`

### Footer
**Edit:** `src/components/Footer.tsx`

Update:
- Social media links
- Newsletter signup
- Footer text

---

## 🗄️ Database Management

### View Database
```bash
bunx prisma studio
```

### Backup Database
```bash
# Copy the database file
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db
```

### Reset Database
```bash
bunx prisma migrate reset
bunx prisma db seed
```

### Database Tables
- **Product** - All products
- **Category** - Product categories
- **Order** - Customer orders
- **OrderItem** - Items in each order
- **Review** - Product reviews
- **User** - Admin and customer accounts
- **Image** - Product images

---

## 🚀 Deployment

### Environment Variables

**Required for Production:**
```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="https://your-domain.com"

# Stripe (get from https://stripe.com)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."

# Resend Email (get from https://resend.com)
RESEND_API_KEY="re_..."
FROM_EMAIL="Your Store <noreply@yourdomain.com>"

# App
NEXT_PUBLIC_BASE_URL="https://your-domain.com"
```

### Deploy to Netlify

1. **Connect GitHub Repository**
   - Go to https://app.netlify.com
   - Click "New site from Git"
   - Choose GitHub
   - Select `kollect-it-marketplace`

2. **Build Settings**
   - Build command: `bun run build`
   - Publish directory: `.next`

3. **Environment Variables**
   - Add all variables from `.env` file
   - Use LIVE Stripe keys (not test)
   - Add real Resend API key

4. **Deploy**
   - Click "Deploy site"
   - Wait for build to complete

### Custom Domain
1. In Netlify, go to "Domain settings"
2. Click "Add custom domain"
3. Follow DNS instructions

---

## 📧 Email Setup

### Get Resend API Key
1. Go to https://resend.com
2. Sign up for free account
3. Verify your domain (or use test mode)
4. Get API key from dashboard
5. Add to `.env`:
   ```env
   RESEND_API_KEY="re_your_key_here"
   FROM_EMAIL="Kollect-It <noreply@yourdomain.com>"
   ```

### Email Templates
**Location:** `emails/` folder
- `OrderConfirmation.tsx` - Order confirmation email
- `ShippingUpdate.tsx` - Shipping notification email

**Customize emails:** Edit these files to change email design and content.

---

## 💳 Stripe Setup

### Get Stripe Keys
1. Go to https://stripe.com
2. Create account
3. Go to Developers → API Keys
4. Copy keys:
   - **Publishable key** (starts with `pk_`)
   - **Secret key** (starts with `sk_`)

### Test Mode vs Live Mode
- **Test Mode**: Use `pk_test_...` and `sk_test_...`
  - Use test card: `4242 4242 4242 4242`
  - No real money charged

- **Live Mode**: Use `pk_live_...` and `sk_live_...`
  - Real payments processed
  - Use for production only

### Update Keys
**Edit:** `.env`
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
```

---

## 🎨 Customizing Design

### Colors
**Edit:** `src/app/globals.css`

Change the color variables:
```css
:root {
  --color-sand-50: #faf9f7;
  --color-warm-amber-600: #c9842e;
  /* etc... */
}
```

### Fonts
**Edit:** `src/app/layout.tsx`

Change imported fonts from Google Fonts.

### Logo
Replace "KOLLECT•IT" text throughout the app:
- `src/components/Header.tsx`
- `src/components/Footer.tsx`
- `src/app/page.tsx`

Or add a logo image:
```tsx
<img src="/logo.png" alt="Your Logo" />
```

---

## 🔧 Common Tasks

### Change Admin Password
**Edit:** `prisma/seed.ts`

Find the admin user creation and change:
```typescript
password: await bcrypt.hash('YOUR_NEW_PASSWORD', 10),
```

Then run:
```bash
bunx prisma db seed
```

### Add New Category
**Edit:** `prisma/seed.ts`

Add a new category:
```typescript
const newCategory = await prisma.category.create({
  data: {
    name: 'Category Name',
    slug: 'category-slug',
    description: 'Description here',
    image: 'https://image-url.com/image.jpg',
    featured: true,
    order: 5,
  },
});
```

### Update Navigation
**Edit:** `src/components/Header.tsx`

Add/remove links in the navigation menu.

---

## 📊 Analytics & Monitoring

### View Dashboard Stats
- Total revenue
- Order count
- Product count
- Review count
- Recent orders
- Recent reviews

**Access:** http://localhost:3000/admin

### Database Statistics
```bash
# Count products
bunx prisma studio
# Navigate to Product table
```

---

## 🆘 Troubleshooting

### Server Won't Start
```bash
# Kill existing process
pkill -f "bun"

# Restart
bun run dev
```

### Database Errors
```bash
# Reset database
bunx prisma migrate reset
bunx prisma db seed
```

### Build Errors
```bash
# Clear cache
rm -rf .next node_modules
bun install
bun run build
```

### Can't Login
Check `prisma/seed.ts` for admin credentials.

---

## 📱 Mobile App (Future)

Currently, this is a web application. To create a mobile app:
- Use React Native
- Or create a PWA (Progressive Web App)
- Or wrap in Capacitor/Cordova

---

## 🔒 Security Best Practices

1. **Change default admin password**
2. **Use strong NEXTAUTH_SECRET**
3. **Enable HTTPS in production**
4. **Keep dependencies updated**: `bun update`
5. **Never commit `.env` file to Git**
6. **Use live Stripe keys only in production**
7. **Verify email domain with Resend**

---

## 📚 Additional Resources

### Documentation
- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs
- **Stripe:** https://stripe.com/docs
- **Resend:** https://resend.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs

### Support
- **GitHub Repository:** https://github.com/jameshorton2486/kollect-it-marketplace
- **Report Issues:** Create a GitHub issue

---

## ✅ Pre-Launch Checklist

Before going live:

- [ ] Change admin password
- [ ] Add real products (remove seed data)
- [ ] Update all contact information
- [ ] Add real email address (FROM_EMAIL)
- [ ] Get Resend API key and verify domain
- [ ] Get Stripe LIVE keys
- [ ] Update legal pages (Privacy, Terms)
- [ ] Test checkout process end-to-end
- [ ] Test email notifications
- [ ] Set up custom domain
- [ ] Enable HTTPS/SSL
- [ ] Create backup of database
- [ ] Test on mobile devices
- [ ] Review all content for accuracy

---

## 🎉 Congratulations!

You now have a fully functional e-commerce platform for selling authenticated antiques and collectibles!

**Need help?** Contact support or check the documentation above.

**Version:** 64
**Status:** Production Ready ✅

---

**Built with Same (https://same.new)**

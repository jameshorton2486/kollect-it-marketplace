# Order Management Guide

Complete guide to managing orders in the Kollect-It marketplace admin panel.

---

## 📋 Overview

The order management system allows you to:

- View all customer orders in one dashboard
- Filter and search orders
- View detailed order information
- Update order status
- Add tracking information
- Send automated email notifications

---

## 🎯 Accessing Order Management

### Admin Login

1. Navigate to `/admin/login`
2. Enter admin credentials:
   - Email: `admin@kollect-it.com`
   - Password: `admin123` (⚠️ **Change in production!**)

### Order Dashboard

Once logged in, access orders via:

- **Direct URL**: `/admin/orders`
- **Admin Dashboard**: Click "Manage Orders" from `/admin/dashboard`

---

## 📊 Order Dashboard Features

### Stats Overview

The dashboard displays real-time statistics:

- **Total Orders**: All orders in the system
- **Processing**: Orders currently being prepared
- **Shipped**: Orders sent to customers
- **Total Revenue**: Sum of all paid orders

### Filters & Search

**Search Bar**:

- Search by order number (e.g., `KI-1234567890-ABC123`)
- Search by customer name
- Search by customer email

**Status Filter**:

- All Statuses
- Pending
- Processing
- Shipped
- Delivered
- Cancelled

**Date Filter**:

- All Time
- Today
- Last 7 Days
- Last 30 Days

---

## 📦 Order Details

### Viewing Order Details

Click "View Details" on any order to see:

#### **Order Items**

- Product name (linked to product page)
- Unit price
- Quantity
- Line total
- Order subtotal, shipping, tax, and total

#### **Customer Information**

- Full name
- Email address (clickable to send email)
- Phone number (clickable to call)

#### **Shipping Address**

- Street address
- City, State, ZIP
- Country

#### **Payment Information**

- Payment status (Paid/Pending/Failed)
- Payment method (Stripe)
- Transaction amount

---

## ✏️ Updating Orders

### Status Management

**Available Statuses**:

1. **Pending**: Payment initiated but not confirmed
2. **Processing**: Payment confirmed, order being prepared
3. **Shipped**: Order sent to customer
4. **Delivered**: Order received by customer
5. **Cancelled**: Order cancelled

**To Update Status**:

1. Click "View Details" on order
2. Click "Edit" button in Status & Tracking section
3. Select new status from dropdown
4. Click "Save Changes"
5. Customer receives email notification automatically

### Adding Tracking Information

**Available Fields**:

- **Carrier**: Select from USPS, UPS, FedEx, DHL, or Other
- **Tracking Number**: Enter carrier's tracking number
- **Shipping Label URL**: Link to printable shipping label (optional)

**To Add Tracking**:

1. Click "Edit" in Status & Tracking section
2. Select carrier from dropdown
3. Enter tracking number
4. (Optional) Add shipping label URL
5. Click "Save Changes"

**Customer receives email with**:

- Updated status
- Tracking number
- Carrier name
- Link to track shipment

---

## 📧 Email Notifications

### Automatic Emails

Emails are sent automatically when:

1. **Order Created** (After successful payment):
   - **To Customer**: Order confirmation with order number, items, total
   - **To Admin**: New order alert with customer and order details

2. **Order Status Updated**:
   - **To Customer**: Status update with tracking info (if available)

### Email Templates

Located in `/src/emails/`:

- `OrderConfirmationEmail.tsx` - Customer order confirmation
- `AdminNewOrderEmail.tsx` - Admin new order notification
- `OrderStatusUpdateEmail.tsx` - Order status update
- `WelcomeEmail.tsx` - Newsletter welcome

### Email Configuration

**Required Environment Variables**:

```env
RESEND_API_KEY=re_your_key_here
EMAIL_FROM=Kollect-It <noreply@yourdomain.com>
ADMIN_EMAIL=admin@yourdomain.com
```

**To test email configuration**:

```bash
curl http://localhost:3000/api/email/test
```

See [EMAIL_SETUP.md](./EMAIL_SETUP.md) for complete email configuration guide.

---

## 🔄 Order Workflow

### Typical Order Lifecycle

```
Customer adds to cart
   ↓
Customer proceeds to checkout
   ↓
Customer enters shipping info
   ↓
Customer completes Stripe payment
   ↓
Order created (Status: PROCESSING)
   ↓
Admin receives email notification
   ↓
Admin prepares order
   ↓
Admin updates status to SHIPPED + adds tracking
   ↓
Customer receives shipping notification
   ↓
Package delivered
   ↓
Admin updates status to DELIVERED
   ↓
Customer receives delivery confirmation
```

### Recommended Status Updates

| When | Set Status To | Add Tracking? |
|------|---------------|---------------|
| Payment confirmed | Processing | No |
| Item(s) packaged | Shipped | **Yes** |
| Carrier confirms delivery | Delivered | No |
| Refund issued | Cancelled | No |

---

## 🚚 Shipping Best Practices

### Before Shipping

- [ ] Verify shipping address in order details
- [ ] Securely package items
- [ ] Print shipping label
- [ ] Weigh package for accurate shipping cost

### When Shipping

- [ ] Update order status to "Shipped"
- [ ] Select carrier (USPS, UPS, FedEx, etc.)
- [ ] Enter tracking number
- [ ] (Optional) Upload shipping label URL
- [ ] Save changes (customer gets auto-notified)

### Carriers

**USPS** (United States Postal Service):

- Track: https://tools.usps.com/go/TrackConfirmAction
- Domestic and international

**UPS** (United Parcel Service):

- Track: https://www.ups.com/track
- Faster shipping, signature options

**FedEx**:

- Track: https://www.fedex.com/fedextrack/
- Overnight and express options

**DHL**:

- Track: https://www.dhl.com/en/express/tracking.html
- International shipping

---

## 🔍 Order Search Tips

### Search by Order Number

Order numbers follow this format:

```
KI-1234567890-ABC123
```

You can search by:

- Full order number: `KI-1234567890-ABC123`
- Partial: `KI-1234`
- Short code: `ABC123`

### Search by Customer

- Search by full name: `John Smith`
- Search by first name only: `John`
- Search by email: `customer@example.com`
- Search by email domain: `@gmail.com`

### Advanced Filtering

Combine filters for precise results:

**Example 1**: All shipped orders from last week

- Status: Shipped
- Date: Last 7 Days

**Example 2**: Find specific customer's pending orders

- Search: customer@example.com
- Status: Pending

---

## 📈 Analytics & Reporting

### Available Metrics

**Real-time Stats**:

- Total orders count
- Orders by status
- Total revenue (paid orders only)

**Per-Order Data**:

- Order date and time
- Items count
- Order total
- Payment status
- Current order status

### Exporting Data

*Note: Export feature coming soon*

To manually export order data:

1. Use Prisma Studio: `bun run db:studio`
2. Navigate to "Order" table
3. Use database export tools

---

## 🛠️ Troubleshooting

### Order Not Appearing

**Possible causes**:

1. Payment not completed (check Stripe dashboard)
2. Database connection issue (check `/api/health`)
3. Order creation failed (check server logs)

**How to verify**:

```bash
# Check Stripe Dashboard
https://dashboard.stripe.com/test/payments

# Check health endpoint
curl http://localhost:3000/api/health

# Check database
bun run db:studio
```

### Email Not Sending

**Possible causes**:

1. Resend API key missing or invalid
2. Email FROM address not verified
3. Resend service down

**How to fix**:

```bash
# Test email configuration
curl http://localhost:3000/api/email/test

# Check environment variables
curl http://localhost:3000/api/health | jq '.environment'
```

See [EMAIL_SETUP.md](./EMAIL_SETUP.md) for email troubleshooting.

### Tracking Link Not Working

**Common issues**:

- Tracking number has typo
- Carrier not yet scanned package
- Package still in transit to carrier

**How to fix**:

1. Edit order
2. Correct tracking number
3. Save changes
4. Customer receives updated email

---

## 🔒 Security & Access Control

### Admin Authentication

- Only users with `role: "admin"` can access order management
- Session-based authentication via NextAuth.js
- Unauthorized access redirects to login

### Data Protection

- Order data never exposed to non-admin users
- Payment information (card details) never stored
- Only Stripe Payment Intent ID stored

### Recommended Practices

- [ ] Change default admin password immediately
- [ ] Use strong, unique password
- [ ] Enable 2FA (when available)
- [ ] Regularly review order access logs
- [ ] Never share admin credentials

---

## 🎯 Quick Actions Reference

### View All Orders

**URL**: `/admin/orders`

### View Order Details

**URL**: `/admin/orders/[order-id]`

### Update Order Status

1. Click order → "Edit"
2. Change status → "Save Changes"

### Add Tracking

1. Click order → "Edit"
2. Select carrier + enter tracking number → "Save"

### Search Order

Use search bar at `/admin/orders`

### Filter by Status

Use status dropdown at `/admin/orders`

---

## 📚 Related Documentation

- [Stripe Setup Guide](./STRIPE_SETUP.md) - Payment configuration
- [Email Setup Guide](./EMAIL_SETUP.md) - Email notification setup
- [Admin Guide](./ADMINISTRATOR-GUIDE.md) - Full admin features
- [Database Setup](./DATABASE_SETUP.md) - Database configuration
- [API Integration](./API_INTEGRATION_GUIDE.md) - API setup

---

## 🆘 Support

### Common Questions

**Q: How do I refund an order?**
A: Go to [Stripe Dashboard](https://dashboard.stripe.com/payments) → Find payment → Click "Refund"

**Q: Can customers track their orders?**
A: Yes, tracking info is included in status update emails. Coming soon: customer order tracking page.

**Q: How do I print shipping labels?**
A: Use your carrier's service (e.g., USPS Click-N-Ship, UPS.com). Add label URL to order.

**Q: What if payment succeeded but order wasn't created?**
A: Check webhook configuration. Order should be created automatically. See [STRIPE_SETUP.md](./STRIPE_SETUP.md).

---

## ✅ Order Management Checklist

### Daily Tasks

- [ ] Review new orders
- [ ] Update processing orders to shipped
- [ ] Add tracking numbers
- [ ] Respond to customer inquiries

### Weekly Tasks

- [ ] Review pending orders
- [ ] Check for payment issues
- [ ] Verify all shipped orders have tracking
- [ ] Review revenue metrics

### Monthly Tasks

- [ ] Export order data for accounting
- [ ] Review order trends
- [ ] Optimize shipping carriers
- [ ] Update order workflow if needed

---

**Status**: ✅ Fully Functional
**Last Updated**: October 24, 2025
**Version**: 112

Happy order managing! 📦🎉

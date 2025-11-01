# Kollect-It User Authentication Guide

## Overview

Kollect-It now has a complete user authentication and account management system! Customers can register, login, save items to their wishlist, and view their order history.

---

## Features Implemented

### ✅ **User Registration & Login**

- Secure customer registration with email and password
- Password hashing using bcrypt
- Auto-login after registration
- Session management with NextAuth

### ✅ **Account Dashboard**

- **Profile Tab**: View and manage account information
- **Orders Tab**: See complete order history with status tracking
- **Wishlist Tab**: Save favorite items for later

### ✅ **Wishlist System**

- Heart icon on product pages to save items
- Real-time wishlist updates
- Persistent across sessions
- Visual feedback when adding/removing items

### ✅ **User Account Dropdown**

- Quick access to account, orders, and wishlist
- Shows user name and role
- Sign out button
- Admin dashboard link (for admin users only)

### ✅ **Secure Routes**

- Protected account pages require authentication
- Automatic redirect to login for unauthenticated users
- API routes protected with session validation

---

## Pages & Routes

### **Public Pages**

- `/login` - Customer login page
- `/register` - Customer registration page

### **Protected Pages** (Requires Login)

- `/account` - Main account dashboard
- `/account?tab=profile` - Profile information
- `/account?tab=orders` - Order history
- `/account?tab=wishlist` - Saved items

### **API Routes**

- `POST /api/auth/register` - Create new customer account
- `GET /api/wishlist` - Fetch user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist` - Remove item from wishlist
- `GET /api/orders` - Fetch user's order history

---

## How to Use

### **For Customers:**

#### **1. Create an Account**

1. Visit http://localhost:3000/register
2. Enter your name, email, and password (min 6 characters)
3. Click "Create Account"
4. You'll be automatically logged in and redirected to your account

#### **2. Log In**

1. Visit http://localhost:3000/login
2. Enter your email and password
3. Click "Sign In"
4. You'll be redirected to your account dashboard

#### **3. Add Items to Wishlist**

1. Browse products on the homepage or category pages
2. Click on a product to view details
3. Click the **heart icon** on the product page
4. Item is saved to your wishlist!
5. Access wishlist from the account dropdown or `/account?tab=wishlist`

#### **4. View Account Dashboard**

1. Click your **account icon** in the top right header
2. Select "My Account" from the dropdown
3. Navigate between tabs:
   - **Profile**: See your account info
   - **Orders**: View past orders (will populate after checkout)
   - **Wishlist**: See all saved items

#### **5. Sign Out**

1. Click your **account icon** in the header
2. Click "Sign Out"

---

## Database Schema

### **User Model**

```prisma
model User {
  id            String         @id @default(cuid())
  name          String?
  email         String         @unique
  password      String         // Hashed with bcrypt
  role          String         @default("user")
  phone         String?
  address       String?
  city          String?
  state         String?
  zipCode       String?
  country       String?        @default("United States")
  wishlistItems WishlistItem[]
  orders        Order[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}
```

### **WishlistItem Model**

```prisma
model WishlistItem {
  id        String   @id @default(cuid())
  user      User     @relation(fields: [userId], references: [id])
  userId    String
  product   Product  @relation(fields: [productId], references: [id])
  productId String
  createdAt DateTime @default(now())

  @@unique([userId, productId])
}
```

### **Order Model**

```prisma
model Order {
  id              String      @id @default(cuid())
  orderNumber     String      @unique
  user            User        @relation(fields: [userId], references: [id])
  userId          String
  items           OrderItem[]
  status          String      @default("pending")
  subtotal        Float
  tax             Float
  shipping        Float
  total           Float
  shippingAddress String
  paymentMethod   String?
  paymentStatus   String      @default("pending")
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
}
```

---

## Testing Authentication

### **Test Account Creation:**

```bash
# 1. Open http://localhost:3000/register
# 2. Fill in the form:
Name: John Collector
Email: john@example.com
Password: password123
Confirm Password: password123

# 3. Click "Create Account"
# ✅ You should be logged in and see the account dashboard
```

### **Test Wishlist:**

```bash
# 1. Browse to homepage: http://localhost:3000
# 2. Click on any product
# 3. Click the heart icon (wishlist button)
# ✅ Heart should fill and show as added
# 4. Go to account dropdown → Wishlist
# ✅ Product should appear in your wishlist
```

### **Test Login/Logout:**

```bash
# 1. Sign out from account dropdown
# 2. Visit http://localhost:3000/login
# 3. Enter credentials and sign in
# ✅ Should redirect to /account
```

---

## Security Features

### **Password Security**

- Passwords hashed using bcrypt (10 rounds)
- Never stored in plain text
- Minimum 6 characters enforced

### **Session Management**

- Secure session tokens with NextAuth
- HTTP-only cookies
- Sessions expire after 30 days of inactivity

### **Protected Routes**

- All `/account/*` routes require authentication
- API routes validate session before returning data
- Automatic redirect to login for unauthenticated users

### **Authorization**

- Users can only access their own data
- Admin users have additional dashboard access
- Role-based permissions (user vs admin)

---

## Contexts Used

### **CartContext** (`src/contexts/CartContext.tsx`)

- Manages shopping cart state
- Persists to localStorage
- Available globally

### **WishlistContext** (`src/contexts/WishlistContext.tsx`)

- Manages wishlist state for authenticated users
- Fetches from database on login
- Syncs with backend

---

## Components

### **UserAccountDropdown** (`src/components/UserAccountDropdown.tsx`)

- Shows user menu in header
- Displays user name
- Links to account pages
- Sign out button

### **AddToCartButton** (`src/components/AddToCartButton.tsx`)

- Reusable add-to-cart button
- Multiple variants (primary, secondary, card)
- Visual feedback on add

---

## Admin vs Customer Accounts

### **Customer Accounts**

- Role: `user`
- Can register publicly
- Access to: account, orders, wishlist, cart
- Default for all registrations

### **Admin Accounts**

- Role: `admin`
- Cannot be created via public registration
- Must be created via database seed or manually
- Access to: everything + admin dashboard

**Current Admin Credentials:**

```
Email: admin@kollect-it.com
Password: admin123
```

⚠️ **Change these before production!**

---

## Future Enhancements

Ready to add:

- Password reset/forgot password flow
- Email verification
- Profile editing
- Address book
- Order tracking
- Email notifications
- Social login (Google, Facebook)
- Two-factor authentication

---

## Troubleshooting

### **"User already exists" error**

- This email is already registered
- Try logging in instead or use a different email

### **Can't see wishlist items**

- Make sure you're logged in
- Wishlist is user-specific
- Try refreshing the page

### **Redirected to login when accessing /account**

- You need to be logged in
- Create an account or sign in first

### **Wishlist heart not working**

- You must be logged in to use wishlist
- Check browser console for errors

---

## Code Examples

### **Check if user is authenticated (client component)**

```tsx
'use client';
import { useSession } from 'next-auth/react';

export default function MyComponent() {
  const { data: session, status } = useSession();

  if (status === 'loading') return <div>Loading...</div>;
  if (!session) return <div>Please log in</div>;

  return <div>Welcome, {session.user.name}!</div>;
}
```

### **Protect an API route**

```tsx
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ... your protected code
}
```

### **Use wishlist context**

```tsx
'use client';
import { useWishlist } from '@/contexts/WishlistContext';

export default function ProductCard({ product }) {
  const { isInWishlist, toggleWishlist } = useWishlist();

  return (
    <button onClick={() => toggleWishlist(product.id)}>
      {isInWishlist(product.id) ? '❤️ In Wishlist' : '🤍 Add to Wishlist'}
    </button>
  );
}
```

---

## Summary

✅ Full authentication system with registration and login
✅ Secure password hashing and session management
✅ Comprehensive account dashboard (profile, orders, wishlist)
✅ Wishlist functionality with heart icons
✅ Protected routes and API endpoints
✅ User account dropdown in header
✅ Beautiful, responsive UI with gold accents

**The authentication system is production-ready!** Just update the admin credentials and add any additional features you need (like password reset).

Happy collecting! 🎨📚⚔️

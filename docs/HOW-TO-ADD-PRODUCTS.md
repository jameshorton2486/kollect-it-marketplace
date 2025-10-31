# 🎨 How to Add New Products - Quick Guide

## Method 1: Using Prisma Studio (Visual Interface) - EASIEST

### Step 1: Open Prisma Studio

```bash
cd kollect-it-marketplace
bunx prisma studio
```

This opens a database GUI at **http://localhost:5555**

### Step 2: Click on "Product" Table

You'll see all existing products.

### Step 3: Click "Add Record"

### Step 4: Fill in the Fields

**Required Fields:**

- **title:** "Victorian Oak Writing Desk, 1890"
- **slug:** "victorian-oak-writing-desk-1890" (URL-friendly, no spaces)
- **description:** "Beautiful Victorian-era writing desk..."
- **price:** 2500 (just the number, no $ sign)
- **categoryId:** Click dropdown and select a category
- **status:** "active"
- **quantity:** 1

**Optional Fields:**

- **artist:** "Unknown"
- **year:** "1890s"
- **medium:** "Oak wood"
- **dimensions:** "48" W × 24" D × 30" H"
- **period:** "Victorian"
- **provenance:** "Estate collection, Boston"
- **condition:** "Excellent"
- **featured:** true (to show on homepage)

### Step 5: Save

Click "Save 1 change"

### Step 6: Add Images

1. Click on "Image" table
2. Click "Add Record"
3. Fill in:
   - **url:** "https://images.unsplash.com/photo-xxx" (image URL)
   - **alt:** "Victorian writing desk front view"
   - **order:** 0 (for first image, 1 for second, etc.)
   - **productId:** Select the product you just created
4. Click "Save"

**Repeat for each image**

### Step 7: View Your Product

Go to: http://localhost:3000

---

## Method 2: Edit the Seed File (For Multiple Products)

### Step 1: Open seed.ts

Open file: `prisma/seed.ts`

### Step 2: Add Your Product

Scroll to the bottom, before the closing brackets, and add:

```typescript
// Your New Product
await prisma.product.create({
  data: {
    title: 'Victorian Oak Writing Desk, 1890',
    slug: 'victorian-oak-writing-desk-1890',
    description: 'Beautiful Victorian-era writing desk made from solid oak. Features multiple drawers, original brass hardware, and intricate carved details. Perfect for a home office or study.',
    price: 2500,

    artist: 'Unknown',
    year: '1890s',
    medium: 'Oak wood',
    dimensions: '48" W × 24" D × 30" H',
    period: 'Victorian',
    provenance: 'Estate collection, Boston',
    condition: 'Excellent - minor wear consistent with age',

    categoryId: fineArt.id,  // Change to: rareBooks.id, militaria.id, or collectibles.id
    featured: true,
    quantity: 1,

    images: {
      create: [
        {
          url: 'https://images.unsplash.com/photo-xxx',
          alt: 'Victorian writing desk front view',
          order: 0,
        },
        {
          url: 'https://images.unsplash.com/photo-yyy',
          alt: 'Victorian writing desk detail',
          order: 1,
        },
      ],
    },
  },
});
```

### Step 3: Run the Seed

```bash
bunx prisma db seed
```

Your new product is now live!

---

## Finding Images

### Option 1: Unsplash (Free)

1. Go to https://unsplash.com
2. Search for your item (e.g., "antique desk")
3. Click on an image you like
4. Right-click the image → Copy Image Address
5. Use that URL in your product

**Example URLs:**

- https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=1200
- https://images.unsplash.com/photo-1554995207-c18c203602cb?w=1200

### Option 2: Your Own Photos

1. Take photos of your products
2. Upload to a service like:
   - Cloudinary (https://cloudinary.com)
   - Imgur (https://imgur.com)
   - AWS S3
3. Use those URLs

---

## Product Slug Rules

The slug is the URL-friendly version of your title.

**Good Slugs:**

- "victorian-oak-writing-desk-1890"
- "first-edition-great-gatsby"
- "wwii-us-army-flight-jacket"

**Bad Slugs:**

- "Victorian Oak Writing Desk, 1890" (has spaces and capital letters)
- "desk#1" (has special characters)

**How to Create:**

1. Take the title
2. Make it lowercase
3. Replace spaces with hyphens (-)
4. Remove special characters

---

## Categories

You have 4 categories to choose from:

1. **Fine Art** (`fineArt.id`)
   - Paintings, sculptures, artwork

2. **Rare Books** (`rareBooks.id`)
   - First editions, antiquarian books

3. **Militaria** (`militaria.id`)
   - Military artifacts, medals, uniforms

4. **Collectibles** (`collectibles.id`)
   - Watches, jewelry, vintage items, memorabilia

---

## Product Status

- **active** - Shows on website (use this!)
- **draft** - Hidden from customers (use while editing)
- **sold** - Marked as sold

---

## Quick Example

Here's a complete example you can copy and modify:

```typescript
await prisma.product.create({
  data: {
    title: 'Antique Mahogany Chess Set, 1920s',
    slug: 'antique-mahogany-chess-set-1920s',
    description: 'Exquisite hand-carved mahogany chess set from the 1920s. Features intricately detailed pieces with felt-lined bases. Includes original wooden storage box with brass hinges. A magnificent example of early 20th-century craftsmanship.',
    price: 850,

    year: '1920s',
    medium: 'Mahogany wood, felt',
    dimensions: 'King: 4" tall, Board: 18" × 18"',
    period: 'Art Deco',
    condition: 'Excellent - all pieces present',

    categoryId: collectibles.id,
    featured: true,
    quantity: 1,

    images: {
      create: [
        {
          url: 'https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=1200',
          alt: 'Mahogany chess set complete view',
          order: 0,
        },
      ],
    },
  },
});
```

---

## After Adding Products

### View Your Products

- **Homepage:** http://localhost:3000
- **Category Pages:** http://localhost:3000/category/collectibles
- **Search:** http://localhost:3000/search

### Edit a Product

1. Open Prisma Studio: `bunx prisma studio`
2. Click on "Product"
3. Find your product
4. Click to edit
5. Make changes
6. Click "Save"

### Delete a Product

1. Open Prisma Studio
2. Click on "Product"
3. Find product to delete
4. Click delete icon (trash can)
5. Confirm

---

## Tips

✅ **DO:**

- Use high-quality images (at least 1200px wide)
- Write detailed descriptions
- Include all measurements
- Be honest about condition
- Use clear, descriptive titles

❌ **DON'T:**

- Use copyrighted images without permission
- Exaggerate condition
- Use tiny images
- Forget to set the correct category

---

## Need Help?

**Can't find the field you need?**

- Check `prisma/schema.prisma` to see all available fields

**Images not showing?**

- Make sure URL starts with `https://`
- Test URL in browser first

**Product not appearing?**

- Check `status` is set to "active"
- Check `quantity` is greater than 0
- Refresh the page

---

## Done! 🎉

Your new products are now live on the website!

**Test the checkout:**

1. Add product to cart
2. Go to checkout
3. Use test card: 4242 4242 4242 4242
4. Complete purchase

Everything working? Great! You're ready to add more products! 🚀

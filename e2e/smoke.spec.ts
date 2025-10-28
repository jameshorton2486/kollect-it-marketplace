import { test, expect } from '@playwright/test';

// Minimal smoke covering critical navigation
// It adapts if no products exist by skipping the product step unless SMOKE_PRODUCT_SLUG is provided.

test('home renders key sections', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/Kollect-It/i);
  await expect(page.getByRole('heading', { name: /Latest Arrivals/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: /Shop by Category|Shop by Categories/i })).toBeVisible();
});

test('cart shows empty state when no items', async ({ page }) => {
  await page.goto('/cart');
  await expect(page.getByRole('heading', { name: /Your Cart is Empty/i })).toBeVisible();
});

test('optional: product page exists when SMOKE_PRODUCT_SLUG provided', async ({ page }, testInfo) => {
  const slug = process.env.SMOKE_PRODUCT_SLUG;
  test.skip(!slug, 'No SMOKE_PRODUCT_SLUG provided; skipping product page smoke.');

  await page.goto(`/product/${slug}`);
  // Basic assertions that should hold for any product page
  await expect(page.getByRole('link', { name: /Home/i })).toBeVisible();
  await expect(page.getByText(/Add to Cart|Out of Stock/i)).toBeVisible();
});

import { test } from '@playwright/test';

// @visual: lightweight visual captures used for manual review in PRs
// Run with: npx playwright test --project=chromium --grep @visual

test.describe('@visual homepage', () => {
  test('capture home hero and sections', async ({ page }, testInfo) => {
    await page.goto('/');
    const shot = await page.screenshot({ fullPage: true });
    await testInfo.attach('home.png', { body: shot, contentType: 'image/png' });
  });
});

test.describe('@visual product detail', () => {
  test('capture product page if slug provided', async ({ page }, testInfo) => {
    const slug = process.env.SMOKE_PRODUCT_SLUG;
    test.skip(!slug, 'No SMOKE_PRODUCT_SLUG provided; skipping.');
    await page.goto(`/product/${slug}`);
    const shot = await page.screenshot({ fullPage: true });
    await testInfo.attach('product.png', { body: shot, contentType: 'image/png' });
  });
});

test.describe('@visual category', () => {
  test('capture category grid if slug provided', async ({ page }, testInfo) => {
    const slug = process.env.SMOKE_CATEGORY_SLUG;
    test.skip(!slug, 'No SMOKE_CATEGORY_SLUG provided; skipping.');
    await page.goto(`/category/${slug}`);
    const shot = await page.screenshot({ fullPage: true });
    await testInfo.attach('category.png', { body: shot, contentType: 'image/png' });
  });
});

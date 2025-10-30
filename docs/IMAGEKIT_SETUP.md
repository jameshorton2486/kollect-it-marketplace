# ImageKit Setup Guide for Kollect-It

This guide walks you through configuring ImageKit for the admin image uploader and site-wide image delivery.

## 1) Create an ImageKit account

- Sign up at https://imagekit.io/
- In the Dashboard, note your:
  - URL Endpoint (e.g., https://ik.imagekit.io/your_id)
  - Public Key
  - Private Key

## 2) Add environment variables

Create or update your `.env` using the example keys shown in `.env.example`:

```env
NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT="https://ik.imagekit.io/your_id"
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY="your_public_key"
IMAGEKIT_PRIVATE_KEY="your_private_key"
```

Restart your dev server after updating environment variables.

## 3) How uploads work (signed browser upload)

This project uses a signed upload flow for security:

- Client requests auth params from the server route: `GET /api/imagekit-auth`
- Server generates a short-lived `token`, `expire`, and `signature` using your private key
- Client posts the file to `https://upload.imagekit.io/api/v1/files/upload` with the auth params

These are already wired up in the repo:
- API route: `src/app/api/imagekit-auth/route.ts`
- Uploader component: `src/components/admin/ImageUpload.tsx`

## 4) Transformations

When using ImageKit URLs, this project builds transformation strings like `tr:w-600,h-600,fo-auto,q-85` to optimize images per use case (cards, thumbnails, details). Existing calls to `transformCloudinary` are backward-compatible and will apply ImageKit transforms when given ImageKit URLs.

Common presets in code:
- `thumbnail`: `w-400,h-400,fo-auto,q-80`
- `productCard`: `w-600,h-600,fo-auto,q-85`
- `productDetail`: `w-1200,h-1200,fo-auto,q-90`

## 5) Verify your setup

- Visit the Admin dashboard and upload a few images
- Check the browser console for any failures
- Confirm uploaded URLs resolve under your `ik.imagekit.io` endpoint

## 6) Troubleshooting

- Missing envs: ensure all three ImageKit variables are set and the dev server restarted
- 401 from upload API: check that the signature, token, and expire are sent and valid within 10 minutes
- CORS: ImageKit’s upload endpoint supports browser uploads; if you see CORS warnings, verify you are posting to `https://upload.imagekit.io/api/v1/files/upload`

## 7) Production notes

- `next.config.js` is restricted to `ik.imagekit.io` (and a small allow-list) for safer image domains
- Keep private keys server-side only (never expose them in client code)

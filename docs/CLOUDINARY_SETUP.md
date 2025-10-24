# Cloudinary Setup Guide for Kollect-It

This guide will walk you through setting up Cloudinary for the multi-image upload feature in your Kollect-It admin panel.

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/](https://cloudinary.com/)
2. Click "Sign Up for Free"
3. Complete the registration process
4. Verify your email address

## Step 2: Get Your Cloudinary Credentials

1. Log in to your Cloudinary account
2. Go to the Dashboard (https://console.cloudinary.com/)
3. You'll see your credentials in the "Account Details" section:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

## Step 3: Create an Upload Preset

Upload presets allow unsigned uploads from the browser, which is more secure and doesn't expose your API secret.

1. In your Cloudinary console, go to **Settings** (gear icon in top right)
2. Click on the **Upload** tab
3. Scroll down to **Upload presets**
4. Click **Add upload preset**
5. Configure the preset:
   - **Preset name**: `kollect-it-uploads` (or any name you prefer)
   - **Signing mode**: Select **Unsigned**
   - **Folder**: Enter `kollect-it/products` (optional, helps organize images)
   - **Transformation**:
     - Width: `1600`
     - Crop mode: `Limit`
     - Quality: `Auto`
     - Format: `Auto`
6. Click **Save**

## Step 4: Update Your Environment Variables

1. Open your `.env` file in the `kollect-it-dynamic` directory
2. Replace the placeholder values with your actual Cloudinary credentials:

```env
# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-actual-cloud-name"
CLOUDINARY_API_KEY="your-actual-api-key"
CLOUDINARY_API_SECRET="your-actual-api-secret"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET="kollect-it-uploads"
```

**Important Notes:**
- Replace `your-actual-cloud-name`, `your-actual-api-key`, and `your-actual-api-secret` with your real credentials
- If you used a different upload preset name, update `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` accordingly
- **Never commit your `.env` file to version control!** (It's already in `.gitignore`)

## Step 5: Restart Your Development Server

After updating the `.env` file, restart your development server:

```bash
cd kollect-it-dynamic
bun run dev
```

## Step 6: Test the Image Upload

1. Navigate to the admin dashboard: `http://localhost:3000/admin/dashboard`
2. Click "Add New Product"
3. Try uploading images using:
   - Drag and drop
   - Browse button
4. Verify that:
   - Images are uploaded to Cloudinary
   - Thumbnails appear in the preview grid
   - You can reorder images by dragging
   - You can delete images
   - The "Main" badge appears on the first image

## Features Included

✅ **Drag and Drop** - Drag files directly onto the upload area
✅ **Browse Button** - Traditional file picker
✅ **Auto-Resize** - Images automatically resized to max 1600px width
✅ **Image Optimization** - Cloudinary optimizes format and quality
✅ **Reordering** - Drag images to reorder them
✅ **Delete** - Remove unwanted images
✅ **Progress Indicator** - Visual feedback during upload
✅ **Validation** - Max image limits and file type checking

## Cloudinary Free Tier Limits

The free tier includes:
- 25 GB storage
- 25 GB monthly bandwidth
- 25,000 transformations per month

This is more than enough for a small to medium-sized collectibles store. Monitor your usage in the Cloudinary dashboard.

## Troubleshooting

### Images not uploading?

1. **Check your credentials** - Verify all environment variables are correct
2. **Check upload preset** - Ensure the preset exists and is set to "Unsigned"
3. **Check browser console** - Look for error messages
4. **Check Cloudinary dashboard** - View upload logs in the Media Library

### CORS errors?

If you see CORS errors in the browser console:

1. Go to Cloudinary Settings → Security
2. Under "Allowed fetch domains", add your domain (e.g., `localhost:3000`)
3. Save and try again

### Upload preset not found?

Make sure the preset name in your `.env` file exactly matches the name you created in Cloudinary (case-sensitive).

## Security Best Practices

1. ✅ **Use unsigned upload presets** - Already implemented
2. ✅ **Never expose API secret in client code** - Already handled
3. ✅ **Set upload restrictions** - Configure max file size in Cloudinary
4. ⚠️ **Enable moderation** - Consider enabling AI moderation for uploaded content
5. ⚠️ **Set up webhooks** - Get notified of uploads for monitoring

## Next Steps

- Configure additional transformations in Cloudinary (watermarks, filters, etc.)
- Set up automatic backups of your Media Library
- Enable AI-powered tagging and categorization
- Configure webhooks for upload notifications

## Support

For Cloudinary-specific issues, visit:
- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Cloudinary Support](https://support.cloudinary.com/)

For Kollect-It issues, check the main README.md file.

import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

// Helper function to generate optimized image URL
export function getOptimizedImageUrl(publicId: string, width = 1600) {
  return cloudinary.url(publicId, {
    transformation: [
      { width, crop: 'limit', quality: 'auto', fetch_format: 'auto' },
    ],
  });
}

// Helper function to delete image from Cloudinary
export async function deleteCloudinaryImage(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
    throw error;
  }
}

import { NextResponse } from 'next/server';
import { getImageKitAuthParams } from '@/lib/imagekit';

/**
 * ImageKit Authentication Endpoint
 * Returns authentication parameters for client-side uploads
 *
 * Used by ImageKit uploader on admin pages
 */
export async function GET() {
  try {
    const authParams = await getImageKitAuthParams();
    return NextResponse.json(authParams);
  } catch (error) {
    console.error('ImageKit auth error:', error);
    return NextResponse.json(
      { error: 'Failed to generate authentication parameters' },
      { status: 500 }
    );
  }
}

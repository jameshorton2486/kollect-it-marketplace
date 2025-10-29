import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-helpers';
import { Prisma } from '@prisma/client';

// GET /api/products - Get all products
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
  const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const featured = searchParams.get('featured');
  const q = searchParams.get('q');

    const where: Prisma.ProductWhereInput = {
      status: 'active',
    };

    if (category) {
      where.category = { slug: category };
    }

    if (featured === 'true') {
      where.featured = true;
    }

    if (q) {
      where.title = { contains: q, mode: 'insensitive' };
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        images: {
          orderBy: { order: 'asc' },
        },
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit ? parseInt(limit) : undefined,
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

interface ImageInput {
  url: string;
  alt?: string;
}

// POST /api/products - Create new product (admin only)
export async function POST(request: NextRequest) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const body = await request.json();
    const {
      title,
      description,
      price,
      categoryId,
      condition,
      year,
      artist,
      medium,
      period,
      featured,
      images,
    } = body;

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        price: parseFloat(price),
        categoryId,
        condition,
        year,
        artist,
        medium,
        period,
        featured: featured || false,
        images: {
          create: (images as ImageInput[] | undefined)?.map((img, index) => ({
            url: img.url,
            alt: img.alt || title,
            order: index,
          })) || [],
        },
      },
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

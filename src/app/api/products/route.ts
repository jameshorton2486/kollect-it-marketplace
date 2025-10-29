import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { checkAdminAuth } from '@/lib/auth-helpers';
import { Prisma } from '@prisma/client';
import { logger } from '@/lib/logger';
import { getRequestId } from '@/lib/request-context';
import { respondError } from '@/lib/api-error';

// GET /api/products - Get all products
// Lightweight in-memory rate limiter (per-instance). For multi-instance, use Redis.
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 60; // 60 req/min per ip
const ipHits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(ip: string) {
  const now = Date.now();
  const rec = ipHits.get(ip);
  if (!rec || rec.resetAt < now) {
    ipHits.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false, remaining: RATE_LIMIT_MAX - 1, reset: RATE_LIMIT_WINDOW_MS };
  }
  if (rec.count >= RATE_LIMIT_MAX) {
    return { limited: true, remaining: 0, reset: rec.resetAt - now };
  }
  rec.count += 1;
  return { limited: false, remaining: RATE_LIMIT_MAX - rec.count, reset: rec.resetAt - now };
}

export async function GET(request: NextRequest) {
  try {
    // Rate limit by IP (best-effort). Use proxy headers in route handlers.
    const xfwd = request.headers.get('x-forwarded-for') || '';
    const realIp = request.headers.get('x-real-ip') || '';
    const ip = (xfwd.split(',')[0]?.trim() || realIp || 'anonymous');
    const rl = isRateLimited(ip);
    if (rl.limited) {
      return new NextResponse(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'X-RateLimit-Limit': String(RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': String(rl.remaining),
          'Retry-After': Math.ceil(rl.reset / 1000).toString(),
        },
      });
    }

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category') ?? undefined;
    const limitStr = searchParams.get('limit');
    const featured = searchParams.get('featured');
    const q = searchParams.get('q') ?? undefined;

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

    const take = limitStr ? parseInt(limitStr, 10) : undefined;

    const products = await prisma.product.findMany({
      where,
      include: {
        images: { orderBy: { order: 'asc' } },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
      take,
    });

    const res = NextResponse.json(products);
    res.headers.set('X-Request-ID', getRequestId(request));
    // Cache for 60s at the edge/CDN and allow stale while revalidate
    res.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=300');
    res.headers.set('X-RateLimit-Limit', String(RATE_LIMIT_MAX));
    res.headers.set('X-RateLimit-Remaining', String(rl.remaining));
    return res;
  } catch (error) {
    logger.error('Error fetching products', { requestId: getRequestId(request) }, error);
    return respondError(request, error, { status: 500, code: 'products_fetch_failed' });
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

    const res = NextResponse.json(product, { status: 201 });
    res.headers.set('X-Request-ID', getRequestId(request));
    return res;
  } catch (error) {
    logger.error('Error creating product', { requestId: getRequestId(request) }, error);
    return respondError(request, error, { status: 500, code: 'products_create_failed' });
  }
}

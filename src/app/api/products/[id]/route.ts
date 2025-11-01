import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { checkAdminAuth } from "@/lib/auth-helpers";

interface ImageInput {
  url: string;
  alt?: string;
}

// GET /api/products/[id] - Get single product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        images: {
          orderBy: { order: "asc" },
        },
        category: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 },
    );
  }
}

// PUT /api/products/[id] - Update product (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const { id } = await params;
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
      status,
      images,
    } = body;

    // Delete existing images if new ones are provided
    if (images) {
      await prisma.image.deleteMany({
        where: { productId: id },
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        title,
        description,
        price: price ? parseFloat(price) : undefined,
        categoryId,
        condition,
        year,
        artist,
        medium,
        period,
        featured,
        status,
        images: images
          ? {
              create: (images as ImageInput[]).map((img, index) => ({
                url: img.url,
                alt: img.alt || title,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        images: true,
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

// DELETE /api/products/[id] - Delete product (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const authCheck = await checkAdminAuth();
  if (!authCheck.authorized) {
    return authCheck.response;
  }

  try {
    const { id } = await params;

    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}

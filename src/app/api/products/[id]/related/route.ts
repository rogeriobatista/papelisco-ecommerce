import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../../lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // First get the current product to know its category
    const currentProduct = await prisma.product.findUnique({
      where: { id },
      select: {
        categoryId: true,
        category: {
          select: {
            name: true,
          },
        },
      },
    });

    if (!currentProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Get related products - first try same category, then fill with others
    const sameCategoryProducts = await prisma.product.findMany({
      where: {
        categoryId: currentProduct.categoryId,
        id: { not: id },
        status: 'ACTIVE',
      },
      include: {
        category: true,
        images: {
          orderBy: {
            isPrimary: 'desc',
          },
          take: 1,
        },
      },
      take: 4,
      orderBy: {
        createdAt: 'desc',
      },
    });

    let relatedProducts = [...sameCategoryProducts];

    // If we don't have enough products from the same category, fill with others
    if (relatedProducts.length < 4) {
      const otherProducts = await prisma.product.findMany({
        where: {
          categoryId: { not: currentProduct.categoryId },
          id: { not: id },
          status: 'ACTIVE',
        },
        include: {
          category: true,
          images: {
            orderBy: {
              isPrimary: 'desc',
            },
            take: 1,
          },
        },
        take: 4 - relatedProducts.length,
        orderBy: {
          createdAt: 'desc',
        },
      });

      relatedProducts = [...relatedProducts, ...otherProducts];
    }

    // Transform products to match frontend expectations
    const transformedProducts = relatedProducts.map((product: any) => ({
      id: product.id,
      name: product.name,
      category: product.category.name,
      price: Number(product.price),
      image: product.images.find((img: any) => img.isPrimary)?.imageUrl || 
             product.images[0]?.imageUrl || 
             '/images/placeholder.png',
      description: product.description,
      stock: product.stockQuantity,
      sku: product.sku,
    }));

    return NextResponse.json({
      success: true,
      relatedProducts: transformedProducts,
      currentCategory: currentProduct.category.name,
    });
  } catch (error) {
    console.error('Related products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related products' },
      { status: 500 }
    );
  }
}
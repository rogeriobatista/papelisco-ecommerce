import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Transform product to match frontend expectations
    const transformedProduct = {
      id: product.id,
      name: product.name,
      category: product.category.name,
      price: Number(product.price),
      image: product.images.find(img => img.isPrimary)?.imageUrl || 
             product.images[0]?.imageUrl || 
             '/images/placeholder.png',
      description: product.description,
      stock: product.stockQuantity,
      sku: product.sku,
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error('Product API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
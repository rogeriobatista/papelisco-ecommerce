import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { ProductStatus } from '@prisma/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = searchParams.get('limit');
    const offset = searchParams.get('offset');

    const whereClause = {
      status: ProductStatus.ACTIVE,
      ...(category && { 
        category: { 
          name: { 
            contains: category, 
            mode: 'insensitive' as const 
          } 
        } 
      }),
    };

    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      ...(limit && { take: parseInt(limit) }),
      ...(offset && { skip: parseInt(offset) }),
    });

    // Transform products to match frontend expectations
    const transformedProducts = products.map((product: any) => ({
      id: product.id,
      name: product.name,
      category: product.category?.name || 'Unknown',
      price: Number(product.price),
      image: product.images?.[0]?.imageUrl || '/images/placeholder.png',
      description: product.description,
    }));

    return NextResponse.json({
      success: true,
      products: transformedProducts,
      total: transformedProducts.length,
    });
  } catch (error) {
    console.error('Products API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';
import { z } from 'zod';

// Validation schema for order creation
const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })),
  shippingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
    phone: z.string().optional(),
  }),
  billingAddress: z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    country: z.string().min(1),
  }),
  paymentMethod: z.string().min(1),
  cardDetails: z.object({
    cardNumber: z.string(),
    expiryDate: z.string(),
    cvv: z.string(),
    cardName: z.string(),
  }),
  notes: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);

    // Generate order number
    const timestamp = Date.now();
    const orderNumber = `ORD-${timestamp}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    // Calculate totals
    let subtotal = 0;
    const orderItemsData = [];

    // Verify products exist and calculate totals
    for (const item of validatedData.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      orderItemsData.push({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        total: itemTotal,
      });
    }

    // Calculate tax and total (10% tax rate)
    const taxAmount = subtotal * 0.1;
    const shippingAmount = 0; // Free shipping
    const discountAmount = 0; // No discount for now
    const totalAmount = subtotal + taxAmount + shippingAmount - discountAmount;

    // Create order in database transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          userId: payload.userId,
          orderNumber,
          status: 'PENDING',
          subtotal,
          taxAmount,
          shippingAmount,
          discountAmount,
          totalAmount,
          currency: 'USD',
          paymentStatus: 'PAID', // Simulate successful payment
          paymentMethod: validatedData.paymentMethod,
          shippingAddress: validatedData.shippingAddress,
          billingAddress: validatedData.billingAddress,
          notes: validatedData.notes || null,
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: orderItemsData.map(item => ({
          orderId: newOrder.id,
          ...item,
        })),
      });

      // Return order with items
      return await tx.order.findUnique({
        where: { id: newOrder.id },
        include: {
          orderItems: {
            include: {
              product: {
                include: {
                  images: {
                    where: { isPrimary: true },
                    take: 1,
                  },
                },
              },
            },
          },
        },
      });
    });

    return NextResponse.json({
      success: true,
      order,
      message: 'Order placed successfully',
    }, { status: 201 });

  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid order data', 
          details: error.errors 
        },
        { status: 400 }
      );
    }

    console.error('Order creation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Verify token
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    // Get URL search params for pagination and filtering
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    // Build where clause
    const where: any = {
      userId: payload.userId,
    };

    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    // Get total count for pagination
    const total = await prisma.order.count({ where });

    // Get orders with related data
    const orders = await prisma.order.findMany({
      where,
      include: {
        orderItems: {
          include: {
            product: {
              include: {
                images: {
                  where: { isPrimary: true },
                  take: 1,
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNext = page < totalPages;
    const hasPrev = page > 1;

    return NextResponse.json({
      orders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext,
        hasPrev,
      },
    });

  } catch (error) {
    console.error('Orders fetch error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
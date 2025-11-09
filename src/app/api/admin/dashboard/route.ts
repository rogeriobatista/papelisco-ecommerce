import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Check if user has admin role
    if (payload.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    // Get dashboard data in parallel for better performance
    const [
      totalSalesResult,
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders,
      salesData,
      topProducts
    ] = await Promise.all([
      // Total sales
      prisma.order.aggregate({
        _sum: {
          totalAmount: true,
        },
        where: {
          status: 'DELIVERED',
        },
      }),

      // Total orders count
      prisma.order.count(),

      // Total customers count
      prisma.user.count({
        where: {
          role: 'CUSTOMER',
        },
      }),

      // Total products count
      prisma.product.count(),

      // Recent orders (last 10)
      prisma.order.findMany({
        take: 10,
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: {
            select: {
              firstName: true,
              lastName: true,
            },
          },
        },
      }),

      // Sales data for the last 7 days
      getSalesDataLast7Days(),

      // Top products by revenue
      getTopProducts()
    ]);

    const totalSales = totalSalesResult._sum.totalAmount || 0;

    // Format recent orders
    const formattedRecentOrders = recentOrders.map((order: any) => ({
      id: order.id,
      orderNumber: order.orderNumber,
      customer: `${order.user.firstName} ${order.user.lastName}`,
      total: Number(order.totalAmount),
      status: order.status,
      date: order.createdAt.toISOString(),
    }));

    const dashboardData = {
      totalSales: Number(totalSales),
      totalOrders,
      totalCustomers,
      totalProducts,
      recentOrders: formattedRecentOrders,
      salesData,
      topProducts,
    };

    return NextResponse.json(dashboardData);

  } catch (error) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to get sales data for the last 7 days
async function getSalesDataLast7Days() {
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const salesData = await Promise.all(
    last7Days.map(async (date) => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const [salesResult, ordersCount] = await Promise.all([
        prisma.order.aggregate({
          _sum: {
            totalAmount: true,
          },
          where: {
            status: 'DELIVERED',
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),
        prisma.order.count({
          where: {
            createdAt: {
              gte: startOfDay,
              lte: endOfDay,
            },
          },
        }),
      ]);

      return {
        date: date.toISOString().split('T')[0],
        sales: Number(salesResult._sum.totalAmount || 0),
        orders: ordersCount,
      };
    })
  );

  return salesData;
}

// Helper function to get top products by revenue
async function getTopProducts() {
  const topProducts = await prisma.orderItem.groupBy({
    by: ['productId'],
    _sum: {
      quantity: true,
      price: true,
    },
    _count: {
      productId: true,
    },
    orderBy: {
      _sum: {
        price: 'desc',
      },
    },
    take: 5,
  });

  // Get product details for the top products
  const productsWithDetails = await Promise.all(
    topProducts.map(async (item: any) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { name: true },
      });

      return {
        id: item.productId,
        name: product?.name || 'Unknown Product',
        sales: item._sum.quantity || 0,
        revenue: Number(item._sum.price || 0),
      };
    })
  );

  return productsWithDetails;
}
import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedOrders() {
  try {
    console.log('🌱 Seeding sample orders...');

    // Find the admin user
    const adminUser = await prisma.user.findUnique({
      where: { email: 'admin@papelisco.com' }
    });

    if (!adminUser) {
      console.log('❌ Admin user not found. Please run the main seed script first.');
      return;
    }

    // Find some products
    const products = await prisma.product.findMany({
      take: 5,
      include: {
        images: true
      }
    });

    if (products.length === 0) {
      console.log('❌ No products found. Please seed products first.');
      return;
    }

    // Create sample orders
    const orders = [
      {
        userId: adminUser.id,
        orderNumber: 'ORD-2024-001',
        status: OrderStatus.DELIVERED,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: 'Credit Card',
        subtotal: 149.98,
        taxAmount: 12.00,
        shippingAmount: 9.99,
        discountAmount: 0,
        totalAmount: 171.97,
        shippingAddress: {
          firstName: 'Admin',
          lastName: 'User',
          addressLine1: '123 Main St',
          addressLine2: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'United States',
          phone: '+1 (555) 123-4567'
        },
        billingAddress: {
          firstName: 'Admin',
          lastName: 'User',
          addressLine1: '123 Main St',
          addressLine2: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'United States'
        },
        notes: 'Please leave package at the front door.',
        createdAt: new Date('2024-10-15T10:30:00Z'),
        updatedAt: new Date('2024-10-20T14:45:00Z'),
        orderItems: [
          {
            productId: products[0].id,
            quantity: 2,
            price: 29.99,
            total: 59.98
          },
          {
            productId: products[1].id,
            quantity: 1,
            price: 89.99,
            total: 89.99
          }
        ]
      },
      {
        userId: adminUser.id,
        orderNumber: 'ORD-2024-002',
        status: OrderStatus.SHIPPED,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: 'PayPal',
        subtotal: 75.50,
        taxAmount: 6.04,
        shippingAmount: 0,
        discountAmount: 7.55,
        totalAmount: 73.99,
        shippingAddress: {
          firstName: 'Admin',
          lastName: 'User',
          addressLine1: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90210',
          country: 'United States',
          phone: '+1 (555) 987-6543'
        },
        notes: 'Gift order - please include gift receipt.',
        createdAt: new Date('2024-11-01T16:20:00Z'),
        updatedAt: new Date('2024-11-05T09:15:00Z'),
        orderItems: [
          {
            productId: products[2].id,
            quantity: 3,
            price: 25.17,
            total: 75.50
          }
        ]
      },
      {
        userId: adminUser.id,
        orderNumber: 'ORD-2024-003',
        status: OrderStatus.PROCESSING,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: 'Apple Pay',
        subtotal: 199.99,
        taxAmount: 16.00,
        shippingAmount: 15.99,
        discountAmount: 20.00,
        totalAmount: 211.98,
        shippingAddress: {
          firstName: 'Admin',
          lastName: 'User',
          addressLine1: '789 Pine Street',
          city: 'Chicago',
          state: 'IL',
          postalCode: '60601',
          country: 'United States'
        },
        createdAt: new Date('2024-11-08T12:00:00Z'),
        updatedAt: new Date('2024-11-08T12:00:00Z'),
        orderItems: [
          {
            productId: products[3].id,
            quantity: 1,
            price: 199.99,
            total: 199.99
          }
        ]
      },
      {
        userId: adminUser.id,
        orderNumber: 'ORD-2024-004',
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: 'Bank Transfer',
        subtotal: 45.00,
        taxAmount: 3.60,
        shippingAmount: 5.99,
        discountAmount: 0,
        totalAmount: 54.59,
        createdAt: new Date('2024-11-09T08:30:00Z'),
        updatedAt: new Date('2024-11-09T08:30:00Z'),
        orderItems: [
          {
            productId: products[4].id,
            quantity: 2,
            price: 22.50,
            total: 45.00
          }
        ]
      },
      {
        userId: adminUser.id,
        orderNumber: 'ORD-2024-005',
        status: OrderStatus.CANCELLED,
        paymentStatus: PaymentStatus.REFUNDED,
        paymentMethod: 'Credit Card',
        subtotal: 89.99,
        taxAmount: 7.20,
        shippingAmount: 9.99,
        discountAmount: 0,
        totalAmount: 107.18,
        notes: 'Order cancelled by customer request.',
        createdAt: new Date('2024-10-25T14:15:00Z'),
        updatedAt: new Date('2024-10-26T10:30:00Z'),
        orderItems: [
          {
            productId: products[1].id,
            quantity: 1,
            price: 89.99,
            total: 89.99
          }
        ]
      }
    ];

    // Create orders with their items
    for (const orderData of orders) {
      const { orderItems, ...order } = orderData;
      
      const createdOrder = await prisma.order.create({
        data: {
          ...order,
          orderItems: {
            create: orderItems
          }
        },
        include: {
          orderItems: true
        }
      });

      console.log(`✅ Created order: ${createdOrder.orderNumber}`);
    }

    console.log('🎉 Sample orders seeded successfully!');

  } catch (error) {
    console.error('❌ Error seeding orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedOrders();
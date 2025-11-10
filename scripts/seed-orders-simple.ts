import { PrismaClient, OrderStatus, PaymentStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function seedOrders() {
  try {
    console.log('🌱 Seeding sample orders...');

    // Clean existing orders first
    console.log('🧹 Cleaning existing orders...');
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();

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

    // Generate unique order numbers with timestamp
    const timestamp = Date.now();
    
    // Create sample orders
    const orders = [
      {
        userId: adminUser.id,
        orderNumber: `ORD-${timestamp}-001`,
        status: OrderStatus.DELIVERED,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: 'Credit Card',
        subtotal: 149.98,
        taxAmount: 12.00,
        shippingAmount: 9.99,
        discountAmount: 0,
        totalAmount: 171.97,
        shippingAddress: JSON.stringify({
          firstName: 'Admin',
          lastName: 'User',
          addressLine1: '123 Main St',
          addressLine2: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'United States',
          phone: '+1 (555) 123-4567'
        }),
        billingAddress: JSON.stringify({
          firstName: 'Admin',
          lastName: 'User',
          addressLine1: '123 Main St',
          addressLine2: 'Apt 4B',
          city: 'New York',
          state: 'NY',
          postalCode: '10001',
          country: 'United States'
        }),
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
        orderNumber: `ORD-${timestamp}-002`,
        status: OrderStatus.SHIPPED,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: 'PayPal',
        subtotal: 75.50,
        taxAmount: 6.04,
        shippingAmount: 12.99,
        discountAmount: 10.00,
        totalAmount: 84.53,
        shippingAddress: JSON.stringify({
          firstName: 'Admin',
          lastName: 'User',
          addressLine1: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90210',
          country: 'United States',
          phone: '+1 (555) 987-6543'
        }),
        billingAddress: JSON.stringify({
          firstName: 'Admin',
          lastName: 'User',
          addressLine1: '456 Oak Avenue',
          city: 'Los Angeles',
          state: 'CA',
          postalCode: '90210',
          country: 'United States'
        }),
        notes: null,
        createdAt: new Date('2024-11-01T09:15:00Z'),
        updatedAt: new Date('2024-11-05T16:20:00Z'),
        orderItems: [
          {
            productId: products[2] ? products[2].id : products[0].id,
            quantity: 1,
            price: 45.50,
            total: 45.50
          },
          {
            productId: products[3] ? products[3].id : products[1].id,
            quantity: 1,
            price: 30.00,
            total: 30.00
          }
        ]
      },
      {
        userId: adminUser.id,
        orderNumber: `ORD-${timestamp}-003`,
        status: OrderStatus.PROCESSING,
        paymentStatus: PaymentStatus.PAID,
        paymentMethod: 'Credit Card',
        subtotal: 220.00,
        taxAmount: 17.60,
        shippingAmount: 15.99,
        discountAmount: 0,
        totalAmount: 253.59,
        shippingAddress: JSON.stringify({
          firstName: 'Admin',
          lastName: 'User',
          addressLine1: '789 Pine Street',
          addressLine2: 'Suite 200',
          city: 'Chicago',
          state: 'IL',
          postalCode: '60601',
          country: 'United States',
          phone: '+1 (555) 456-7890'
        }),
        billingAddress: JSON.stringify({
          firstName: 'Admin',
          lastName: 'User',
          addressLine1: '789 Pine Street',
          addressLine2: 'Suite 200',
          city: 'Chicago',
          state: 'IL',
          postalCode: '60601',
          country: 'United States'
        }),
        notes: 'Business address - deliver during business hours only.',
        createdAt: new Date('2024-11-10T14:22:00Z'),
        updatedAt: new Date('2024-11-10T14:22:00Z'),
        orderItems: [
          {
            productId: products[4] ? products[4].id : products[0].id,
            quantity: 2,
            price: 110.00,
            total: 220.00
          }
        ]
      },
      {
        userId: adminUser.id,
        orderNumber: `ORD-${timestamp}-004`,
        status: OrderStatus.PENDING,
        paymentStatus: PaymentStatus.PENDING,
        paymentMethod: 'Bank Transfer',
        subtotal: 95.97,
        taxAmount: 7.68,
        shippingAmount: 8.99,
        discountAmount: 5.00,
        totalAmount: 107.64,
        shippingAddress: JSON.stringify({
          firstName: 'Admin',
          lastName: 'User',
          addressLine1: '321 Elm Drive',
          city: 'Miami',
          state: 'FL',
          postalCode: '33101',
          country: 'United States',
          phone: '+1 (555) 789-0123'
        }),
        billingAddress: JSON.stringify({
          firstName: 'Admin',
          lastName: 'User',
          addressLine1: '321 Elm Drive',
          city: 'Miami',
          state: 'FL',
          postalCode: '33101',
          country: 'United States'
        }),
        notes: null,
        createdAt: new Date('2024-11-15T11:45:00Z'),
        updatedAt: new Date('2024-11-15T11:45:00Z'),
        orderItems: [
          {
            productId: products[0].id,
            quantity: 1,
            price: 29.99,
            total: 29.99
          },
          {
            productId: products[1].id,
            quantity: 1,
            price: 65.98,
            total: 65.98
          }
        ]
      },
      {
        userId: adminUser.id,
        orderNumber: `ORD-${timestamp}-005`,
        status: OrderStatus.CANCELLED,
        paymentStatus: PaymentStatus.REFUNDED,
        paymentMethod: 'Credit Card',
        subtotal: 180.00,
        taxAmount: 14.40,
        shippingAmount: 19.99,
        discountAmount: 0,
        totalAmount: 214.39,
        shippingAddress: JSON.stringify({
          firstName: 'Admin',
          lastName: 'User',
          addressLine1: '654 Maple Lane',
          city: 'Seattle',
          state: 'WA',
          postalCode: '98101',
          country: 'United States',
          phone: '+1 (555) 234-5678'
        }),
        billingAddress: JSON.stringify({
          firstName: 'Admin',
          lastName: 'User',
          addressLine1: '654 Maple Lane',
          city: 'Seattle',
          state: 'WA',
          postalCode: '98101',
          country: 'United States'
        }),
        notes: 'Customer requested cancellation due to delayed shipping.',
        createdAt: new Date('2024-09-20T08:30:00Z'),
        updatedAt: new Date('2024-09-25T10:15:00Z'),
        orderItems: [
          {
            productId: products[2] ? products[2].id : products[0].id,
            quantity: 3,
            price: 60.00,
            total: 180.00
          }
        ]
      }
    ];

    // Create orders with order items
    for (let i = 0; i < orders.length; i++) {
      const orderData = orders[i];
      const { orderItems, ...order } = orderData;

      console.log(`📦 Creating order ${i + 1}/${orders.length}: ${order.orderNumber}`);

      const createdOrder = await prisma.order.create({
        data: order
      });

      // Create order items
      for (const item of orderItems) {
        await prisma.orderItem.create({
          data: {
            ...item,
            orderId: createdOrder.id
          }
        });
      }
    }

    console.log(`✅ Successfully created ${orders.length} sample orders!`);
    console.log('🎉 Orders seeding completed successfully!');

  } catch (error) {
    console.error('❌ Error seeding orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedOrders();
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@papelisco.com' },
    update: {},
    create: {
      email: 'admin@papelisco.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      name: 'Admin User',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  console.log('👤 Admin user created:', adminUser.email);

  // Create sample categories
  const phoneCategory = await prisma.category.upsert({
    where: { slug: 'smartphones' },
    update: {},
    create: {
      name: 'Smartphones',
      slug: 'smartphones',
      description: 'Latest smartphones and mobile devices',
      isActive: true,
    },
  });

  const electronicsCategory = await prisma.category.upsert({
    where: { slug: 'electronics' },
    update: {},
    create: {
      name: 'Electronics',
      slug: 'electronics',
      description: 'Consumer electronics and gadgets',
      isActive: true,
    },
  });

  const booksCategory = await prisma.category.upsert({
    where: { slug: 'books' },
    update: {},
    create: {
      name: 'Books',
      slug: 'books',
      description: 'Books and educational materials',
      isActive: true,
    },
  });

  console.log('📂 Categories created');

  // Create sample products
  const products = [
    {
      name: 'iPhone 15',
      slug: 'iphone-15',
      description: 'Latest Apple iPhone with advanced features.',
      price: 999.00,
      category: phoneCategory.id,
      sku: 'IPHONE15',
      stockQuantity: 50,
      image: '/images/iphone15.jpg'
    },
    {
      name: 'Samsung Galaxy S24',
      slug: 'samsung-galaxy-s24',
      description: 'Flagship Samsung phone with stunning display.',
      price: 899.00,
      category: phoneCategory.id,
      sku: 'GALAXYS24',
      stockQuantity: 30,
      image: '/images/galaxy-s24.svg'
    },
    {
      name: 'Kindle Paperwhite',
      slug: 'kindle-paperwhite',
      description: 'E-reader with high-resolution display.',
      price: 129.00,
      category: electronicsCategory.id,
      sku: 'KINDLE',
      stockQuantity: 100,
      image: '/images/kindle.svg'
    },
    {
      name: 'Staedtler Pencil',
      slug: 'staedtler-pencil',
      description: 'High-quality graphite pencil.',
      price: 2.00,
      category: booksCategory.id, // Using books category as there's no pencils category
      sku: 'PENCIL',
      stockQuantity: 500,
      image: '/images/staedtler-pencil.svg'
    },
    {
      name: 'Pilot G2 Pen',
      slug: 'pilot-g2-pen',
      description: 'Smooth gel ink pen for everyday use.',
      price: 3.00,
      category: booksCategory.id, // Using books category as there's no pens category
      sku: 'PILOTG2',
      stockQuantity: 300,
      image: '/images/pilot-g2.svg'
    },
    {
      name: 'Harry Potter Book Set',
      slug: 'harry-potter-set',
      description: 'Complete set of Harry Potter books.',
      price: 59.00,
      category: booksCategory.id,
      sku: 'HPBOOKS',
      stockQuantity: 25,
      image: '/images/harry-potter.svg'
    },
    {
      name: 'Gift Card',
      slug: 'gift-card',
      description: 'Perfect gift for any occasion.',
      price: 25.00,
      category: booksCategory.id, // Using books category as there's no gifts category
      sku: 'GIFTCARD',
      stockQuantity: 1000,
      image: '/images/gift-card.svg'
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: {
        name: product.name,
        slug: product.slug,
        description: product.description,
        price: product.price,
        categoryId: product.category,
        sku: product.sku,
        stockQuantity: product.stockQuantity,
        status: 'ACTIVE',
        isFeatured: true,
        images: {
          create: {
            imageUrl: product.image,
            altText: product.name,
            isPrimary: true,
          }
        }
      },
    });
  }

  console.log('📱 Products created');

  // Create sample customers
  const customerPassword = await bcrypt.hash('customer123', 12);
  
  const customers = [
    {
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      name: 'John Doe',
    },
    {
      email: 'jane.smith@example.com',
      firstName: 'Jane',
      lastName: 'Smith',
      name: 'Jane Smith',
    },
    {
      email: 'bob.wilson@example.com',
      firstName: 'Bob',
      lastName: 'Wilson',
      name: 'Bob Wilson',
    },
  ];

  for (const customer of customers) {
    await prisma.user.upsert({
      where: { email: customer.email },
      update: {},
      create: {
        ...customer,
        password: customerPassword,
        role: 'CUSTOMER',
        isVerified: true,
      },
    });
  }

  console.log('👥 Sample customers created');

  // Create sample orders for analytics
  const now = new Date();
  const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const sampleUsers = await prisma.user.findMany({
    where: { role: 'CUSTOMER' },
    take: 3,
  });

  const sampleProducts = await prisma.product.findMany({ take: 5 });

  // Create orders for analytics
  const orderData = [
    { date: new Date(2024, 10, 1), total: 1599.98, items: 2 },
    { date: new Date(2024, 10, 3), total: 899.99, items: 1 },
    { date: new Date(2024, 10, 5), total: 649.98, items: 2 },
    { date: new Date(2024, 10, 8), total: 2499.99, items: 1 },
    { date: new Date(2024, 10, 12), total: 1149.98, items: 3 },
    { date: new Date(2024, 10, 15), total: 599.99, items: 1 },
    { date: new Date(2024, 10, 18), total: 999.99, items: 1 },
    { date: new Date(2024, 10, 22), total: 2099.97, items: 4 },
    { date: new Date(2024, 10, 25), total: 1799.98, items: 2 },
    { date: new Date(2024, 10, 28), total: 549.99, items: 1 },
  ];

  for (let i = 0; i < orderData.length; i++) {
    const orderInfo = orderData[i];
    const customer = sampleUsers[i % sampleUsers.length];
    
    const order = await prisma.order.create({
      data: {
        orderNumber: `ORD-${Date.now()}-${i}`,
        userId: customer.id,
        status: Math.random() > 0.2 ? 'DELIVERED' : 'PENDING',
        totalAmount: orderInfo.total,
        subtotal: orderInfo.total * 0.9,
        taxAmount: orderInfo.total * 0.1,
        shippingAmount: 0,
        createdAt: orderInfo.date,
        updatedAt: orderInfo.date,
      },
    });

    // Add order items
    const numItems = Math.min(orderInfo.items, sampleProducts.length);
    const selectedProducts = sampleProducts.slice(0, numItems);
    
    for (const product of selectedProducts) {
      await prisma.orderItem.create({
        data: {
          orderId: order.id,
          productId: product.id,
          quantity: 1,
          price: product.price,
          total: product.price,
        },
      });
    }
  }

  console.log('📦 Sample orders created for analytics');
  console.log('✅ Database seeding completed!');
  console.log('\n📋 Admin Credentials:');
  console.log('Email: admin@papelisco.com');
  console.log('Password: admin123');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
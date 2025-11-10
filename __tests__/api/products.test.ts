/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { GET } from '@/app/api/products/route'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: jest.fn(),
    },
  },
}))

import { prisma } from '@/lib/prisma'

const mockPrisma = prisma as any

describe('/api/products GET', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createMockRequest = (searchParams: Record<string, string> = {}) => {
    const url = new URL('http://localhost:3000/api/products')
    Object.entries(searchParams).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
    
    return new NextRequest(url.toString(), {
      method: 'GET',
    })
  }

  // Expected products after transformation
  const mockProducts = [
    {
      id: 'product1',
      name: 'Test Product 1',
      description: 'Test description 1',
      price: 29.99,
      image: '/images/product1.jpg',
      category: 'Electronics',
    },
    {
      id: 'product2',
      name: 'Test Product 2',
      description: 'Test description 2',
      price: 49.99,
      image: '/images/product2.jpg',
      category: 'Electronics',
    },
  ]

  // Raw products from database (before transformation)
  const mockProductsFromDb = [
    {
      id: 'product1',
      name: 'Test Product 1',
      description: 'Test description 1',
      price: 29.99,
      category: {
        id: 'category1',
        name: 'Electronics',
      },
      images: [{ imageUrl: '/images/product1.jpg', isPrimary: true }],
    },
    {
      id: 'product2',
      name: 'Test Product 2',
      description: 'Test description 2',
      price: 49.99,
      category: {
        id: 'category1',
        name: 'Electronics',
      },
      images: [{ imageUrl: '/images/product2.jpg', isPrimary: true }],
    },
  ]

  test('should get all products successfully', async () => {
    mockPrisma.product.findMany.mockResolvedValue(mockProductsFromDb)

    const request = createMockRequest()
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.products).toEqual(mockProducts)
    expect(data.total).toBe(mockProducts.length)

    // Verify correct query was made
    expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
      where: { status: 'ACTIVE' },
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  })

  test('should filter products by category', async () => {
    // Test the actual category filter functionality
    mockPrisma.product.findMany.mockResolvedValue([mockProductsFromDb[0]])

    const request = createMockRequest({ category: 'Electronics' })
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.products).toEqual([mockProducts[0]])

    // Verify category filter was applied
    expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
      where: { 
        status: 'ACTIVE',
        category: { 
          name: { 
            contains: 'Electronics', 
            mode: 'insensitive' 
          } 
        }
      },
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    })
  })

  test('should support limit parameter', async () => {
    mockPrisma.product.findMany.mockResolvedValue([mockProductsFromDb[0]])

    const request = createMockRequest({ limit: '1' })
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.products).toEqual([mockProducts[0]])

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
      where: { status: 'ACTIVE' },
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 1,
    })
  })

  test('should support offset parameter', async () => {
    mockPrisma.product.findMany.mockResolvedValue([mockProductsFromDb[1]])

    const request = createMockRequest({ offset: '1' })
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.products).toEqual([mockProducts[1]])

    expect(mockPrisma.product.findMany).toHaveBeenCalledWith({
      where: { status: 'ACTIVE' },
      include: {
        category: true,
        images: {
          where: { isPrimary: true },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: 1,
    })
  })

  test('should return empty array when no products found', async () => {
    mockPrisma.product.findMany.mockResolvedValue([])

    const request = createMockRequest({ category: 'nonexistent' })
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.products).toEqual([])
    expect(data.total).toBe(0)
  })

  test('should handle database errors', async () => {
    mockPrisma.product.findMany.mockRejectedValue(new Error('Database error'))

    const request = createMockRequest()
    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Failed to fetch products')
  })
})
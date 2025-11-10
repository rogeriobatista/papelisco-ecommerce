/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { PUT } from '@/app/api/auth/profile/route'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      update: jest.fn(),
    },
  },
}))

// Mock auth functions
jest.mock('@/lib/auth', () => ({
  verifyToken: jest.fn(),
}))

import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

const mockPrisma = prisma as any
const mockVerifyToken = verifyToken as jest.MockedFunction<typeof verifyToken>

describe('/api/auth/profile PUT', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createMockRequest = (body: any, authHeader?: string) => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }
    
    if (authHeader) {
      headers['Authorization'] = authHeader
    }

    return new NextRequest('http://localhost:3000/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(body),
      headers,
    })
  }

  const mockTokenPayload = {
    userId: 'user123',
    email: 'test@example.com',
    role: 'CUSTOMER',
    iat: Date.now() / 1000,
    exp: Date.now() / 1000 + 3600,
  }

  const validProfileData = {
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
  }

  const mockUpdatedUser = {
    id: 'user123',
    email: 'test@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '+1234567890',
    role: 'CUSTOMER',
    isVerified: true,
    createdAt: new Date('2023-01-01'),
    updatedAt: new Date(),
  }

  test('should update profile successfully with valid data', async () => {
    mockVerifyToken.mockReturnValue(mockTokenPayload)
    mockPrisma.user.update.mockResolvedValue(mockUpdatedUser)

    const request = createMockRequest(validProfileData, 'Bearer valid.jwt.token')
    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Profile updated successfully')
    expect(data.user).toEqual({
      id: mockUpdatedUser.id,
      email: mockUpdatedUser.email,
      firstName: mockUpdatedUser.firstName,
      lastName: mockUpdatedUser.lastName,
      phone: mockUpdatedUser.phone,
      role: mockUpdatedUser.role,
      isVerified: mockUpdatedUser.isVerified,
      createdAt: expect.any(String), // Dates are serialized as strings in JSON
      updatedAt: expect.any(String),
    })

    // Verify database was called with correct data
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: mockTokenPayload.userId },
      data: {
        firstName: validProfileData.firstName,
        lastName: validProfileData.lastName,
        phone: validProfileData.phone,
        updatedAt: expect.any(Date),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        role: true,
        isVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  })

  test('should update profile with null phone', async () => {
    mockVerifyToken.mockReturnValue(mockTokenPayload)
    mockPrisma.user.update.mockResolvedValue({
      ...mockUpdatedUser,
      phone: null,
    })

    const profileDataWithNullPhone = {
      firstName: 'John',
      lastName: 'Doe',
      phone: null,
    }

    const request = createMockRequest(profileDataWithNullPhone, 'Bearer valid.jwt.token')
    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Profile updated successfully')
    expect(data.user.phone).toBeNull()

    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: mockTokenPayload.userId },
      data: {
        firstName: profileDataWithNullPhone.firstName,
        lastName: profileDataWithNullPhone.lastName,
        phone: null,
        updatedAt: expect.any(Date),
      },
      select: expect.any(Object),
    })
  })

  test('should reject request without authorization header', async () => {
    const request = createMockRequest(validProfileData)
    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('No token provided')
  })

  test('should reject request with invalid authorization header format', async () => {
    const request = createMockRequest(validProfileData, 'InvalidFormat')
    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('No token provided')
  })

  test('should reject request with invalid JWT token', async () => {
    mockVerifyToken.mockReturnValue(null)

    const request = createMockRequest(validProfileData, 'Bearer invalid.jwt.token')
    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid token')
  })

  test('should reject request with missing firstName', async () => {
    mockVerifyToken.mockReturnValue(mockTokenPayload)

    const invalidData = {
      lastName: 'Doe',
      phone: '+1234567890',
    }

    const request = createMockRequest(invalidData, 'Bearer valid.jwt.token')
    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid input')
    expect(data.details).toContain('Invalid input: expected string, received undefined')
  })

  test('should reject request with missing lastName', async () => {
    mockVerifyToken.mockReturnValue(mockTokenPayload)

    const invalidData = {
      firstName: 'John',
      phone: '+1234567890',
    }

    const request = createMockRequest(invalidData, 'Bearer valid.jwt.token')
    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid input')
    expect(data.details).toContain('Invalid input: expected string, received undefined')
  })

  test('should reject firstName that is too long', async () => {
    mockVerifyToken.mockReturnValue(mockTokenPayload)

    const invalidData = {
      firstName: 'A'.repeat(51), // Too long
      lastName: 'Doe',
      phone: '+1234567890',
    }

    const request = createMockRequest(invalidData, 'Bearer valid.jwt.token')
    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid input')
  })

  test('should reject lastName that is too long', async () => {
    mockVerifyToken.mockReturnValue(mockTokenPayload)

    const invalidData = {
      firstName: 'John',
      lastName: 'A'.repeat(51), // Too long
      phone: '+1234567890',
    }

    const request = createMockRequest(invalidData, 'Bearer valid.jwt.token')
    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid input')
  })

  test('should reject empty firstName', async () => {
    mockVerifyToken.mockReturnValue(mockTokenPayload)

    const invalidData = {
      firstName: '',
      lastName: 'Doe',
      phone: '+1234567890',
    }

    const request = createMockRequest(invalidData, 'Bearer valid.jwt.token')
    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Invalid input')
    expect(data.details).toContain('First name is required')
  })

  test('should handle database errors', async () => {
    mockVerifyToken.mockReturnValue(mockTokenPayload)
    mockPrisma.user.update.mockRejectedValue(new Error('Database error'))

    const request = createMockRequest(validProfileData, 'Bearer valid.jwt.token')
    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Server error')
  })

  test('should handle user not found error', async () => {
    mockVerifyToken.mockReturnValue(mockTokenPayload)
    mockPrisma.user.update.mockRejectedValue(
      new Error('Record to update not found.')
    )

    const request = createMockRequest(validProfileData, 'Bearer valid.jwt.token')
    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Server error')
  })

  test('should handle invalid JSON body', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/profile', {
      method: 'PUT',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer valid.jwt.token',
      },
    })

    const response = await PUT(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Server error')
  })
})
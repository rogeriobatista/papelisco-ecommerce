/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/login/route'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    session: {
      create: jest.fn(),
    },
  },
}))

// Mock auth functions
jest.mock('@/lib/auth', () => ({
  verifyPassword: jest.fn(),
  generateToken: jest.fn(),
  isValidEmail: jest.fn(),
}))

import { prisma } from '@/lib/prisma'
import { verifyPassword, generateToken, isValidEmail } from '@/lib/auth'

const mockPrisma = prisma as any
const mockVerifyPassword = verifyPassword as jest.MockedFunction<typeof verifyPassword>
const mockGenerateToken = generateToken as jest.MockedFunction<typeof generateToken>
const mockIsValidEmail = isValidEmail as jest.MockedFunction<typeof isValidEmail>

describe('/api/auth/login', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createMockRequest = (body: any) => {
    return new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const mockUser = {
    id: 'user123',
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    password: 'hashedPassword',
    role: 'CUSTOMER',
    isVerified: true,
    lastLoginAt: null,
  }

  test('should login successfully with valid credentials', async () => {
    // Mock implementations
    mockIsValidEmail.mockReturnValue(true)
    mockPrisma.user.findUnique.mockResolvedValue(mockUser)
    mockVerifyPassword.mockResolvedValue(true)
    mockGenerateToken.mockReturnValue('fake.jwt.token')
    mockPrisma.session.create.mockResolvedValue({
      id: 'session123',
      sessionToken: 'fake.jwt.token',
      userId: mockUser.id,
      expires: new Date(),
    })
    mockPrisma.user.update.mockResolvedValue({
      ...mockUser,
      lastLoginAt: new Date(),
    })

    const request = createMockRequest({
      email: 'test@example.com',
      password: 'password123',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.message).toBe('Login successful')
    expect(data.user).toEqual({
      id: mockUser.id,
      email: mockUser.email,
      firstName: mockUser.firstName,
      lastName: mockUser.lastName,
      role: mockUser.role,
      isVerified: mockUser.isVerified,
    })
    expect(data.token).toBe('fake.jwt.token')
    
    // Verify user.update was called to set lastLoginAt
    expect(mockPrisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: { lastLoginAt: expect.any(Date) },
    })
  })

  test('should reject invalid email format', async () => {
    mockIsValidEmail.mockReturnValue(false)

    const request = createMockRequest({
      email: 'invalid-email',
      password: 'password123',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Please provide a valid email address')
  })

  test('should reject when user not found', async () => {
    mockIsValidEmail.mockReturnValue(true)
    mockPrisma.user.findUnique.mockResolvedValue(null)

    const request = createMockRequest({
      email: 'nonexistent@example.com',
      password: 'password123',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid email or password')
  })

  test('should reject when password is incorrect', async () => {
    mockIsValidEmail.mockReturnValue(true)
    mockPrisma.user.findUnique.mockResolvedValue(mockUser)
    mockVerifyPassword.mockResolvedValue(false)

    const request = createMockRequest({
      email: 'test@example.com',
      password: 'wrongpassword',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.error).toBe('Invalid email or password')
  })

  test('should reject when user is not verified', async () => {
    const unverifiedUser = { ...mockUser, isVerified: false }
    
    mockIsValidEmail.mockReturnValue(true)
    mockPrisma.user.findUnique.mockResolvedValue(unverifiedUser)
    mockVerifyPassword.mockResolvedValue(true)

    const request = createMockRequest({
      email: 'test@example.com',
      password: 'password123',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(403)
    expect(data.error).toBe('Please verify your email before logging in')
  })

  test('should reject missing email', async () => {
    const request = createMockRequest({
      password: 'password123',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Email and password are required')
  })

  test('should reject missing password', async () => {
    const request = createMockRequest({
      email: 'test@example.com',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Email and password are required')
  })

  test('should handle database errors', async () => {
    mockIsValidEmail.mockReturnValue(true)
    mockPrisma.user.findUnique.mockRejectedValue(new Error('Database error'))

    const request = createMockRequest({
      email: 'test@example.com',
      password: 'password123',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Internal server error')
  })

  test('should handle invalid JSON body', async () => {
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: 'invalid json',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Internal server error')
  })
})
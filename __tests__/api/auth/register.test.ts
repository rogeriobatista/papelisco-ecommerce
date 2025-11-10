/**
 * @jest-environment node
 */

import { NextRequest } from 'next/server'
import { POST } from '@/app/api/auth/register/route'

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    session: {
      create: jest.fn(),
    },
  },
}))

// Mock auth functions
jest.mock('@/lib/auth', () => ({
  hashPassword: jest.fn(),
  generateToken: jest.fn(),
  isValidEmail: jest.fn(),
  isValidPassword: jest.fn(),
}))

import { prisma } from '@/lib/prisma'
import { hashPassword, generateToken, isValidEmail, isValidPassword } from '@/lib/auth'

const mockPrisma = prisma as any
const mockHashPassword = hashPassword as jest.MockedFunction<typeof hashPassword>
const mockGenerateToken = generateToken as jest.MockedFunction<typeof generateToken>
const mockIsValidEmail = isValidEmail as jest.MockedFunction<typeof isValidEmail>
const mockIsValidPassword = isValidPassword as jest.MockedFunction<typeof isValidPassword>

describe('/api/auth/register', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const createMockRequest = (body: any) => {
    return new NextRequest('http://localhost:3000/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  const validRegistrationData = {
    email: 'newuser@example.com',
    password: 'StrongPass123!',
    firstName: 'John',
    lastName: 'Doe',
  }

  const mockCreatedUser = {
    id: 'user123',
    email: 'newuser@example.com',
    firstName: 'John',
    lastName: 'Doe',
    name: 'John Doe',
    phone: null,
    role: 'CUSTOMER',
    isVerified: false,
    createdAt: new Date(),
  }

  test('should register new user successfully', async () => {
    // Mock implementations
    mockIsValidEmail.mockReturnValue(true)
    mockIsValidPassword.mockReturnValue({ isValid: true, errors: [] })
    mockPrisma.user.findUnique.mockResolvedValue(null) // User doesn't exist
    mockHashPassword.mockResolvedValue('hashedPassword123')
    mockPrisma.user.create.mockResolvedValue(mockCreatedUser)
    mockPrisma.session.create.mockResolvedValue({
      id: 'session123',
      sessionToken: 'fake.jwt.token',
      userId: mockCreatedUser.id,
      expires: new Date(),
    })
    mockGenerateToken.mockReturnValue('fake.jwt.token')

    const request = createMockRequest(validRegistrationData)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.message).toBe('User created successfully')
    expect(data.user).toEqual({
      id: mockCreatedUser.id,
      email: mockCreatedUser.email,
      firstName: mockCreatedUser.firstName,
      lastName: mockCreatedUser.lastName,
      name: mockCreatedUser.name,
      phone: mockCreatedUser.phone,
      role: mockCreatedUser.role,
      isVerified: mockCreatedUser.isVerified,
      createdAt: expect.any(String), // Dates are serialized as strings in JSON
    })
    expect(data.token).toBe('fake.jwt.token')

    // Verify user was created with correct data
    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        email: validRegistrationData.email,
        password: 'hashedPassword123',
        firstName: validRegistrationData.firstName,
        lastName: validRegistrationData.lastName,
        name: 'John Doe',
        phone: null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        phone: true,
        isVerified: true,
        role: true,
        createdAt: true,
      },
    })
  })

  test('should reject invalid email format', async () => {
    mockIsValidEmail.mockReturnValue(false)

    const request = createMockRequest({
      ...validRegistrationData,
      email: 'invalid-email',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Please provide a valid email address')
  })

  test('should reject weak password', async () => {
    mockIsValidEmail.mockReturnValue(true)
    mockIsValidPassword.mockReturnValue({
      isValid: false,
      errors: ['Password must be at least 8 characters long'],
    })

    const request = createMockRequest({
      ...validRegistrationData,
      password: 'weak',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Password does not meet requirements')
    expect(data.details).toEqual(['Password must be at least 8 characters long'])
  })

  test('should reject when user already exists', async () => {
    mockIsValidEmail.mockReturnValue(true)
    mockIsValidPassword.mockReturnValue({ isValid: true, errors: [] })
    mockPrisma.user.findUnique.mockResolvedValue(mockCreatedUser) // User exists

    const request = createMockRequest(validRegistrationData)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(409)
    expect(data.error).toBe('A user with this email already exists')
  })

  test('should reject missing email', async () => {
    const request = createMockRequest({
      password: 'StrongPass123!',
      firstName: 'John',
      lastName: 'Doe',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Email, password, firstName, and lastName are required')
  })

  test('should reject missing password', async () => {
    const request = createMockRequest({
      email: 'test@example.com',
      firstName: 'John',
      lastName: 'Doe',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Email, password, firstName, and lastName are required')
  })

  test('should reject missing firstName', async () => {
    const request = createMockRequest({
      email: 'test@example.com',
      password: 'StrongPass123!',
      lastName: 'Doe',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Email, password, firstName, and lastName are required')
  })

  test('should reject missing lastName', async () => {
    const request = createMockRequest({
      email: 'test@example.com',
      password: 'StrongPass123!',
      firstName: 'John',
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.error).toBe('Email, password, firstName, and lastName are required')
  })

  test('should handle database errors during user creation', async () => {
    mockIsValidEmail.mockReturnValue(true)
    mockIsValidPassword.mockReturnValue({ isValid: true, errors: [] })
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockHashPassword.mockResolvedValue('hashedPassword123')
    mockPrisma.user.create.mockRejectedValue(new Error('Database error'))

    const request = createMockRequest(validRegistrationData)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Internal server error')
  })

  test('should handle password hashing errors', async () => {
    mockIsValidEmail.mockReturnValue(true)
    mockIsValidPassword.mockReturnValue({ isValid: true, errors: [] })
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockHashPassword.mockRejectedValue(new Error('Hash error'))

    const request = createMockRequest(validRegistrationData)
    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.error).toBe('Internal server error')
  })

  test('should trim whitespace from input fields', async () => {
    mockIsValidEmail.mockReturnValue(true)
    mockIsValidPassword.mockReturnValue({ isValid: true, errors: [] })
    mockPrisma.user.findUnique.mockResolvedValue(null)
    mockHashPassword.mockResolvedValue('hashedPassword123')
    mockPrisma.user.create.mockResolvedValue(mockCreatedUser)
    mockGenerateToken.mockReturnValue('fake.jwt.token')

    const request = createMockRequest({
      email: '  newuser@example.com  ',
      password: 'StrongPass123!',
      firstName: '  John  ',
      lastName: '  Doe  ',
    })

    await POST(request)

    expect(mockPrisma.user.create).toHaveBeenCalledWith({
      data: {
        email: 'newuser@example.com',
        password: 'hashedPassword123',
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        phone: null,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        name: true,
        phone: true,
        isVerified: true,
        role: true,
        createdAt: true,
      },
    })
  })
})
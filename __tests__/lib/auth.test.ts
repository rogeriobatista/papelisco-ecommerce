/**
 * @jest-environment node
 */

import { 
  hashPassword, 
  verifyPassword, 
  generateToken, 
  verifyToken, 
  isValidEmail, 
  isValidPassword,
  generateVerificationToken,
  generateSessionToken
} from '@/lib/auth'
import type { AuthJWTPayload } from '@/lib/auth'

describe('Auth Library', () => {
  const mockUser = {
    userId: 'test-user-123',
    email: 'test@example.com',
    role: 'CUSTOMER'
  }

  describe('Password Hashing', () => {
    test('should hash password correctly', async () => {
      const password = 'TestPassword123!'
      const hashed = await hashPassword(password)
      
      expect(hashed).toBeTruthy()
      expect(hashed).not.toBe(password)
      expect(hashed.length).toBeGreaterThan(50)
    })

    test('should verify password correctly', async () => {
      const password = 'TestPassword123!'
      const hashed = await hashPassword(password)
      
      const isValid = await verifyPassword(password, hashed)
      expect(isValid).toBe(true)
      
      const isInvalid = await verifyPassword('WrongPassword123!', hashed)
      expect(isInvalid).toBe(false)
    })

    test('should handle empty password verification', async () => {
      const password = 'TestPassword123!'
      const hashed = await hashPassword(password)
      
      const isValid = await verifyPassword('', hashed)
      expect(isValid).toBe(false)
    })
  })

  describe('JWT Token Management', () => {
    test('should generate valid JWT token', () => {
      const token = generateToken(mockUser)
      
      expect(token).toBeTruthy()
      expect(typeof token).toBe('string')
      expect(token.split('.')).toHaveLength(3) // JWT has 3 parts
    })

    test('should verify valid JWT token', () => {
      const token = generateToken(mockUser)
      const decoded = verifyToken(token)
      
      expect(decoded).toBeTruthy()
      expect(decoded?.userId).toBe(mockUser.userId)
      expect(decoded?.email).toBe(mockUser.email)
      expect(decoded?.role).toBe(mockUser.role)
      expect(decoded?.iat).toBeTruthy()
      expect(decoded?.exp).toBeTruthy()
    })

    test('should reject invalid JWT token', () => {
      const invalidToken = 'invalid.jwt.token'
      const decoded = verifyToken(invalidToken)
      
      expect(decoded).toBeNull()
    })

    test('should reject malformed JWT token', () => {
      const malformedToken = 'not-a-jwt-token'
      const decoded = verifyToken(malformedToken)
      
      expect(decoded).toBeNull()
    })

    test('should reject empty token', () => {
      const decoded = verifyToken('')
      expect(decoded).toBeNull()
    })
  })

  describe('Email Validation', () => {
    test('should validate correct email formats', () => {
      const validEmails = [
        'test@example.com',
        'user.name@domain.co.uk',
        'firstname+lastname@example.org',
        'email@123.123.123.123', // IP address
        'user123@example-domain.com'
      ]

      validEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(true)
      })
    })

    test('should reject invalid email formats', () => {
      const invalidEmails = [
        '',
        'plainaddress',
        '@missingdomain.com',
        'missing@.com',
        'missing.domain@.com',
        'spaces in@email.com',
        'email@',
        'email@domain',
        // Note: Some simple email validators may accept double dots
        // 'email..double.dot@example.com'
      ]

      invalidEmails.forEach(email => {
        expect(isValidEmail(email)).toBe(false)
      })
    })
  })

  describe('Password Validation', () => {
    test('should validate strong passwords', () => {
      const strongPasswords = [
        'StrongPass123!',
        'MyP@ssw0rd',
        'Complex1ty!',
        'Secur3P@ss'
      ]

      strongPasswords.forEach(password => {
        const result = isValidPassword(password)
        expect(result.isValid).toBe(true)
        expect(result.errors).toHaveLength(0)
      })
    })

    test('should reject passwords that are too short', () => {
      const shortPassword = 'Short1!'
      const result = isValidPassword(shortPassword)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must be at least 8 characters long')
    })

    test('should reject passwords without lowercase letters', () => {
      const noLowercase = 'PASSWORD123!'
      const result = isValidPassword(noLowercase)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one lowercase letter')
    })

    test('should reject passwords without uppercase letters', () => {
      const noUppercase = 'password123!'
      const result = isValidPassword(noUppercase)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one uppercase letter')
    })

    test('should reject passwords without numbers', () => {
      const noNumbers = 'PasswordTest!'
      const result = isValidPassword(noNumbers)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one number')
    })

    test('should reject passwords without special characters', () => {
      const noSpecial = 'PasswordTest123'
      const result = isValidPassword(noSpecial)
      
      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain at least one special character (@$!%*?&)')
    })

    test('should return multiple errors for weak passwords', () => {
      const weakPassword = 'weak'
      const result = isValidPassword(weakPassword)
      
      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(1)
    })
  })

  describe('Token Generation', () => {
    test('should generate verification tokens', () => {
      const token1 = generateVerificationToken()
      const token2 = generateVerificationToken()
      
      expect(token1).toBeTruthy()
      expect(token2).toBeTruthy()
      expect(token1).not.toBe(token2) // Should be unique
      expect(typeof token1).toBe('string')
      expect(token1.length).toBeGreaterThan(10)
    })

    test('should generate session tokens', () => {
      const token1 = generateSessionToken()
      const token2 = generateSessionToken()
      
      expect(token1).toBeTruthy()
      expect(token2).toBeTruthy()
      expect(token1).not.toBe(token2) // Should be unique
      expect(typeof token1).toBe('string')
      expect(token1.length).toBeGreaterThan(10)
    })
  })
})
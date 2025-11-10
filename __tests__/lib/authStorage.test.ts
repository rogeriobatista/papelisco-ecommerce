/**
 * @jest-environment jsdom
 */

import { tokenStorage, authenticatedFetch } from '@/lib/authStorage'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

describe('Auth Storage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    jest.clearAllMocks()
    // Mock successful fetch response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
      headers: new Headers(),
      status: 200,
      statusText: 'OK',
    })
  })

  describe('Token Management', () => {
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token'

    test('should store token in localStorage', () => {
      tokenStorage.setToken(testToken)
      expect(localStorage.setItem).toHaveBeenCalledWith('auth-token', testToken)
    })

    test('should retrieve token from localStorage', () => {
      localStorage.setItem('auth-token', testToken)
      const retrievedToken = tokenStorage.getToken()
      expect(retrievedToken).toBe(testToken)
    })

    test('should remove token from localStorage', () => {
      localStorage.setItem('auth-token', testToken)
      tokenStorage.removeToken()
      expect(localStorage.removeItem).toHaveBeenCalledWith('auth-token')
    })

    test('should check if token exists', () => {
      // No token initially
      expect(tokenStorage.hasToken()).toBe(false)
      
      // Set token
      localStorage.setItem('auth-token', testToken)
      expect(tokenStorage.hasToken()).toBe(true)
      
      // Remove token
      localStorage.removeItem('auth-token')
      expect(tokenStorage.hasToken()).toBe(false)
    })

    test('should return null when no token exists', () => {
      const token = tokenStorage.getToken()
      expect(token).toBeNull()
    })
  })

  describe('Authorization Headers', () => {
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token'

    test('should get authorization header with token', () => {
      localStorage.setItem('auth-token', testToken)
      const authHeader = tokenStorage.getAuthHeader()
      expect(authHeader).toBe(`Bearer ${testToken}`)
    })

    test('should return null when no token for auth header', () => {
      const authHeader = tokenStorage.getAuthHeader()
      expect(authHeader).toBeNull()
    })

    test('should get auth headers with token', () => {
      localStorage.setItem('auth-token', testToken)
      const headers = tokenStorage.getAuthHeaders()
      
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`
      })
    })

    test('should get headers without authorization when no token', () => {
      const headers = tokenStorage.getAuthHeaders()
      
      expect(headers).toEqual({
        'Content-Type': 'application/json'
      })
    })
  })

  describe('Authenticated Fetch', () => {
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.token'
    const testUrl = '/api/test'

    test('should make fetch request with auth headers', async () => {
      localStorage.setItem('auth-token', testToken)
      
      await authenticatedFetch(testUrl)
      
      expect(mockFetch).toHaveBeenCalledWith(testUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testToken}`
        }
      })
    })

    test('should make fetch request without auth when no token', async () => {
      await authenticatedFetch(testUrl)
      
      expect(mockFetch).toHaveBeenCalledWith(testUrl, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
    })

    test('should merge custom headers with auth headers', async () => {
      localStorage.setItem('auth-token', testToken)
      const customHeaders = { 'X-Custom': 'value' }
      
      await authenticatedFetch(testUrl, { headers: customHeaders })
      
      expect(mockFetch).toHaveBeenCalledWith(testUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testToken}`,
          'X-Custom': 'value'
        }
      })
    })

    test('should pass through other fetch options', async () => {
      localStorage.setItem('auth-token', testToken)
      
      await authenticatedFetch(testUrl, {
        method: 'POST',
        body: JSON.stringify({ data: 'test' })
      })
      
      expect(mockFetch).toHaveBeenCalledWith(testUrl, {
        method: 'POST',
        body: JSON.stringify({ data: 'test' }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${testToken}`
        }
      })
    })

    test('should override content-type with custom headers', async () => {
      localStorage.setItem('auth-token', testToken)
      
      await authenticatedFetch(testUrl, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      expect(mockFetch).toHaveBeenCalledWith(testUrl, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${testToken}`
        }
      })
    })
  })
})
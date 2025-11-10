/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import '@testing-library/jest-dom'
import InternalHeader from '@/components/InternalHeader'
import authReducer from '@/features/auth/authSlice'
import { tokenStorage, authenticatedFetch } from '@/lib/authStorage'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

// Mock authStorage
jest.mock('@/lib/authStorage', () => ({
  tokenStorage: {
    removeToken: jest.fn(),
  },
  authenticatedFetch: jest.fn(),
}))

const mockTokenStorage = tokenStorage as jest.Mocked<typeof tokenStorage>
const mockAuthenticatedFetch = authenticatedFetch as jest.MockedFunction<typeof authenticatedFetch>

// Create mock store
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
    },
    preloadedState: {
      auth: {
        user: null,
        isLoggedIn: false,
        isLoading: false,
        ...initialState,
      },
    },
  })
}

describe('InternalHeader Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthenticatedFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    } as Response)
  })

  const renderWithStore = (store: any) => {
    return render(
      <Provider store={store}>
        <InternalHeader />
      </Provider>
    )
  }

  test('should render header with logo and navigation when user is logged in', () => {
    const store = createMockStore({
      user: {
        id: 'user123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'CUSTOMER',
      },
    })

    renderWithStore(store)

    // Check for logo
    expect(screen.getByAltText('Papelisco')).toBeInTheDocument()
    
    // Check for navigation links
    expect(screen.getByRole('link', { name: /papelisco/i })).toHaveAttribute('href', '/')
    
    // Check for user info (component only shows first name)
    expect(screen.getByText(/welcome, john!/i)).toBeInTheDocument()
    
    // Check for logout button
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })

  test('should render header when user is not logged in', () => {
    const store = createMockStore()

    renderWithStore(store)

    // Logo should still be present
    expect(screen.getByAltText('Papelisco')).toBeInTheDocument()
    
    // User info should not be present
    expect(screen.queryByText(/john doe/i)).not.toBeInTheDocument()
  })

  test('should handle logout successfully', async () => {
    const store = createMockStore({
      user: {
        id: 'user123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'CUSTOMER',
      },
    })

    renderWithStore(store)

    const logoutButton = screen.getByRole('button', { name: /logout/i })
    fireEvent.click(logoutButton)

    await waitFor(() => {
      // Verify API call was made
      expect(mockAuthenticatedFetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
      })
      
      // Verify token was removed
      expect(mockTokenStorage.removeToken).toHaveBeenCalled()
      
      // Verify navigation to login page
      expect(mockPush).toHaveBeenCalledWith('/auth/login')
    })
  })

  test('should handle logout when API call fails', async () => {
    // Mock API failure
    mockAuthenticatedFetch.mockRejectedValue(new Error('API Error'))
    
    const store = createMockStore({
      user: {
        id: 'user123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'CUSTOMER',
      },
    })

    // Spy on console.error to suppress error log in test output
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    renderWithStore(store)

    const logoutButton = screen.getByRole('button', { name: /logout/i })
    fireEvent.click(logoutButton)

    await waitFor(() => {
      // Verify API call was attempted
      expect(mockAuthenticatedFetch).toHaveBeenCalledWith('/api/auth/logout', {
        method: 'POST',
      })
      
      // Even if API fails, token should be removed locally
      expect(mockTokenStorage.removeToken).toHaveBeenCalled()
      
      // Verify navigation to login page still happens
      expect(mockPush).toHaveBeenCalledWith('/auth/login')
      
      // Verify error was logged
      expect(consoleErrorSpy).toHaveBeenCalledWith('Logout error:', expect.any(Error))
    })

    consoleErrorSpy.mockRestore()
  })

  test('should display user name correctly', () => {
    const store = createMockStore({
      user: {
        id: 'user123',
        email: 'jane.doe@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        role: 'ADMIN',
      },
    })

    renderWithStore(store)

    expect(screen.getByText(/welcome, jane!/i)).toBeInTheDocument()
  })

  test('should have correct navigation links', () => {
    const store = createMockStore({
      user: {
        id: 'user123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'CUSTOMER',
      },
    })

    renderWithStore(store)

    const homeLink = screen.getByRole('link', { name: /papelisco/i })
    expect(homeLink).toHaveAttribute('href', '/')
  })

  test('should render with correct styling', () => {
    const store = createMockStore({
      user: {
        id: 'user123',
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe',
        role: 'CUSTOMER',
      },
    })

    const { container } = renderWithStore(store)
    const header = container.querySelector('header')

    expect(header).toHaveStyle({
      background: 'var(--ctp-surface0)',
      borderBottom: '1px solid var(--ctp-surface1)',
      padding: '1rem 2rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    })
  })

  test('should handle missing user gracefully', () => {
    const store = createMockStore({
      user: null,
    })

    renderWithStore(store)

    // Should not crash and should render basic header elements
    expect(screen.getByAltText('Papelisco')).toBeInTheDocument()
    // Logout button is always rendered in this component
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
    // But there should be no welcome message without user
    expect(screen.queryByText(/welcome/i)).not.toBeInTheDocument()
  })
})
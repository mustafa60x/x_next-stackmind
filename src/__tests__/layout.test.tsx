import { render, screen, act, waitFor } from '@testing-library/react'
import RootLayout from '../app/layout'

// Extend jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R
      toHaveAttribute(attr: string, value?: string): R
      toHaveClass(...classNames: string[]): R
    }
  }
}

// Mock next/font/google
jest.mock('next/font/google', () => ({
  Geist: () => ({
    variable: 'mocked-geist-sans',
  }),
  Geist_Mono: () => ({
    variable: 'mocked-geist-mono',
  }),
}))

// Mock the auth store
jest.mock('../stores/auth', () => ({
  useAuthStore: jest.fn(() => ({
    user: null,
    setUser: jest.fn(),
  })),
}))

// Mock the theme store
jest.mock('../stores/theme', () => ({
  useThemeStore: jest.fn(() => ({
    isDarkMode: false,
    toggleDarkMode: jest.fn(),
  })),
}))

describe('RootLayout', () => {
  it('renders children correctly', async () => {
    const testContent = 'Test Content'
    
    await act(async () => {
      render(<RootLayout>{testContent}</RootLayout>)
    })

    await waitFor(() => {
      expect(screen.getByText(testContent)).toBeInTheDocument()
    })
  })

  it('includes required providers', async () => {
    await act(async () => {
      render(<RootLayout>Test</RootLayout>)
    })

    // Check if the HTML structure is correct
    const html = document.querySelector('html')
    expect(html).toHaveAttribute('lang', 'en')
    
    // Check if the body has the correct classes
    const body = document.querySelector('body')
    expect(body).toHaveClass('mocked-geist-sans')
    expect(body).toHaveClass('mocked-geist-mono')
    expect(body).toHaveClass('antialiased')
  })
})

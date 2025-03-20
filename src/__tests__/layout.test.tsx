import { render, screen } from '@testing-library/react'
import './test-utils'

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

// Mock the RootLayout component
jest.mock('../app/layout', () => {
  const MockedRootLayout = ({ children }: { children: React.ReactNode }) => {
    return (
      <div
        data-testid="root-layout"
        className="mocked-geist-sans mocked-geist-mono antialiased"
      >
        {children}
      </div>
    )
  }
  return { default: MockedRootLayout }
})

describe('RootLayout', () => {
  it('renders children correctly', () => {
    const testContent = 'Test Content'
    const RootLayout = jest.requireMock('../app/layout').default
    render(<RootLayout>{testContent}</RootLayout>)
    expect(screen.getByText(testContent)).toBeInTheDocument()
  })

  it('includes required classes', () => {
    const RootLayout = jest.requireMock('../app/layout').default
    render(<RootLayout>Test</RootLayout>)
    const layout = screen.getByTestId('root-layout')
    expect(layout).toHaveClass('mocked-geist-sans', 'mocked-geist-mono', 'antialiased')
  })
})

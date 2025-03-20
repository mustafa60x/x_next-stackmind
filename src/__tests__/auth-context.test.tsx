import { renderHook } from '@testing-library/react'
import { AuthProvider, useAuth } from '../context/auth-context'

// Mock next/navigation
const mockPathname = jest.fn()
jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

describe('AuthContext', () => {
  describe('AuthProvider', () => {
    it('provides isAuthPage as true for login page', () => {
      mockPathname.mockReturnValue('/login')
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )
      
      const { result } = renderHook(() => useAuth(), { wrapper })
      expect(result.current.isAuthPage).toBe(true)
    })

    it('provides isAuthPage as true for register page', () => {
      mockPathname.mockReturnValue('/register')
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )
      
      const { result } = renderHook(() => useAuth(), { wrapper })
      expect(result.current.isAuthPage).toBe(true)
    })

    it('provides isAuthPage as false for other pages', () => {
      mockPathname.mockReturnValue('/dashboard')
      
      const wrapper = ({ children }: { children: React.ReactNode }) => (
        <AuthProvider>{children}</AuthProvider>
      )
      
      const { result } = renderHook(() => useAuth(), { wrapper })
      expect(result.current.isAuthPage).toBe(false)
    })
  })

  describe('useAuth', () => {
    it('throws error when used outside AuthProvider', () => {
      try {
        renderHook(() => useAuth())
        fail('Expected an error to be thrown')
      } catch (error) {
        expect(error).toEqual(Error('useAuth must be used within an AuthProvider'))
      }
    })
  })
})

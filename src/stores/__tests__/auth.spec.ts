import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAuthStore } from '@/stores/auth'

// Mock the auth API module
vi.mock('@/api/auth', () => ({
  login: vi.fn().mockResolvedValue({
    access: 'mock-access-token',
    refresh: 'mock-refresh-token',
  }),
}))

describe('Auth Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('starts unauthenticated when no tokens in localStorage', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.accessToken).toBeNull()
    expect(store.refreshToken).toBeNull()
  })

  it('restores authentication from localStorage', () => {
    localStorage.setItem('access_token', 'existing-token')
    localStorage.setItem('refresh_token', 'existing-refresh')

    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(true)
    expect(store.accessToken).toBe('existing-token')
  })

  it('login stores tokens and sets authenticated', async () => {
    const store = useAuthStore()

    await store.login('demo', 'example123')

    expect(store.isAuthenticated).toBe(true)
    expect(store.accessToken).toBe('mock-access-token')
    expect(store.refreshToken).toBe('mock-refresh-token')
    expect(localStorage.getItem('access_token')).toBe('mock-access-token')
    expect(localStorage.getItem('refresh_token')).toBe('mock-refresh-token')
  })

  it('logout clears tokens and sets unauthenticated', async () => {
    const store = useAuthStore()
    await store.login('demo', 'example123')

    store.logout()

    expect(store.isAuthenticated).toBe(false)
    expect(store.accessToken).toBeNull()
    expect(store.refreshToken).toBeNull()
    expect(localStorage.getItem('access_token')).toBeNull()
    expect(localStorage.getItem('refresh_token')).toBeNull()
  })

  it('login propagates API errors', async () => {
    const { login: mockLogin } = await import('@/api/auth')
    vi.mocked(mockLogin).mockRejectedValueOnce(new Error('Invalid credentials'))

    const store = useAuthStore()
    await expect(store.login('wrong', 'wrong')).rejects.toThrow('Invalid credentials')
    expect(store.isAuthenticated).toBe(false)
  })
})

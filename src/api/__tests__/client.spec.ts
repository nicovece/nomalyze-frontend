import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import MockAdapter from 'axios-mock-adapter'
import axios from 'axios'

// The router has to be mocked BEFORE @/api/client is imported,
// because client.ts pulls the router at module evaluation time.
const { mockRouter, setCurrentRoute } = vi.hoisted(() => {
  const state = { fullPath: '/recipes', name: 'recipes' as string | null }
  return {
    mockRouter: {
      push: vi.fn(),
      currentRoute: { value: state },
    },
    setCurrentRoute(next: { fullPath: string; name: string | null }) {
      state.fullPath = next.fullPath
      state.name = next.name
    },
  }
})

vi.mock('@/router', () => ({ default: mockRouter }))

import apiClient from '@/api/client'
import { useAuthStore } from '@/stores/auth'

describe('apiClient interceptor', () => {
  let apiMock: MockAdapter
  let axiosMock: MockAdapter

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
    // MockAdapter intercepts requests on a specific axios instance.
    // apiClient is a separate instance from the default `axios`, and
    // the refresh call inside client.ts uses bare axios.post — so we
    // need both mocked.
    apiMock = new MockAdapter(apiClient)
    axiosMock = new MockAdapter(axios)
    mockRouter.push.mockClear()
    setCurrentRoute({ fullPath: '/recipes', name: 'recipes' })
  })

  afterEach(() => {
    apiMock.restore()
    axiosMock.restore()
  })

  it('attaches the Authorization header when an access token exists', async () => {
    const store = useAuthStore()
    store.setAccessToken('access-1')

    apiMock.onGet('/api/recipes/').reply((config) => {
      expect(config.headers?.Authorization).toBe('Bearer access-1')
      return [200, { results: [] }]
    })

    const { data } = await apiClient.get('/api/recipes/')
    expect(data.results).toEqual([])
  })

  it('omits the Authorization header when no access token is set', async () => {
    apiMock.onGet('/api/recipes/').reply((config) => {
      expect(config.headers?.Authorization).toBeUndefined()
      return [200, { results: [] }]
    })

    await apiClient.get('/api/recipes/')
  })

  it('on 401 with no refresh token: logs out and redirects to /login with destination', async () => {
    const store = useAuthStore()
    store.setAccessToken('expired')
    setCurrentRoute({ fullPath: '/recipes/42', name: 'recipe-detail' })

    apiMock.onGet('/api/recipes/42/').reply(401)

    await expect(apiClient.get('/api/recipes/42/')).rejects.toMatchObject({
      response: { status: 401 },
    })

    expect(store.isAuthenticated).toBe(false)
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: 'login',
      query: { redirect: '/recipes/42' },
    })
  })

  it('on 401 with a refresh token: refreshes and retries the original request', async () => {
    const store = useAuthStore()
    store.setTokens('expired-access', 'valid-refresh')

    let callCount = 0
    apiMock.onGet('/api/recipes/').reply(() => {
      callCount += 1
      if (callCount === 1) return [401]
      return [200, { results: ['ok'] }]
    })

    axiosMock.onPost(/\/api\/auth\/token\/refresh\/$/).reply(200, {
      access: 'new-access',
    })

    const { data } = await apiClient.get('/api/recipes/')

    expect(callCount).toBe(2)
    expect(store.accessToken).toBe('new-access')
    expect(data.results).toEqual(['ok'])
    expect(mockRouter.push).not.toHaveBeenCalled()
  })

  it('on 401 with a failing refresh: logs out and redirects', async () => {
    const store = useAuthStore()
    store.setTokens('expired-access', 'invalid-refresh')

    apiMock.onGet('/api/recipes/').reply(401)
    axiosMock.onPost(/\/api\/auth\/token\/refresh\/$/).reply(401)

    await expect(apiClient.get('/api/recipes/')).rejects.toBeDefined()

    expect(store.isAuthenticated).toBe(false)
    expect(mockRouter.push).toHaveBeenCalledWith({
      name: 'login',
      query: { redirect: '/recipes' },
    })
  })

  it('two concurrent 401s share a single refresh request (single-flight)', async () => {
    const store = useAuthStore()
    store.setTokens('expired-access', 'valid-refresh')

    apiMock.onGet('/api/recipes/').reply((config) => {
      const auth = config.headers?.Authorization
      if (auth === 'Bearer new-access') return [200, { results: ['ok'] }]
      return [401]
    })
    apiMock.onGet('/api/recipes/search/').reply((config) => {
      const auth = config.headers?.Authorization
      if (auth === 'Bearer new-access') return [200, { results: ['search-ok'] }]
      return [401]
    })

    let refreshCallCount = 0
    axiosMock.onPost(/\/api\/auth\/token\/refresh\/$/).reply(() => {
      refreshCallCount += 1
      return [200, { access: 'new-access' }]
    })

    const [a, b] = await Promise.all([
      apiClient.get('/api/recipes/'),
      apiClient.get('/api/recipes/search/'),
    ])

    expect(refreshCallCount).toBe(1)
    expect(a.data.results).toEqual(['ok'])
    expect(b.data.results).toEqual(['search-ok'])
  })

  it('does not include ?redirect when already on /login', async () => {
    setCurrentRoute({ fullPath: '/login', name: 'login' })
    const store = useAuthStore()
    store.setAccessToken('expired')

    apiMock.onGet('/api/recipes/').reply(401)

    await expect(apiClient.get('/api/recipes/')).rejects.toBeDefined()

    expect(mockRouter.push).toHaveBeenCalledWith({ name: 'login', query: undefined })
  })
})

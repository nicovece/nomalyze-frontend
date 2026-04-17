import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Module-level state for the single-flight refresh.
// If a refresh is in flight, all 401-handlers await this same promise
// instead of each starting their own — prevents SimpleJWT from invalidating
// the refresh token on the second concurrent call.
let refreshPromise: Promise<string> | null = null

/** Send the user to /login, preserving where they came from for post-login bounce-back. */
function redirectToLogin() {
  const currentPath = router.currentRoute.value.fullPath
  // Avoid ?redirect=/login if we're already on the login page.
  const isOnLogin = router.currentRoute.value.name === 'login'
  router.push({
    name: 'login',
    query: isOnLogin ? undefined : { redirect: currentPath },
  })
}

/** Refresh the access token, deduping concurrent calls into one network request. */
function refreshAccessToken(): Promise<string> {
  if (refreshPromise) {
    return refreshPromise
  }

  const authStore = useAuthStore()
  // Snapshot the refresh token — the same one must stay valid for the duration
  // of the POST below, and the store won't clear it until we resolve/reject.
  const refreshToken = authStore.refreshToken
  // Defensive guard: callers already pre-check, but keep this so the function
  // remains safe if ever invoked from a new call site without that pre-check.
  if (!refreshToken) {
    return Promise.reject(new Error('No refresh token available'))
  }

  refreshPromise = axios
    .post(`${apiClient.defaults.baseURL}/api/auth/token/refresh/`, {
      refresh: refreshToken,
    })
    .then(({ data }) => {
      const token = data.access
      if (typeof token !== 'string' || !token) {
        throw new Error('Refresh response missing access token')
      }
      authStore.setAccessToken(token)
      return token
    })
    .finally(() => {
      // Clear so the next genuine 401 (after a successful run) starts fresh
      refreshPromise = null
    })

  return refreshPromise
}

// Request interceptor — attach JWT access token to every request.
// `useAuthStore()` is called lazily inside the callback, not at module top level,
// because this module participates in a circular import (client → stores/auth →
// api/auth → client) and Pinia isn't installed until after app bootstrap.
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore()
  if (authStore.accessToken) {
    config.headers.Authorization = `Bearer ${authStore.accessToken}`
  }
  return config
})

// Response interceptor — handle 401 by refreshing the token
apiClient.interceptors.response.use(
  // Success — pass through
  (response) => response,

  // Error — check if it's a 401 we can recover from
  async (error) => {
    const originalRequest = error.config
    const authStore = useAuthStore()

    // Only attempt refresh once per request (prevent infinite loops)
    if (error.response?.status === 401 && !originalRequest._retried) {
      originalRequest._retried = true

      if (!authStore.refreshToken) {
        // No refresh token — user must log in
        authStore.logout()
        redirectToLogin()
        return Promise.reject(error)
      }

      try {
        const newAccessToken = await refreshAccessToken()
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch {
        // Refresh failed — session is truly expired
        authStore.logout()
        redirectToLogin()
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient

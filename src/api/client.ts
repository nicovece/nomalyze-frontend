import axios from 'axios'
import router from '@/router'
import { useAuthStore } from '@/stores/auth'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

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
        router.push({ name: 'login' })
        return Promise.reject(error)
      }

      try {
        // Request a new access token using the refresh token
        const { data } = await axios.post(
          `${apiClient.defaults.baseURL}/api/auth/token/refresh/`,
          { refresh: authStore.refreshToken },
        )

        authStore.setAccessToken(data.access)

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return apiClient(originalRequest)
      } catch {
        // Refresh failed — session is truly expired
        authStore.logout()
        router.push({ name: 'login' })
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient

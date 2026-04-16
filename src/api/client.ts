import axios from 'axios'
import router from '@/router'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor — attach JWT access token to every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
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

    // Only attempt refresh once per request (prevent infinite loops)
    if (error.response?.status === 401 && !originalRequest._retried) {
      originalRequest._retried = true

      const refreshToken = localStorage.getItem('refresh_token')
      if (!refreshToken) {
        // No refresh token — user must log in
        localStorage.removeItem('access_token')
        router.push({ name: 'login' })
        return Promise.reject(error)
      }

      try {
        // Request a new access token using the refresh token
        const { data } = await axios.post(
          `${apiClient.defaults.baseURL}/api/auth/token/refresh/`,
          { refresh: refreshToken },
        )

        localStorage.setItem('access_token', data.access)

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${data.access}`
        return apiClient(originalRequest)
      } catch {
        // Refresh failed — session is truly expired
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        router.push({ name: 'login' })
        return Promise.reject(error)
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient

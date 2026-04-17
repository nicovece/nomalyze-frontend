import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as apiLogin } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // State — reactive references, hydrated from localStorage on app load
  const accessToken = ref<string | null>(localStorage.getItem('access_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))

  // Getters
  const isAuthenticated = computed(() => !!accessToken.value)

  // Actions

  /** Persist a new access token to both reactive state and localStorage. */
  function setAccessToken(token: string) {
    accessToken.value = token
    localStorage.setItem('access_token', token)
  }

  /** Persist a new pair (used after login or any flow that issues both). */
  function setTokens(access: string, refresh: string) {
    accessToken.value = access
    refreshToken.value = refresh
    localStorage.setItem('access_token', access)
    localStorage.setItem('refresh_token', refresh)
  }

  async function login(username: string, password: string) {
    const tokens = await apiLogin(username, password)
    setTokens(tokens.access, tokens.refresh)
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  return {
    accessToken,
    refreshToken,
    isAuthenticated,
    setAccessToken,
    setTokens,
    login,
    logout,
  }
})

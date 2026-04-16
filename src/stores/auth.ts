import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as apiLogin } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  // State — reactive references
  const accessToken = ref<string | null>(localStorage.getItem('access_token'))
  const refreshToken = ref<string | null>(localStorage.getItem('refresh_token'))

  // Getters — computed properties derived from state
  const isAuthenticated = computed(() => !!accessToken.value)

  // Actions — functions that modify state
  async function login(username: string, password: string) {
    const tokens = await apiLogin(username, password)
    accessToken.value = tokens.access
    refreshToken.value = tokens.refresh
    localStorage.setItem('access_token', tokens.access)
    localStorage.setItem('refresh_token', tokens.refresh)
  }

  function logout() {
    accessToken.value = null
    refreshToken.value = null
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
  }

  return { accessToken, refreshToken, isAuthenticated, login, logout }
})

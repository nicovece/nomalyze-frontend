import apiClient from './client'
import type { AuthTokens } from '@/types/recipe'

export async function login(username: string, password: string): Promise<AuthTokens> {
  const { data } = await apiClient.post<AuthTokens>('/api/auth/token/', {
    username,
    password,
  })
  return data
}

export async function refreshAccessToken(refreshToken: string): Promise<{ access: string }> {
  const { data } = await apiClient.post<{ access: string }>(
    '/api/auth/token/refresh/',
    { refresh: refreshToken },
  )
  return data
}

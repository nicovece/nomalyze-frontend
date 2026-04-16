import apiClient from './client'
import type { Recipe, PaginatedResponse, SearchParams, SearchStats } from '@/types/recipe'

export async function getRecipes(page = 1): Promise<PaginatedResponse<Recipe>> {
  const { data } = await apiClient.get<PaginatedResponse<Recipe>>('/api/recipes/', {
    params: { page },
  })
  return data
}

export async function getRecipe(id: number): Promise<Recipe> {
  const { data } = await apiClient.get<Recipe>(`/api/recipes/${id}/`)
  return data
}

export async function searchRecipes(params: SearchParams): Promise<PaginatedResponse<Recipe>> {
  const { data } = await apiClient.get<PaginatedResponse<Recipe>>('/api/recipes/search/', {
    params,
  })
  return data
}

export async function getSearchStats(params: SearchParams): Promise<SearchStats> {
  const { data } = await apiClient.get<SearchStats>('/api/recipes/search/stats/', {
    params,
  })
  return data
}

export interface RecipeImage {
  original: string
  small: string
  medium: string
  large: string
}

export interface Recipe {
  id: number
  name: string
  short_description: string
  ingredients: string
  ingredients_list: string[]
  cooking_time: number
  difficulty: 'Easy' | 'Medium' | 'Intermediate' | 'Hard'
  likes: number
  references: string
  recipe_image: RecipeImage | null
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface SearchParams {
  name?: string
  ingredients?: string
  cooking_time_max?: number
  difficulty?: string
  show_all?: boolean
}

export interface SearchStats {
  cooking_times: { name: string; cooking_time: number }[]
  difficulty_distribution: Record<string, number>
  ingredient_time_data: { ingredient_count: number; cooking_time: number }[]
}

export interface AuthTokens {
  access: string
  refresh: string
}

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { searchRecipes, getSearchStats } from '@/api/recipes'
import SearchForm from '@/components/recipes/SearchForm.vue'
import SearchResults from '@/components/recipes/SearchResults.vue'
import CookingTimeBar from '@/components/charts/CookingTimeBar.vue'
import DifficultyPie from '@/components/charts/DifficultyPie.vue'
import IngredientTimeLine from '@/components/charts/IngredientTimeLine.vue'
import { useToastStore } from '@/stores/toast'
import type { Recipe, SearchParams, SearchStats } from '@/types/recipe'

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()

const recipes = ref<Recipe[]>([])
const stats = ref<SearchStats | null>(null)
const loading = ref(false)
const hasSearched = ref(false)

async function handleSearch(params: SearchParams) {
  loading.value = true
  hasSearched.value = true

  // Sync search params to URL query string
  const query: Record<string, string> = {}
  if (params.name) query.name = params.name
  if (params.ingredients) query.ingredients = params.ingredients
  if (params.cooking_time_max) query.cooking_time_max = String(params.cooking_time_max)
  if (params.difficulty) query.difficulty = params.difficulty
  if (params.show_all) query.show_all = 'true'
  router.replace({ query })

  try {
    const [recipeData, statsData] = await Promise.all([
      searchRecipes(params),
      getSearchStats(params),
    ])
    recipes.value = recipeData.results
    stats.value = statsData
  } catch {
    toastStore.showError('Search failed. Please try again.')
  } finally {
    loading.value = false
  }
}

// If URL has query params on mount (shared link), trigger search
const initialParams = route.query
if (initialParams.name || initialParams.ingredients || initialParams.cooking_time_max || initialParams.difficulty || initialParams.show_all) {
  handleSearch({
    name: initialParams.name as string | undefined,
    ingredients: initialParams.ingredients as string | undefined,
    cooking_time_max: initialParams.cooking_time_max ? Number(initialParams.cooking_time_max) : undefined,
    difficulty: initialParams.difficulty as string | undefined,
    show_all: initialParams.show_all === 'true' || undefined,
  })
}
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-8">
    <h1 class="font-serif text-3xl font-bold text-alternate-a-800">Search &amp; Analyze</h1>
    <p class="mt-1 text-alternate-a-700">
      Search with wildcards (* for any characters, ? for single character)
    </p>

    <div class="mt-6">
      <SearchForm @search="handleSearch" />
    </div>

    <!-- Loading -->
    <div v-if="loading" class="mt-8">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="n in 6"
          :key="n"
          class="h-72 animate-pulse rounded-lg bg-ground-a-100"
        />
      </div>
    </div>

    <!-- Results (only shown after a search) -->
    <template v-if="!loading && hasSearched">
      <!-- Charts -->
      <div v-if="stats" class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <CookingTimeBar :data="stats.cooking_times" />
        <DifficultyPie :data="stats.difficulty_distribution" />
        <IngredientTimeLine :data="stats.ingredient_time_data" />
      </div>

      <div class="mt-8">
        <SearchResults :recipes="recipes" />
      </div>
    </template>
  </main>
</template>

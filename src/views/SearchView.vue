<script setup lang="ts">
import { ref, watch, defineAsyncComponent } from 'vue'
import { useRouter, useRoute, type LocationQuery } from 'vue-router'
import { searchRecipes, getSearchStats } from '@/api/recipes'
import SearchForm from '@/components/recipes/SearchForm.vue'
import SearchResults from '@/components/recipes/SearchResults.vue'
const CookingTimeBar = defineAsyncComponent(
  () => import('@/components/charts/CookingTimeBar.vue'),
)
const DifficultyPie = defineAsyncComponent(
  () => import('@/components/charts/DifficultyPie.vue'),
)
const IngredientTimeLine = defineAsyncComponent(
  () => import('@/components/charts/IngredientTimeLine.vue'),
)
import { useToastStore } from '@/stores/toast'
import type { Recipe, SearchParams, SearchStats } from '@/types/recipe'

const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()

const recipes = ref<Recipe[]>([])
const stats = ref<SearchStats | null>(null)
const loading = ref(false)
const hasSearched = ref(false)

// Read the URL and convert to typed SearchParams. Unknown / malformed
// values become `undefined` (never coerce NaN or "false" literals).
function queryToParams(q: LocationQuery): SearchParams {
  const time = typeof q.cooking_time_max === 'string' ? Number(q.cooking_time_max) : NaN
  return {
    name: typeof q.name === 'string' ? q.name : undefined,
    ingredients: typeof q.ingredients === 'string' ? q.ingredients : undefined,
    cooking_time_max: Number.isFinite(time) ? time : undefined,
    difficulty: typeof q.difficulty === 'string' ? q.difficulty : undefined,
    show_all: q.show_all === 'true' || undefined,
  }
}

function paramsToQuery(p: SearchParams): Record<string, string> {
  const q: Record<string, string> = {}
  if (p.name) q.name = p.name
  if (p.ingredients) q.ingredients = p.ingredients
  if (p.cooking_time_max) q.cooking_time_max = String(p.cooking_time_max)
  if (p.difficulty) q.difficulty = p.difficulty
  if (p.show_all) q.show_all = 'true'
  return q
}

function hasAnySearchParam(p: SearchParams): boolean {
  return Boolean(
    p.name || p.ingredients || p.cooking_time_max || p.difficulty || p.show_all,
  )
}

async function runSearch(params: SearchParams) {
  loading.value = true
  hasSearched.value = true
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

// Form submit updates the URL; the watch below handles the API call.
// Single source of truth: URL → search state.
function handleSearch(params: SearchParams) {
  router.replace({ query: paramsToQuery(params) })
}

watch(
  () => route.query,
  (q) => {
    const params = queryToParams(q)
    if (hasAnySearchParam(params)) {
      runSearch(params)
    }
  },
  { immediate: true },
)

// Initial form values come from the URL — passed as a prop so the inputs
// reflect ?name=pasta on a shared link. Recomputed on every URL change
// so Back/Forward keeps the form in sync with the results.
const initialFormValues = ref<SearchParams>(queryToParams(route.query))
watch(
  () => route.query,
  (q) => {
    initialFormValues.value = queryToParams(q)
  },
)
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-8">
    <h1 class="font-serif text-3xl font-bold text-alternate-a-800">Search &amp; Analyze</h1>
    <p class="mt-1 text-alternate-a-700">
      Search with wildcards (* for any characters, ? for single character)
    </p>

    <div class="mt-6">
      <SearchForm :initial-values="initialFormValues" @search="handleSearch" />
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

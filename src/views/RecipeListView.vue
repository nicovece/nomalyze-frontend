<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRecipes } from '@/api/recipes'
import RecipeCard from '@/components/recipes/RecipeCard.vue'
import AppToast from '@/components/layout/AppToast.vue'
import type { Recipe } from '@/types/recipe'

const recipes = ref<Recipe[]>([])
const loading = ref(true)
const error = ref('')
const currentPage = ref(1)
const totalCount = ref(0)
const hasNext = ref(false)
const hasPrevious = ref(false)

async function fetchRecipes(page: number) {
  loading.value = true
  error.value = ''

  try {
    const data = await getRecipes(page)
    recipes.value = data.results
    totalCount.value = data.count
    hasNext.value = !!data.next
    hasPrevious.value = !!data.previous
    currentPage.value = page
  } catch {
    error.value = 'Failed to load recipes. Please try again.'
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchRecipes(1))
</script>

<template>
  <main class="mx-auto max-w-6xl px-4 py-8">
    <h1 class="font-serif text-3xl font-bold text-alternate-a-800">Recipes</h1>
    <p class="mt-1 text-alternate-a-700">
      {{ totalCount }} recipe{{ totalCount !== 1 ? 's' : '' }} in the collection
    </p>

    <!-- Error toast -->
    <AppToast :message="error" type="error" @dismiss="error = ''" />

    <!-- Loading state -->
    <div v-if="loading" class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <div
        v-for="n in 6"
        :key="n"
        class="h-72 animate-pulse rounded-lg bg-ground-a-100"
      />
    </div>

    <!-- Empty state -->
    <div v-else-if="recipes.length === 0" class="mt-8 text-center text-alternate-a-700">
      No recipes found.
    </div>

    <!-- Recipe grid -->
    <template v-else>
      <div class="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <RecipeCard
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe="recipe"
        />
      </div>

      <!-- Pagination -->
      <div v-if="hasNext || hasPrevious" class="mt-8 flex items-center justify-center gap-4">
        <button
          :disabled="!hasPrevious"
          class="rounded-md bg-alternate-a-400 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-alternate-a-500 disabled:opacity-40"
          @click="fetchRecipes(currentPage - 1)"
        >
          Previous
        </button>
        <span class="text-sm text-alternate-a-700">Page {{ currentPage }}</span>
        <button
          :disabled="!hasNext"
          class="rounded-md bg-alternate-a-400 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-alternate-a-500 disabled:opacity-40"
          @click="fetchRecipes(currentPage + 1)"
        >
          Next
        </button>
      </div>
    </template>
  </main>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import type { SearchParams } from '@/types/recipe'

const props = defineProps<{
  initialValues?: SearchParams
}>()

const emit = defineEmits<{
  search: [params: SearchParams]
}>()

const name = ref('')
const ingredients = ref('')
const cookingTimeMax = ref<number | undefined>()
const difficulty = ref('')

// Keep inputs in sync with the URL-driven initial values. The parent
// recomputes `initialValues` on every route.query change so Back/Forward
// navigation repopulates the form too.
watch(
  () => props.initialValues,
  (vals) => {
    name.value = vals?.name ?? ''
    ingredients.value = vals?.ingredients ?? ''
    cookingTimeMax.value = vals?.cooking_time_max
    difficulty.value = vals?.difficulty ?? ''
  },
  { immediate: true },
)

function handleSearch() {
  emit('search', {
    name: name.value || undefined,
    ingredients: ingredients.value || undefined,
    cooking_time_max: cookingTimeMax.value || undefined,
    difficulty: difficulty.value || undefined,
  })
}

function handleShowAll() {
  name.value = ''
  ingredients.value = ''
  cookingTimeMax.value = undefined
  difficulty.value = ''
  emit('search', { show_all: true })
}
</script>

<template>
  <form @submit.prevent="handleSearch" class="rounded-lg bg-white p-6 shadow-md">
    <h2 class="font-serif text-xl font-semibold text-alternate-a-800">Search Recipes</h2>

    <div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div>
        <label for="search-name" class="mb-1 block text-sm font-medium text-alternate-a-700">
          Recipe Name
        </label>
        <input
          id="search-name"
          v-model="name"
          type="text"
          placeholder="e.g. pasta* or ch?cken"
          class="w-full rounded-md border border-ground-a-300 px-3 py-2 text-sm focus:border-accent-400 focus:ring-1 focus:ring-accent-400 focus:outline-none"
        />
      </div>

      <div>
        <label for="search-ingredients" class="mb-1 block text-sm font-medium text-alternate-a-700">
          Ingredients
        </label>
        <input
          id="search-ingredients"
          v-model="ingredients"
          type="text"
          placeholder="e.g. tomato, cheese"
          class="w-full rounded-md border border-ground-a-300 px-3 py-2 text-sm focus:border-accent-400 focus:ring-1 focus:ring-accent-400 focus:outline-none"
        />
      </div>

      <div>
        <label for="search-time" class="mb-1 block text-sm font-medium text-alternate-a-700">
          Max Cooking Time (min)
        </label>
        <input
          id="search-time"
          v-model.number="cookingTimeMax"
          type="number"
          min="1"
          max="1440"
          placeholder="e.g. 30"
          class="w-full rounded-md border border-ground-a-300 px-3 py-2 text-sm focus:border-accent-400 focus:ring-1 focus:ring-accent-400 focus:outline-none"
        />
      </div>

      <div>
        <label for="search-difficulty" class="mb-1 block text-sm font-medium text-alternate-a-700">
          Difficulty
        </label>
        <select
          id="search-difficulty"
          v-model="difficulty"
          class="w-full rounded-md border border-ground-a-300 px-3 py-2 text-sm focus:border-accent-400 focus:ring-1 focus:ring-accent-400 focus:outline-none"
        >
          <option value="">Any</option>
          <option>Easy</option>
          <option>Medium</option>
          <option>Intermediate</option>
          <option>Hard</option>
        </select>
      </div>
    </div>

    <div class="mt-6 flex gap-3">
      <button
        type="submit"
        class="rounded-md bg-accent-400 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-600"
      >
        Search &amp; Analyze
      </button>
      <button
        type="button"
        class="rounded-md border border-alternate-a-400 px-5 py-2 text-sm font-semibold text-alternate-a-400 transition-colors hover:bg-alternate-a-100"
        @click="handleShowAll"
      >
        Analyze All Recipes
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import RecipeCard from '@/components/recipes/RecipeCard.vue'
import type { Recipe } from '@/types/recipe'

defineProps<{
  recipes: Recipe[]
}>()
</script>

<template>
  <div v-if="recipes.length === 0" class="rounded-lg bg-white p-8 text-center shadow-md">
    <p class="text-alternate-a-700">No recipes match your search.</p>
  </div>

  <div v-else>
    <p class="mb-4 text-sm text-alternate-a-700">
      {{ recipes.length }} recipe{{ recipes.length !== 1 ? 's' : '' }} found
    </p>
    <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <RecipeCard
        v-for="recipe in recipes"
        :key="recipe.id"
        :recipe="recipe"
      />
    </div>
  </div>
</template>

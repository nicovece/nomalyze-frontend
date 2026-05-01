<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { Recipe } from '@/types/recipe'
import { difficultyTextClass } from '@/utils/difficulty'

defineProps<{
  recipe: Recipe
}>()
</script>

<template>
  <RouterLink
    :to="{ name: 'recipe-detail', params: { id: recipe.id } }"
    class="group block overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg"
  >
    <div class="aspect-[4/3] overflow-hidden bg-ground-a-100">
      <img
        v-if="recipe.recipe_image"
        :src="recipe.recipe_image.medium"
        :srcset="`${recipe.recipe_image.small} 400w, ${recipe.recipe_image.medium} 800w, ${recipe.recipe_image.large} 1200w`"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        loading="lazy"
        decoding="async"
        :alt="recipe.name"
        class="h-full w-full object-cover transition-transform group-hover:scale-105"
      />
    </div>

    <div class="p-4">
      <h3 class="font-serif text-lg font-semibold text-alternate-a-800">
        {{ recipe.name }}
      </h3>

      <p v-if="recipe.short_description" class="mt-1 line-clamp-2 text-sm text-alternate-a-700">
        {{ recipe.short_description }}
      </p>

      <div class="mt-3 flex items-center justify-between">
        <span class="text-sm text-alternate-a-700">
          {{ recipe.cooking_time }} min
        </span>
        <span
          :class="difficultyTextClass[recipe.difficulty]"
          class="rounded-full px-2 py-0.5 text-xs font-medium"
        >
          {{ recipe.difficulty }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>

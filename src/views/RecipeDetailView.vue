<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getRecipe } from '@/api/recipes'
import type { Recipe } from '@/types/recipe'
import { difficultyTextClass } from '@/utils/difficulty'

const route = useRoute()
const router = useRouter()

const recipe = ref<Recipe | null>(null)
const loading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    const id = Number(route.params.id)
    recipe.value = await getRecipe(id)
  } catch {
    error.value = 'Recipe not found.'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <main class="mx-auto max-w-4xl px-4 py-8">
    <!-- Back link -->
    <button
      @click="router.back()"
      class="mb-6 text-sm text-alternate-a-400 transition-colors hover:text-alternate-a-500"
    >
      &larr; Back
    </button>

    <!-- Loading skeleton -->
    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="aspect-[16/9] rounded-lg bg-ground-a-100" />
      <div class="h-8 w-2/3 rounded bg-ground-a-100" />
      <div class="h-4 w-1/3 rounded bg-ground-a-100" />
      <div class="h-24 rounded bg-ground-a-100" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="rounded-md bg-red-50 p-4 text-red-700">
      {{ error }}
    </div>

    <!-- Recipe detail -->
    <article v-else-if="recipe">
      <img
        v-if="recipe.recipe_image"
        :src="recipe.recipe_image.large"
        :srcset="`${recipe.recipe_image.medium} 800w, ${recipe.recipe_image.large} 1200w`"
        sizes="(min-width: 1024px) 800px, 100vw"
        loading="eager"
        decoding="async"
        :alt="recipe.name"
        class="aspect-[16/9] w-full rounded-lg object-cover"
      />

      <h1 class="mt-6 font-serif text-4xl font-bold text-alternate-a-800">
        {{ recipe.name }}
      </h1>

      <div class="mt-3 flex items-center gap-4 text-sm text-alternate-a-700">
        <span>{{ recipe.cooking_time }} minutes</span>
        <span
          :class="difficultyTextClass[recipe.difficulty]"
          class="rounded-full px-2 py-0.5 text-xs font-medium"
        >
          {{ recipe.difficulty }}
        </span>
      </div>

      <p v-if="recipe.short_description" class="mt-4 text-lg leading-relaxed text-alternate-a-700">
        {{ recipe.short_description }}
      </p>

      <section class="mt-8">
        <h2 class="font-serif text-2xl font-semibold text-alternate-a-800">Ingredients</h2>
        <ul class="mt-3 list-inside list-disc space-y-1 text-alternate-a-700">
          <li v-for="ingredient in recipe.ingredients_list" :key="ingredient">
            {{ ingredient }}
          </li>
        </ul>
      </section>

      <a
        v-if="recipe.references"
        :href="recipe.references"
        target="_blank"
        rel="noopener noreferrer"
        class="mt-8 inline-block text-sm text-accent-400 underline transition-colors hover:text-accent-600"
      >
        View original recipe &rarr;
      </a>
    </article>
  </main>
</template>

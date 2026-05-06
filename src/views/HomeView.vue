<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { onMounted, onUnmounted } from 'vue'

const authStore = useAuthStore()

const bodyClass = 'home-page'
onMounted(() => {
  document.body.classList.add(bodyClass)
})
onUnmounted(() => {
  document.body.classList.remove(bodyClass)
})
</script>

<template>
  <main class="flex flex-col items-center justify-center px-4 py-24 text-center min-h-full">
    <h1 class="font-serif text-5xl font-bold text-white">Nomalyze</h1>
    <p class="mt-4 max-w-lg text-lg text-white">
      Recipe management and analytics. Search, filter, and visualize your recipe collection.
    </p>

    <div class="mt-8 flex gap-4">
      <RouterLink
        v-if="authStore.isAuthenticated"
        to="/recipes"
        class="rounded-md bg-accent-400 px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-600"
      >
        Browse Recipes
      </RouterLink>

      <template v-else>
        <RouterLink
          to="/login"
          class="rounded-md bg-accent-400 px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-600"
        >
          Sign In
        </RouterLink>
        <RouterLink
          to="/about"
          class="rounded-md border border-alternate-a-400 px-6 py-3 font-semibold text-alternate-a-400 transition-colors hover:bg-alternate-a-100"
        >
          Learn More
        </RouterLink>
      </template>
    </div>
  </main>
</template>

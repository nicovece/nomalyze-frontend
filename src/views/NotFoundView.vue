<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <main class="flex flex-col items-center justify-center px-4 py-24 text-center">
    <h1 class="font-serif text-6xl font-bold text-ground-a-400">404</h1>
    <p class="mt-4 text-lg text-alternate-a-700">Page not found.</p>
    <RouterLink
      to="/"
      class="mt-6 rounded-md bg-accent-400 px-6 py-3 font-semibold text-white transition-colors hover:bg-accent-600"
    >
      Back to Home
    </RouterLink>
  </main>
</template>

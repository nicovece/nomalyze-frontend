<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <div class="min-h-screen bg-ground-a-50">
    <nav class="bg-alternate-a-800 text-white shadow-md">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <RouterLink to="/" class="font-serif text-xl font-bold tracking-wide">
          Nomalyze
        </RouterLink>

        <div class="flex items-center gap-6 text-sm">
          <RouterLink to="/" class="transition-colors hover:text-ground-a-200">
            Home
          </RouterLink>
          <RouterLink to="/about" class="transition-colors hover:text-ground-a-200">
            About
          </RouterLink>

          <template v-if="authStore.isAuthenticated">
            <RouterLink to="/recipes" class="transition-colors hover:text-ground-a-200">
              Recipes
            </RouterLink>
            <RouterLink to="/search" class="transition-colors hover:text-ground-a-200">
              Search
            </RouterLink>
            <button
              @click="authStore.logout()"
              class="rounded-md bg-accent-400 px-3 py-1 transition-colors hover:bg-accent-600"
            >
              Logout
            </button>
          </template>

          <RouterLink
            v-else
            to="/login"
            class="rounded-md bg-accent-400 px-3 py-1 transition-colors hover:bg-accent-600"
          >
            Sign In
          </RouterLink>
        </div>
      </div>
    </nav>

    <RouterView />
  </div>
</template>

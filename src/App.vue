<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const mobileMenuOpen = ref(false)

function logout() {
  authStore.logout()
  mobileMenuOpen.value = false
  router.push({ name: 'home' })
}
</script>

<template>
  <div class="min-h-screen bg-ground-a-50">
    <nav class="bg-alternate-a-800 text-white shadow-md">
      <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <RouterLink to="/" class="font-serif text-xl font-bold tracking-wide">
          Nomalyze
        </RouterLink>

        <!-- Mobile menu button -->
        <button
          class="sm:hidden"
          @click="mobileMenuOpen = !mobileMenuOpen"
          :aria-expanded="mobileMenuOpen"
          aria-label="Toggle menu"
        >
          <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              v-if="!mobileMenuOpen"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path
              v-else
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Desktop nav -->
        <div class="hidden items-center gap-6 text-sm sm:flex">
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
              @click="logout"
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

      <!-- Mobile nav -->
      <div
        v-if="mobileMenuOpen"
        class="border-t border-alternate-a-700 px-4 pb-4 pt-2 sm:hidden"
      >
        <div class="flex flex-col gap-3 text-sm">
          <RouterLink to="/" @click="mobileMenuOpen = false">Home</RouterLink>
          <RouterLink to="/about" @click="mobileMenuOpen = false">About</RouterLink>

          <template v-if="authStore.isAuthenticated">
            <RouterLink to="/recipes" @click="mobileMenuOpen = false">Recipes</RouterLink>
            <RouterLink to="/search" @click="mobileMenuOpen = false">Search</RouterLink>
            <button @click="logout" class="text-left">Logout</button>
          </template>

          <RouterLink v-else to="/login" @click="mobileMenuOpen = false">
            Sign In
          </RouterLink>
        </div>
      </div>
    </nav>

    <RouterView v-slot="{ Component }">
      <Transition name="page" mode="out-in">
        <component :is="Component" />
      </Transition>
    </RouterView>
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: opacity 0.15s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>

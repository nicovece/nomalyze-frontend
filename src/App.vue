<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRouter, useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'
import AppToast from '@/components/layout/AppToast.vue'

const authStore = useAuthStore()
const toastStore = useToastStore()
const { message: toastMessage, type: toastType } = storeToRefs(toastStore)
const router = useRouter()
const mobileMenuOpen = ref(false)
const route = useRoute()
const isHomePage = computed(() => route.name === 'home')
function logout() {
  authStore.logout()
  mobileMenuOpen.value = false
  router.push({ name: 'home' })
}
</script>

<template>
  <div :class="{ 'home-page': isHomePage }">
    <div class="min-h-screen" :class="{ 'bg-black/50 home-page-content': isHomePage }">
      <nav class="bg-alternate-a-800 text-white shadow-md">
        <div class="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <RouterLink to="/" class="font-serif text-xl font-bold tracking-wide">
            Nomalyze
          </RouterLink>

          <!-- Mobile menu button -->
          <button
            class="cursor-pointer sm:hidden"
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
            <template v-if="authStore.isAuthenticated">
              <RouterLink to="/analyze-search" class="transition-colors hover:text-ground-a-200">
                Analyze &amp; Search
              </RouterLink>
              <RouterLink to="/recipes" class="transition-colors hover:text-ground-a-200">
                Recipes
              </RouterLink>
              <RouterLink to="/about" class="transition-colors hover:text-ground-a-200">
                About
              </RouterLink>
              <button
                @click="logout"
                class="cursor-pointer rounded-md bg-accent-400 px-3 py-1 transition-colors hover:bg-accent-600"
              >
                Logout
              </button>
            </template>

            <template v-else>
              <RouterLink to="/about" class="transition-colors hover:text-ground-a-200">
                About
              </RouterLink>
              <RouterLink
                to="/login"
                class="rounded-md bg-accent-400 px-3 py-1 transition-colors hover:bg-accent-600"
              >
                Sign In
              </RouterLink>
            </template>
          </div>
        </div>

        <!-- Mobile nav -->
        <div v-if="mobileMenuOpen" class="border-t border-alternate-a-700 px-4 pb-4 pt-2 sm:hidden">
          <div class="flex flex-col gap-3 text-sm">
            <template v-if="authStore.isAuthenticated">
              <RouterLink to="/analyze-search" @click="mobileMenuOpen = false">
                Analyze &amp; Search
              </RouterLink>
              <RouterLink to="/recipes" @click="mobileMenuOpen = false">Recipes</RouterLink>
              <RouterLink to="/about" @click="mobileMenuOpen = false">About</RouterLink>
              <button @click="logout" class="cursor-pointer text-left">Logout</button>
            </template>

            <template v-else>
              <RouterLink to="/about" @click="mobileMenuOpen = false">About</RouterLink>
              <RouterLink to="/login" @click="mobileMenuOpen = false"> Sign In </RouterLink>
            </template>
          </div>
        </div>
      </nav>

      <RouterView v-slot="{ Component }">
        <Transition name="page" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>

      <AppToast :message="toastMessage" :type="toastType" @dismiss="toastStore.dismiss()" />
    </div>
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
.home-page {
  background-image: url('@/assets/images/backgrounds/jez-timms-BHD2OxkYGSk-unsplash.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
.home-page-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  nav {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
  }
}
</style>

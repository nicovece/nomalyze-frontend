<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToastStore } from '@/stores/toast'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const toastStore = useToastStore()

const username = ref('')
const password = ref('')
const loading = ref(false)

async function handleLogin() {
  loading.value = true

  try {
    await authStore.login(username.value, password.value)
    const redirect = (route.query.redirect as string) || '/recipes'
    router.push(redirect)
  } catch {
    toastStore.showError('Invalid username or password.')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-ground-a-50">
    <div class="w-full max-w-md rounded-lg bg-white p-8 shadow-lg">
      <h1 class="mb-6 text-center font-serif text-3xl font-bold text-alternate-a-800">
        Sign In
      </h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label for="username" class="mb-1 block text-sm font-medium text-alternate-a-700">
            Username
          </label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            autocomplete="username"
            class="w-full rounded-md border border-ground-a-300 px-3 py-2 focus:border-accent-400 focus:ring-1 focus:ring-accent-400 focus:outline-none"
          />
        </div>

        <div>
          <label for="password" class="mb-1 block text-sm font-medium text-alternate-a-700">
            Password
          </label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="w-full rounded-md border border-ground-a-300 px-3 py-2 focus:border-accent-400 focus:ring-1 focus:ring-accent-400 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full rounded-md bg-accent-400 py-2 font-semibold text-white transition-colors hover:bg-accent-600 disabled:opacity-50"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

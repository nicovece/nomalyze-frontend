<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  message: string
  type?: 'error' | 'success'
}>()

const emit = defineEmits<{
  dismiss: []
}>()

const visible = ref(false)

watch(
  () => props.message,
  (msg) => {
    if (msg) {
      visible.value = true
      setTimeout(() => {
        visible.value = false
        setTimeout(() => emit('dismiss'), 200)
      }, 4000)
    }
  },
  { immediate: true },
)
</script>

<template>
  <Transition name="toast">
    <div
      v-if="visible"
      class="fixed right-4 top-4 z-50 max-w-sm rounded-lg px-4 py-3 shadow-lg"
      :class="type === 'success' ? 'bg-alternate-a-400 text-white' : 'bg-red-600 text-white'"
      role="alert"
    >
      <div class="flex items-center justify-between gap-3">
        <p class="text-sm">{{ message }}</p>
        <button @click="visible = false" class="text-white/80 hover:text-white">&times;</button>
      </div>
    </div>
  </Transition>
</template>

<style>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.2s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(1rem);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(1rem);
}
</style>

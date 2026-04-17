<script setup lang="ts">
import { ref, watch, onBeforeUnmount } from 'vue'

const props = defineProps<{
  message: string
  type?: 'error' | 'success'
}>()

const emit = defineEmits<{
  dismiss: []
}>()

const visible = ref(false)

// Track active timers so new messages cancel stale ones and we clean up
// on unmount — otherwise a route change mid-timeout fires into a dead component.
let hideTimer: ReturnType<typeof setTimeout> | null = null
let dismissTimer: ReturnType<typeof setTimeout> | null = null

function clearTimers() {
  if (hideTimer) {
    clearTimeout(hideTimer)
    hideTimer = null
  }
  if (dismissTimer) {
    clearTimeout(dismissTimer)
    dismissTimer = null
  }
}

watch(
  () => props.message,
  (msg) => {
    clearTimers()
    if (msg) {
      visible.value = true
      hideTimer = setTimeout(() => {
        visible.value = false
        dismissTimer = setTimeout(() => emit('dismiss'), 200)
      }, 4000)
    }
  },
  { immediate: true },
)

onBeforeUnmount(clearTimers)
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
        <button
          type="button"
          @click="visible = false"
          aria-label="Dismiss notification"
          class="text-white/80 hover:text-white"
        >
          &times;
        </button>
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

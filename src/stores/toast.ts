import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'error' | 'success'

/**
 * Global toast queue. Components push messages; a single `<AppToast>` mounted
 * in `App.vue` subscribes and renders them one at a time. Having a single
 * rendering surface prevents overlapping toasts and lets the global error
 * handler reuse the same UI as local form errors.
 */
export const useToastStore = defineStore('toast', () => {
  const message = ref('')
  const type = ref<ToastType>('error')

  function show(msg: string, kind: ToastType = 'error') {
    message.value = msg
    type.value = kind
  }

  function showError(msg: string) {
    show(msg, 'error')
  }

  function showSuccess(msg: string) {
    show(msg, 'success')
  }

  function dismiss() {
    message.value = ''
  }

  return { message, type, show, showError, showSuccess, dismiss }
})

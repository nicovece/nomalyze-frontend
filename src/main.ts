import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useToastStore } from '@/stores/toast'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Install global handlers AFTER Pinia so useToastStore() works.
const toastStore = useToastStore(pinia)

// Catches errors thrown in render functions, watchers, lifecycle hooks,
// event handlers, and other Vue-internal callbacks.
app.config.errorHandler = (err, _instance, info) => {
  console.error('[vue error]', info, err)
  toastStore.showError('Something went wrong. Please try again.')
}

// Catches promise rejections that escape try/catch — e.g. a fire-and-forget
// API call in a component that didn't await.
window.addEventListener('unhandledrejection', (event) => {
  console.error('[unhandled rejection]', event.reason)
  toastStore.showError('Something went wrong. Please try again.')
})

app.mount('#app')

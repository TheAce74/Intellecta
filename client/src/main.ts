import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import Toast, { type ToastOptions } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'
import VueApexCharts from 'vue3-apexcharts'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(Toast, {
  autoClose: 3000,
  position: 'top-right',
} as ToastOptions)
app.use(VueApexCharts)

app.mount('#app')

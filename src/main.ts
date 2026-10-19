import { createApp } from 'vue'
import { createPinia } from 'pinia'
import '@fontsource-variable/manrope'
import './style.css'
import App from './App.vue'
import router from './router/index'
import { installSeo } from './lib/seo-client'
import { installGa4 } from './lib/ga4'
import { useCartStore } from './stores/cartStore'
import { startAnalytics } from './lib/analytics'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'

const pinia = createPinia()
installSeo(router)
startAnalytics(router)

createApp(App)
  .use(router)
  .use(pinia)
  .use(Toast, { timeout: 3500, hideProgressBar: true, maxToasts: 3, newestOnTop: true, transition: 'Vue-Toastification__fade' })
  .mount('#app')

void router.isReady().then(() => installGa4(router, () => useCartStore(pinia).items))

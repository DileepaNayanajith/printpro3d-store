import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router/index'
import { installSeo } from './lib/seo-client'
import { installGa4 } from './lib/ga4'
import { useCartStore } from './stores/cartStore'
import { startAnalytics } from './lib/analytics'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import AOS from 'aos'
import 'aos/dist/aos.css'

AOS.init({
  duration: 800,
  once: true,
})

const pinia = createPinia()
installSeo(router)
startAnalytics(router)

createApp(App)
  .use(router)
  .use(pinia)
  .use(Toast)
  .mount('#app')

void router.isReady().then(() => installGa4(router, () => useCartStore(pinia).items))

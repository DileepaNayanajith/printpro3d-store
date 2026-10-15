import { createSSRApp } from 'vue'
import { createPinia } from 'pinia'
import { renderToString } from '@vue/server-renderer'
import App from './App.vue'
import { createStoreRouter } from './router'
export async function render(url:string) {
 const app=createSSRApp(App),router=createStoreRouter(true)
 app.use(createPinia()).use(router)
 await router.push(url);await router.isReady()
 return renderToString(app)
}

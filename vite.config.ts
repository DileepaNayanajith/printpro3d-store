import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { customerAccount } from './server/customer-account'
import { omsCheckout } from './server/oms-checkout'
export default defineConfig(({mode}) => ({
  ssr: { noExternal: ['vue-toastification'] },
  plugins: [vue(), tailwindcss(), customerAccount(loadEnv(mode, process.cwd(), 'OMS_')), omsCheckout(loadEnv(mode, process.cwd(), 'OMS_'))],
}))

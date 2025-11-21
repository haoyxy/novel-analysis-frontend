import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import { viteMockServe } from 'vite-plugin-mock'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const enableMock = env.VITE_USE_MOCK === 'true'

  return {
    plugins: [
      vue(),
      vueJsx(),
      vueDevTools(),
      enableMock
        ? viteMockServe({
            mockPath: 'mock',
            localEnabled: true,
            prodEnabled: false,
            watchFiles: true,
            injectCode: ''
          })
        : null
    ].filter(Boolean),
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    }
  }
})

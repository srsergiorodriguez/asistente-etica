import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  base: '/asistente-etica/',
  resolve: {
    alias: {
      // Definimos los alias apuntando a las carpetas exactas
      $lib: path.resolve('./src/lib'),
      $components: path.resolve('./src/lib/components'),
      $state: path.resolve('./src/lib/state'),
      $data: path.resolve('./src/lib/data'),
      $utils: path.resolve('./src/lib/utils')
    }
  }
})

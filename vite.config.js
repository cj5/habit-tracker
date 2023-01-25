import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import htmlPurge from 'vite-plugin-purgecss';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    devSourcemap: true,
  },
  plugins: [vue(), htmlPurge()],
});

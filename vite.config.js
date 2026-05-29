import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode === 'development' ? '/' : '/daily-report-form/',
    plugins: [vue()],
    server: {
      port: 9000,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});

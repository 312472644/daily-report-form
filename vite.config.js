import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  return {
    base: mode === 'development' ? '/' : '/Daily-Report-Form/',
    plugins: [vue()],
    server: {
      port: 9000,
    },
  };
});

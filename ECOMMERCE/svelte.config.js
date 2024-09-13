import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit()],
  define: {
    // Esto no es necesario si estás usando import.meta.env
    // 'process.env': process.env
  }
});
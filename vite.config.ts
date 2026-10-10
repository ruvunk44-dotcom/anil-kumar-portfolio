import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  base: './',
  plugins: [react()],
  build: { target: 'es2020', chunkSizeWarningLimit: 900, // three.js chunk is lazy-loaded after first paint
    cssCodeSplit: true, rollupOptions: { output: { manualChunks: { three: ['three', '@react-three/fiber'], motion: ['framer-motion'] } } } },
});

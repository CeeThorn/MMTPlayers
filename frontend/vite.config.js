import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< Updated upstream
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
=======

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
>>>>>>> Stashed changes
})

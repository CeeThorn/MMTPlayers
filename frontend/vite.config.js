import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
<<<<<<< Updated upstream
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
=======
>>>>>>> Stashed changes

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< Updated upstream
>>>>>>> Stashed changes
=======
>>>>>>> Stashed changes
})

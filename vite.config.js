import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: '/bay-area-intern-kickoff/',
  plugins: [react()],
})

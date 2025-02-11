import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths"
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    base: '/',
    host: true, 
    port: 3000, 
  },
  resolve: {
    alias: {
      '@components': path.resolve(__dirname, 'src/components'), // Set '@' to point to 'src'
    },
  },
  
})



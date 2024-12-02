import {defineConfig} from 'vitest/config'
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    files: 'src/**/*.test.jsx',
    environment: 'jsdom',
  },
})
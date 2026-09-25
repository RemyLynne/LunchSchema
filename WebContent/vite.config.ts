/// <reference types="vitest/config" />
import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react()
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src")
    }
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./test/setup.ts",
    include: ["test/**/*.test.ts?(x)", "test/**/*.spec.ts?(x)"]
  },
  server: {
    proxy: {
      "/actuator": "https://localhost:8080",
      "/api": "https://localhost:8080"
    }
  }
})

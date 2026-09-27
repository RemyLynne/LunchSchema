/// <reference types="vitest/config" />
import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
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
      "/actuator": "http://localhost:8080",
      "/api": "http://localhost:8080"
    }
  },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: "vendor-react",
              test: /node_modules[\\/](react|react-dom|react-router|react-hook-form)[\\/]/,
              priority: 10
            },
            {
              name: "vendor-baseui",
              test: /node_modules[\\/](@base-ui)[\\/]/,
              priority: 10
            },
            {
              name: "vendor",
              test: /node_modules/,
              priority: 5
            }
          ]
        }
      }
    },
    assetsInlineLimit: 4096
  }
})

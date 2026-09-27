import js from "@eslint/js"
import globals from "globals"
import reactHooks from "eslint-plugin-react-hooks"
import reactRefresh from "eslint-plugin-react-refresh"
import tseslint from "typescript-eslint"
import { defineConfig, globalIgnores } from "eslint/config"
import reactXPlugin from "eslint-plugin-react-x"
import reactDomPlugin from "eslint-plugin-react-dom"
import importPlugin from "eslint-plugin-import"

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.stylisticTypeChecked,
      reactXPlugin.configs.recommended,
      reactDomPlugin.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: [
          './tsconfig.node.json',
          './tsconfig.app.json',
          './tsconfig.test.json'
        ],
        tsconfigRootDir: import.meta.dirname
      }
    },
    rules: {
      semi: ["error", "never"],
      quotes: ["error", "double"],
      "import/extensions": [
        "error",
        "never"
      ],
      "@typescript-eslint/no-misused-promises": [
        "error",
        { checksVoidReturn: { attributes: false } },
      ],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
          destructuredArrayIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/only-throw-error": ["off"]
    },
    settings: {
      "import/resolver": {
        typescript: true,
        node: true
      }
    }
  },
  {
    files: ["test/**/*.{ts,tsx}"],
    rules: {
      "react-refresh/only-export-components": "off"
    }
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ['./*', '../*'],
              message: 'Use "@/" imports instead of relative imports.',
            }
          ]
        }
      ]
    }
  }
])

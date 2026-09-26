import {createContext, use} from "react"

export type ResolvedTheme = "dark" | "light"
export type Theme = ResolvedTheme | "system"

export interface ThemeContextValue {
  preference: Theme
  setPreference: (theme: Theme) => void,
  resolvedTheme: ResolvedTheme,
}

export const ThemeContext = createContext<ThemeContextValue|null>(null)

export function useTheme() {
  const ctx = use(ThemeContext)
  if (!ctx) throw new Error("useTheme must be used within <ThemeProvider>")
  return ctx
}
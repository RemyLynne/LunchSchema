import {type PropsWithChildren, useEffect, useState, useSyncExternalStore} from "react"
import {type ResolvedTheme, type Theme, ThemeContext, type ThemeContextValue} from "@/state/theme.store"

const SYSTEM_QUERY = "(prefers-color-scheme: dark)"

export default function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
}: PropsWithChildren<ThemeProviderProps>) {
  const [preference, setPreference] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  const systemTheme: ResolvedTheme = useSyncExternalStore(
    (callback: () => void) => {
      const mq = window.matchMedia(SYSTEM_QUERY)
      mq.addEventListener("change", callback)
      return () => mq.removeEventListener("change", callback)
    },
    () => (window.matchMedia(SYSTEM_QUERY).matches ? "dark" : "light")
  )

  const resolvedTheme: ResolvedTheme = preference == "system" ? systemTheme : preference

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")
    root.classList.add(resolvedTheme)
  }, [resolvedTheme])

  const value: ThemeContextValue = {
    preference,
    setPreference: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setPreference(theme)
    },
    resolvedTheme
  }

  return <ThemeContext value={value}>{children}</ThemeContext>
}

interface ThemeProviderProps {
  defaultTheme?: Theme
  storageKey?: string
}
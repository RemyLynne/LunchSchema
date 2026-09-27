import {type PropsWithChildren, useCallback, useEffect, useMemo, useState, useSyncExternalStore} from "react"
import {type ResolvedTheme, type Theme, ThemeContext, type ThemeContextValue} from "@/state/theme.store"

const SYSTEM_QUERY = "(prefers-color-scheme: dark)"

const subscribeToSystemTheme = (callback: () => void) => {
  const mq = window.matchMedia(SYSTEM_QUERY)
  mq.addEventListener("change", callback)
  return () => mq.removeEventListener("change", callback)
}

const getSystemTheme = (): ResolvedTheme =>
  window.matchMedia(SYSTEM_QUERY).matches ? "dark" : "light"

export default function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "ui-theme",
}: PropsWithChildren<ThemeProviderProps>) {
  const [preference, setPreference] = useState<Theme>(
    () => (localStorage.getItem(storageKey) as Theme) || defaultTheme
  )

  const systemTheme: ResolvedTheme = useSyncExternalStore(subscribeToSystemTheme, getSystemTheme)

  const resolvedTheme: ResolvedTheme = preference == "system" ? systemTheme : preference

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove("light", "dark")
    root.classList.add(resolvedTheme)
  }, [resolvedTheme])

  const updatePreference = useCallback((theme: Theme) => {
    localStorage.setItem(storageKey, theme)
    setPreference(theme)
  }, [storageKey])

  const value = useMemo<ThemeContextValue>(
    () => ({ preference, setPreference: updatePreference, resolvedTheme }),
    [preference, updatePreference, resolvedTheme]
  )

  return <ThemeContext value={value}>{children}</ThemeContext>
}

interface ThemeProviderProps {
  defaultTheme?: Theme
  storageKey?: string
}
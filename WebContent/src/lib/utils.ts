export { cn } from "cn"

export function getInitials(name = ""): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return ""

  const first = parts[0]
  const last = parts.length > 1 ? parts[parts.length - 1] : ""

  // Array.from handles emoji/surrogate pairs better than first[0]
  const initial = (s: string) => Array.from(s)[0] ?? ""

  return (initial(first) + initial(last)).toUpperCase()
}
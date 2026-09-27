import {createContext, use} from "react"
import type {User} from "@/models/iam/user"

export type AuthState =
  | { status: "loading", user: null }
  | { status: "authenticated", user: User }
  | { status: "unauthenticated", user: null }

export type UserContextValue = AuthState & {
  setUser: (user: User | null) => void,
  refresh: () => Promise<void>
}

export const UserContext = createContext<UserContextValue|null>(null)

export function useUser() {
  const ctx = use(UserContext)
  if (!ctx) throw new Error("useUser must be used within <UserProvider>")
  return ctx
}
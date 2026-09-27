import {type PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from "react"
import {type AuthState, UserContext, type UserContextValue} from "@/state/user.store"
import {type User, userSchema} from "@/models/iam/user"
import {api, isApiError} from "@/lib/api"
import {ToastManager} from "@/lib/toast"
import {useTranslation} from "react-i18next"
import {getAppText} from "@/lib/app-text"
import type {TFunction} from "i18next"

export default function UserProvider({children}: PropsWithChildren) {
  const [state, setState] = useState<AuthState>({ status: "loading", user: null })
  const request = useRef<AbortController|null>(null)
  const { t } = useTranslation()

  const setUser = useCallback((user: User | null) => {
    setState(user ? { status: "authenticated", user } : { status: "unauthenticated", user: null })
  }, [])

  const refresh = useCallback(async () => {
    request.current?.abort() //stop any ongoing requests

    const controller = new AbortController()
    request.current = controller
    await fetchUser(t, controller.signal).then((user) => {
      if (!controller.signal.aborted) setUser(user)
    })
  }, [setUser, t])

  useEffect(() => {
    void refresh()

    return () => request.current?.abort()
  }, [refresh])

  useEffect(() => {
    if (state.status != "authenticated")
      return

    const poller = setInterval(() => refresh(), 30*1000)
    return () => clearInterval(poller)
  }, [refresh, state.status])

  const value: UserContextValue = useMemo(() => ({
    ...state,
    setUser,
    refresh
  }), [state, setUser, refresh])

  return <UserContext value={value}>{children}</UserContext>
}

async function fetchUser(translator: TFunction, signal?: AbortSignal): Promise<User | null> {
  const res = await api.get("/api/account", signal)

  if (res.code === 401 || res.code === 403) {
    return null
  }

  if (isApiError(res)) {
    if (res.error)
      ToastManager.add({
        type: "error",
        title: getAppText(res.error, translator)
      })
    return null
  }

  const parsed = userSchema.safeParse(await res.response.json().catch(() => null))
  if (!parsed.success) {
    console.error(parsed.error)
    ToastManager.add({
      type: "error",
      title: translator("common:errors.unknown"),
    })
    return null
  }

  return parsed.data
}
import {t} from "i18next"
import {type User, userSchema} from "@/models/iam/user"
import {api, isApiError} from "@/lib/api"
import {ToastManager} from "@/lib/toast"
import {getAppText} from "@/lib/app-text"
import {useQuery} from "@tanstack/react-query"

export const userQuery = {
  queryKey: ["me"],
  queryFn: () => fetchUser(),
  staleTime: 5 * 60 * 1000,
}

export function useUser() {
  return useQuery(userQuery)
}

async function fetchUser(): Promise<User | null> {
  const res = await api.get("/api/account")

  if (res.code === 401 || res.code === 403) {
    return null
  }

  if (isApiError(res)) {
    if (res.error)
      ToastManager.add({
        type: "error",
        title: getAppText(res.error, t)
      })
    return null
  }

  const parsed = userSchema.safeParse(await res.response.json().catch(() => null))
  if (!parsed.success) {
    console.error(parsed.error)
    ToastManager.add({
      type: "error",
      title: t("common:errors.unknown"),
    })
    return null
  }

  return parsed.data
}
import {type LunchOption, lunchOptionSchema} from "@/models/lunch/lunch-option"
import {useQuery} from "@tanstack/react-query"
import {api, isApiError} from "@/lib/api"
import {ToastManager} from "@/lib/toast"
import {getAppText} from "@/lib/app-text"
import {t} from "i18next"

export const menuQuery = {
  queryKey: ["menu"],
  queryFn: () => fetchMenu(),
  staleTime: 5 * 60 * 1000,
}

export function useMenu() {
  return useQuery(menuQuery)
}

async function fetchMenu(): Promise<LunchOption[] | null> {
  const res = await api.get("/api/menu")

  if (res.code === 401 || res.code === 403) return null

  if (isApiError(res)) {
    if (res.error)
      ToastManager.add({
        type: "error",
        title: getAppText(res.error, t)
      })
    return null
  }

  const parsed = lunchOptionSchema.array().safeParse(await res.response.json().catch(() => null))
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
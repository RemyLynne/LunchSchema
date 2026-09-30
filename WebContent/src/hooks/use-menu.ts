import {type LunchOption, lunchOptionSchema} from "@/models/lunch/lunch-option"
import {useQuery} from "@tanstack/react-query"
import {api, isApiError} from "@/lib/api"
import {ToastManager} from "@/lib/toast"
import {getAppText} from "@/lib/app-text"
import {t} from "i18next"
import {queryClient} from "@/lib/query-client"

export const menuQuery = {
  queryKey: ["menu"],
  queryFn: () => fetchMenu(),
  staleTime: 5 * 60 * 1000,
}

export function useMenu() {
  return useQuery(menuQuery)
}

export function replaceMenuItem(menuItem: LunchOption) {
  const data = queryClient.getQueryData(["menu"]) as LunchOption[]|null

  const index = data?.findIndex(item => item.id === menuItem.id) ?? -1
  let rtn: LunchOption[]
  if (index === -1)
    rtn = [...data??[], menuItem]
  else
    rtn = [
      ...data!.slice(0, index),
      menuItem,
      ...data!.slice(index+1)
    ]

  queryClient.setQueryData(["menu"], rtn)
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
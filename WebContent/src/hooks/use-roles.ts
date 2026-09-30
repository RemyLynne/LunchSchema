import {useQuery} from "@tanstack/react-query"
import {type Role, roleSchema} from "@/models/iam/role"
import {api, isApiError} from "@/lib/api"
import {ToastManager} from "@/lib/toast"
import {getAppText} from "@/lib/app-text"
import {t} from "i18next"

export const rolesQuery = {
  queryKey: ["roles"],
  queryFn: () => fetchRoles(),
  staleTime: 5 * 60 * 1000,
}

export function useRoles() {
  return useQuery(rolesQuery)
}

async function fetchRoles(): Promise<Role[] | null> {
  const res = await api.get("/api/admin/roles")

  if (res.code === 401 || res.code === 403) return null

  if (isApiError(res)) {
    if (res.error)
      ToastManager.add({
        type: "error",
        title: getAppText(res.error, t)
      })
    return null
  }

  const parsed = roleSchema.array().safeParse(await res.response.json().catch(() => null))
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
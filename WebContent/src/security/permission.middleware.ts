import {type MiddlewareFunction, redirect} from "react-router"
import {hasPermission, type PermissionMode} from "@/security/access-utils"
import {queryClient} from "@/lib/query-client"
import {userQuery} from "@/hooks/use-user.ts"

export function requirePermissions(names: string | string[], mode?: PermissionMode): MiddlewareFunction {
  return async () => {
    const user = await queryClient.query(userQuery)

    if (user == null) throw redirect("/login")
    if (!hasPermission(user, names, mode)) throw redirect("/")
  }
}
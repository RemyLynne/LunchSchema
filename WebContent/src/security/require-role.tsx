import {useUser} from "@/state/user.store"
import {Navigate, Outlet} from "react-router"
import {useRouteHandle} from "@/hooks/use-route-handle"
import {hasPermission} from "@/security/access-utils"

export default function RequireRole() {
  const { status, user } = useUser()
  const handle = useRouteHandle()

  if (status === "loading") return <></>
  if (status === "unauthenticated") return <Navigate to="/login" replace />

  if (handle?.permissions == null || hasPermission(user, handle.permissions, handle.permissionMatch))
    return <Outlet/>

  return <Navigate to="/" replace />
}
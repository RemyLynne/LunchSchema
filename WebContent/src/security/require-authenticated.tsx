import {useUser} from "@/state/user.store"
import {Navigate, Outlet} from "react-router"

export default function RequireAuthenticated() {
  const { status } = useUser()

  if (status === "loading") return <></>
  if (status === "unauthenticated") return <Navigate to="/login" replace />
  return <Outlet/>
}
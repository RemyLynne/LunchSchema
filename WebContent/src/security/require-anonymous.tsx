import {useUser} from "@/state/user.store"
import {Navigate, Outlet} from "react-router"

export default function RequireAnonymous() {
  const { status } = useUser()

  if (status === "loading") return <></>
  if (status === "authenticated") return <Navigate to="/" replace />
  return <Outlet/>
}
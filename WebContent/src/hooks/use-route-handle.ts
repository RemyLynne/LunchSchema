import {useMatches} from "react-router"
import type {PermissionMode} from "@/security/access-utils"

export interface RouteHandle {
  permissions?: string[]
  permissionMatch?: PermissionMode
}

export function useRouteHandle(): RouteHandle | undefined {
  const matches = useMatches()
  return matches[matches.length - 1]?.handle as RouteHandle | undefined
}
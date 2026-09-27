import type {User} from "@/models/iam/user"

function getPermissionSet(user: User): Set<string> {
  return new Set(
    user.roles.flatMap(role => role.permissions.map(p => p.name))
  )
}

export type PermissionMode = "all" | "any"

export function hasPermission(
  user: User,
  names: string | string[],
  mode: PermissionMode = "all"
): boolean {
  const required = Array.isArray(names) ? names : [names]
  const permissions = getPermissionSet(user)

  return mode === "all"
    ? required.every(name => permissions.has(name))
    : required.some(name => permissions.has(name))
}
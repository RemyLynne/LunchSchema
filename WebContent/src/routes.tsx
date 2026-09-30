import {createBrowserRouter, Navigate} from "react-router"
import AppLayout from "@/routes/app/app.layout"
import AuthLayout from "@/routes/auth/auth.layout"
import AuthLoginPage from "@/routes/auth/auth-login.page"
import AuthRegisterPage from "@/routes/auth/auth-register.page"
import AppMyChoicesPage from "@/routes/app/app-my-choices.page"
import AppOverviewPage from "@/routes/app/app-overview.page"
import AppAdminUsersPage from "@/routes/app/admin/app-admin-users.page"
import AppAdminMenuPage from "@/routes/app/admin/app-admin-menu.page"
import {ChefHat, LayoutList, type LucideIcon, UserCog, Utensils} from "lucide-react"
import type {User} from "@/models/iam/user"
import {hasPermission} from "@/security/access-utils"
import {permissionConstants} from "@/security/permission.constants"
import {requirePermissions} from "@/security/permission.middleware"
import {requireAnonymous} from "@/security/anonymous.middleware"
import {requireAuthenticated} from "@/security/authenticated.middleware"

export const router = createBrowserRouter([
  {
    Component: AuthLayout,
    middleware: [requireAnonymous],
    children: [
      {
        path: "/login",
        Component: AuthLoginPage
      },
      {
        path: "/register",
        Component: AuthRegisterPage
      }
    ]
  },
  {
    Component: AppLayout,
    middleware: [requireAuthenticated],
    children: [
      {
        path: "/",
        Component: () => (<Navigate to="/my-choices"/>)
      },
      {
        path: "/my-choices",
        Component: AppMyChoicesPage
      },
      {
        path: "/overview",
        Component: AppOverviewPage
      },
      {
        path: "/admin",
        children: [
          {
            path: "users",
            middleware: [requirePermissions(permissionConstants.ADMIN_USERS_VIEW)],
            Component: AppAdminUsersPage
          },
          {
            path: "menu",
            middleware: [requirePermissions(permissionConstants.ADMIN_MENU_VIEW)],
            Component: AppAdminMenuPage
          }
        ]
      }
    ]
  }
])

export const SIDEBAR_ROUTES: SidebarRoutes = [
  {
    titleKey: "Lunch",
    items: [
      { titleKey: "My choices", path: "/my-choices", icon: Utensils },
      {
        titleKey: "Overview",
        path: "/overview",
        icon: LayoutList,
        canAccess: user => hasPermission(user, permissionConstants.OVERVIEW_VIEW)
      }
    ]
  },
  {
    titleKey: "Admin",
    items: [
      {
        titleKey: "Menu",
        path: "/admin/menu",
        icon: ChefHat,
        canAccess: user => hasPermission(user, permissionConstants.ADMIN_MENU_VIEW),
      },
      {
        titleKey: "Users",
        path: "/admin/users",
        icon: UserCog,
        canAccess: user => hasPermission(user, permissionConstants.ADMIN_USERS_VIEW)
      }
    ]
  }
]

export type SidebarRoutes = {
  titleKey: string,
  items: {
    titleKey: string,
    path: string,
    icon: LucideIcon,
    canAccess?: (user?: User|null) => boolean
  }[]
}[]
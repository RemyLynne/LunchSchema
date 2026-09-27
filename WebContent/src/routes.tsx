import {createBrowserRouter, Navigate} from "react-router"
import RequireAnonymous from "@/security/require-anonymous"
import RequireAuthenticated from "@/security/require-authenticated"
import AppLayout from "@/routes/app/app.layout"
import AuthLayout from "@/routes/auth/auth.layout"
import AuthLoginPage from "@/routes/auth/auth-login.page"
import AuthRegisterPage from "@/routes/auth/auth-register.page"
import AppMyChoicesPage from "@/routes/app/app-my-choices.page"
import AppOverviewPage from "@/routes/app/app-overview.page"
import AppAdminUsersPage from "@/routes/app/admin/app-admin-users.page"
import AppAdminMenuPage from "@/routes/app/admin/app-admin-menu.page"
import {ChefHat, LayoutList, type LucideIcon, UserCog, Utensils} from "lucide-react"

export const router = createBrowserRouter([
  {
    Component: RequireAnonymous,
    children: [
      {
        Component: AuthLayout,
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
      }
    ]
  },
  {
    Component: RequireAuthenticated,
    children: [
      {
        Component: AppLayout,
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
                Component: AppAdminUsersPage
              },
              {
                path: "menu",
                Component: AppAdminMenuPage
              }
            ]
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
      { titleKey: "Overview", path: "/overview", icon: LayoutList }
    ]
  },
  {
    titleKey: "Admin",
    items: [
      { titleKey: "Menu", path: "/admin/menu", icon: ChefHat },
      { titleKey: "Users", path: "/admin/users", icon: UserCog }
    ]
  }
]

export type SidebarRoutes = {
  titleKey: string,
  items: {
    titleKey: string,
    path: string,
    icon: LucideIcon
  }[]
}[]
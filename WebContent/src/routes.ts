import {createBrowserRouter} from "react-router"
import RequireAnonymous from "@/security/require-anonymous"
import RequireAuthenticated from "@/security/require-authenticated"
import AppLayout from "@/routes/app/app.layout"

const auth = () => import("@/routes/auth")

export const router = createBrowserRouter([
  {
    Component: RequireAnonymous,
    children: [
      {
        lazy: async () => ({ Component: (await auth()).AuthLayout}),
        children: [
          {
            path: "/login",
            lazy: async () => ({ Component: (await auth()).LoginPage})
          },
          {
            path: "/register",
            lazy: async () => ({ Component: (await auth()).RegisterPage})
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
            Component: null
          }
        ]
      }
    ]
  }
])
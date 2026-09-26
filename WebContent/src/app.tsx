import ThemeProvider from "@/state/theme.provider"
import {Toaster} from "@/components/ui/toast"
import {RouterProvider} from "react-router/dom"
import {router} from "@/routes"
import UserProvider from "@/state/user.provider"
import {Suspense} from "react"

export default function App() {
  return (
    <Suspense fallback="loading">
      <UserProvider>
        <ThemeProvider>
          <RouterProvider router={router}/>
          <Toaster />
        </ThemeProvider>
      </UserProvider>
    </Suspense>
  )
}

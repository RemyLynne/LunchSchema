import ThemeProvider from "@/state/theme.provider"
import {Toaster} from "@/components/ui/toast"
import {RouterProvider} from "react-router/dom"
import {router} from "@/routes"
import {Suspense} from "react"
import {TooltipProvider} from "@/components/ui/tooltip"
import {QueryClientProvider} from "@tanstack/react-query"
import {queryClient} from "@/lib/query-client"

export default function App() {
  return (
    <Suspense fallback="loading">
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <TooltipProvider>
            <RouterProvider router={router}/>
            <Toaster />
          </TooltipProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </Suspense>
  )
}

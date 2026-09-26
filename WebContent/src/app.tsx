import {ThemeProvider} from "@/state/theme.provider"
import {Toaster} from "@/components/ui/toast"

export default function App() {
  return (
    <ThemeProvider>
      <main>
      </main>
      <Toaster />
    </ThemeProvider>
  )
}

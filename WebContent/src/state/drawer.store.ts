import {Drawer as DrawerPrimitive} from "@base-ui/react/drawer"
import {createContext, use} from "react"

export interface DrawerContextValue {
  hasSnapPoints: boolean
  modal: DrawerPrimitive.Root.Props["modal"]
  showSwipeHandle: boolean
  swipeDirection: NonNullable<DrawerPrimitive.Root.Props["swipeDirection"]>
}

export const DrawerContext = createContext<DrawerContextValue | null>(null)

export function useDrawer() {
  const context = use(DrawerContext)

  if (!context) throw new Error("useDrawer must be used within a Drawer.")

  return context
}
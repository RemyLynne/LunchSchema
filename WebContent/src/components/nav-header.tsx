import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar"
import {Link} from "react-router"
import {Sandwich} from "lucide-react"

export function NavHeader() {

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          render={
            <Link to="/"/>
          }
        >
          <Sandwich/>
          <span>Lunchscheme</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
import {SIDEBAR_ROUTES} from "@/routes"
import {SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar"
import {Link, matchPath, useLocation} from "react-router"

export function NavMain() {
  const {pathname} = useLocation()

  const isActive = (path: string) => !!matchPath({path, end: path === "/"}, pathname)

  return (
    <>{SIDEBAR_ROUTES.map(group => (
      <SidebarGroup key={group.titleKey}>
        <SidebarGroupLabel>{group.titleKey}</SidebarGroupLabel>
        <SidebarMenu>
          {group.items.map(item => (
            <SidebarMenuItem key={item.titleKey}>
              <SidebarMenuButton
                isActive={isActive(item.path)}
                render={<Link to={item.path} />}
              >
                <item.icon/>
                <span>{item.titleKey}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    ))}</>
  )
}
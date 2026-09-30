import {SIDEBAR_ROUTES} from "@/routes"
import {SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar"
import {Link, matchPath, useLocation} from "react-router"
import {useMemo} from "react"
import {useUser} from "@/hooks/use-user"
import {useTranslation} from "react-i18next"

export function NavMain() {
  const { t } = useTranslation()
  const user = useUser()
  const {pathname} = useLocation()

  const isActive = (path: string) => !!matchPath({path, end: path === "/"}, pathname)

  const availableRoutes = useMemo(() =>
    SIDEBAR_ROUTES.map(route => ({
      ...route,
      items: route.items.filter(item => item.canAccess == null || item.canAccess(user.data))
    })).filter(route => route.items.length)
  , [user])

  return (
    <>{availableRoutes.map(group => (
      <SidebarGroup key={group.titleKey}>
        <SidebarGroupLabel>{t(group.titleKey)}</SidebarGroupLabel>
        <SidebarMenu>
          {group.items.map(item => (
            <SidebarMenuItem key={item.titleKey}>
              <SidebarMenuButton
                isActive={isActive(item.path)}
                render={<Link to={item.path} />}
              >
                <item.icon/>
                <span>{t(item.titleKey)}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>
    ))}</>
  )
}
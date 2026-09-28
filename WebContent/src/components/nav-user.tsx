import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {ChevronsUpDown, LogOut} from "lucide-react"
import {useSidebar} from "@/state/sidebar.store"
import {useUser} from "@/hooks/use-user"
import {useTranslation} from "react-i18next"
import {api, isApiError} from "@/lib/api"
import {ToastManager} from "@/lib/toast"
import {getAppText} from "@/lib/app-text"
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import {getInitials} from "@/lib/utils"
import {queryClient} from "@/lib/query-client"
import {useNavigate} from "react-router"

export function NavUser() {
  const user = useUser()
  const { isMobile } = useSidebar()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const logout = async () => {
    const res = await api.post("/api/auth/logout", {})

    if (isApiError(res)) {
      ToastManager.add({
        type: "error",
        title: res.error ? getAppText(res.error, t) : t("common:error.unknown"),
      })
      return
    }

    queryClient.setQueryData(["me"], null)
    void navigate("/")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-popup-open:bg-sidebar-accent data-popup-open:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarFallback className="rounded-lg">{getInitials(user.data?.name)}</AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.data?.name}</span>
              <span className="truncate text-xs">{user.data?.email}</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user.data?.name}</span>
                    <span className="truncate text-xs">{user.data?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut />
              { t("auth:actions.logout") }
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
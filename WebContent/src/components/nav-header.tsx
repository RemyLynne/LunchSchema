import {SidebarMenu, SidebarMenuButton, SidebarMenuItem} from "@/components/ui/sidebar"
import {Link} from "react-router"
import {Sandwich} from "lucide-react"
import {useTranslation} from "react-i18next"

export function NavHeader() {
  const { t } = useTranslation()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          render={
            <Link to="/"/>
          }
        >
          <Sandwich/>
          <span>{t("common:app.name")}</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
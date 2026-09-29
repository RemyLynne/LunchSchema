import type {ReactElement} from "react"
import {Popup} from "@/components/popup"
import {type LucideIcon, TriangleAlert} from "lucide-react"
import {Button} from "@/components/ui/button"
import {useTranslation} from "react-i18next";

interface ConfirmProps {
  trigger: ReactElement,
  title: string,
  content: ReactElement,
  confirmButtonText: string,
  callback: () => void,
  icon?: LucideIcon
}

export function ConfirmPopup({trigger, title, content, confirmButtonText, callback, icon: Icon = TriangleAlert}: ConfirmProps) {
  const {t} = useTranslation()
  return (
    <Popup
      trigger={trigger}
      title={
        <div className="flex flex-col gap-1">
          <div className="rounded-full p-2 bg-destructive/10 text-destructive w-fit"><Icon/></div>
          <h1 className="text-lg font-semibold">{title}</h1>
        </div>
      }
    >
      {close => (
        <>
          {content}
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={close}>{t("common:actions.cancel")}</Button>
            <Button variant="destructive" onClick={() => {close();callback()}}>{confirmButtonText}</Button>
          </div>
        </>
      )}
    </Popup>
  )
}
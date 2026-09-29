import {type ReactElement, type ReactNode, useState} from "react"
import {useIsMobile} from "@/hooks/use-mobile"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"
import {DrawerProvider} from "@/state/drawer.provider"
import {DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger} from "@/components/ui/drawer"

interface PopupProps {
  trigger: ReactElement,
  title: ReactNode,
  description?: string,
  children: (close: () => void) => ReactElement,
}

export function Popup({...props}: PopupProps) {
  const [open, setOpen] = useState(false)
  const isMobile = useIsMobile()

  const args: DevicePopupProps = {...props, open, setOpen}

  return isMobile ? MobilePopup(args) : DesktopPopup(args)
}

interface DevicePopupProps extends PopupProps {
  open: boolean,
  setOpen: (open: boolean) => void
}

function MobilePopup({trigger, title, description, children, open, setOpen}: DevicePopupProps) {
  return (
    <DrawerProvider open={open} onOpenChange={setOpen}>
      <DrawerTrigger render={trigger}/>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {children(() => setOpen(false))}
      </DrawerContent>
    </DrawerProvider>
  )

}

function DesktopPopup({trigger, title, description, children, open, setOpen}: DevicePopupProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger}/>
      <DialogContent
        className="data-nested-dialog-open:blur-[2px] data-nested-dialog-open:brightness-75 data-nested-dialog-open:scale-[calc(1-0.05*var(--nested-dialogs))] transition-[filter,scale]"
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children(() => setOpen(false))}
      </DialogContent>
    </Dialog>
  )
}
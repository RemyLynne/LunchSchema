import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import {ButtonVariants} from "@/lib/button-variants"

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof ButtonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(ButtonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

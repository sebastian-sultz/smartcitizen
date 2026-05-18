import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-[12px] font-bold uppercase tracking-wider whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-light",
        secondary: "bg-bg text-text hover:bg-bg-alt",
        destructive: "bg-danger text-white hover:bg-danger-light",
        outline: "border-border text-text hover:bg-bg hover:text-text-muted",
        ghost: "hover:bg-bg hover:text-text-muted",
        link: "text-primary underline-offset-4 hover:underline",
        success: "border-success/20 bg-success-bg text-success",
        danger: "border-danger/20 bg-danger-bg text-danger",
        warning: "border-accent/20 bg-accent/10 text-accent",
        info: "border-primary/20 bg-primary/10 text-primary",
        muted: "border-border bg-bg text-text-muted",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

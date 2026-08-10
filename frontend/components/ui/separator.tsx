"use client"

import * as React from "react"
import { Separator as SeparatorPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

interface SeparatorProps extends React.ComponentProps<typeof SeparatorPrimitive.Root> {
  variant?: "solid" | "dashed" | "dotted";
}

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  variant = "solid",
  ...props
}: SeparatorProps) {
  return (
    <SeparatorPrimitive.Root
      data-slot="separator"
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0",
        // Solid variant using height/width background fills
        variant === "solid" && "bg-border data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:w-px data-[orientation=vertical]:self-stretch",
        
        // Dashed variant using borders on transparent backgrounds
        variant === "dashed" && "bg-transparent data-[orientation=horizontal]:h-0 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-dashed data-[orientation=horizontal]:border-border data-[orientation=vertical]:w-0 data-[orientation=vertical]:self-stretch data-[orientation=vertical]:border-l data-[orientation=vertical]:border-dashed data-[orientation=vertical]:border-border",
        
        // Dotted variant using dots on transparent backgrounds
        variant === "dotted" && "bg-transparent data-[orientation=horizontal]:h-0 data-[orientation=horizontal]:w-full data-[orientation=horizontal]:border-t data-[orientation=horizontal]:border-dotted data-[orientation=horizontal]:border-border data-[orientation=vertical]:w-0 data-[orientation=vertical]:self-stretch data-[orientation=vertical]:border-l data-[orientation=vertical]:border-dotted data-[orientation=vertical]:border-border",
        
        className
      )}
      {...props}
    />
  )
}

export { Separator }

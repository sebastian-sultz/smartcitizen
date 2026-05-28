"use client"

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Tabs as TabsPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

const TabsContext = React.createContext<{
  orientation: "horizontal" | "vertical"
}>({
  orientation: "horizontal",
})

const TabsListContext = React.createContext<{
  variant: "default" | "line"
}>({
  variant: "default",
})

function Tabs({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsContext.Provider value={{ orientation }}>
      <TabsPrimitive.Root
        data-slot="tabs"
        orientation={orientation}
        className={cn(
          "flex gap-2 w-full",
          orientation === "horizontal" ? "flex-col" : "flex-row",
          className
        )}
        {...props}
      />
    </TabsContext.Provider>
  )
}

const tabsListVariants = cva(
  "inline-flex w-fit items-center justify-center rounded-xl p-1.5 text-text-muted transition-all",
  {
    variants: {
      variant: {
        default: "bg-bg",
        line: "gap-1 bg-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function TabsList({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> &
  VariantProps<typeof tabsListVariants>) {
  const { orientation } = React.useContext(TabsContext)

  return (
    <TabsListContext.Provider value={{ variant: variant ?? "default" }}>
      <TabsPrimitive.List
        data-slot="tabs-list"
        className={cn(
          tabsListVariants({ variant }),
          orientation === "horizontal" ? "h-12" : "h-fit flex-col w-full",
          className
        )}
        {...props}
      />
    </TabsListContext.Provider>
  )
}

function TabsTrigger({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  const { orientation } = React.useContext(TabsContext)
  const { variant } = React.useContext(TabsListContext)

  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-full flex-1 items-center justify-center gap-2 rounded-lg border border-transparent px-4 py-2 text-base font-bold whitespace-nowrap text-text-muted transition-all hover:text-text focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-surface data-[state=active]:text-primary data-[state=active]:shadow-md [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-5",
        orientation === "vertical" && "w-full justify-start",
        variant === "line" && "bg-transparent data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-primary",
        "after:absolute after:bg-primary after:opacity-0 after:transition-opacity",
        orientation === "horizontal"
          ? "after:inset-x-0 after:bottom-[-6px] after:h-1"
          : "after:inset-y-0 after:-right-[6px] after:w-1",
        variant === "line" && "data-[state=active]:after:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function TabsContent({
  className,
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 text-sm outline-none w-full", className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }

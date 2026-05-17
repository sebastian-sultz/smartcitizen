import * as React from "react";
import { cn, cva } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[12px] font-bold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-white hover:bg-primary-light",
        secondary: "border-transparent bg-bg text-text hover:bg-bg-alt",
        destructive: "border-transparent bg-danger text-white hover:bg-danger-light",
        outline: "text-text border-border",
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
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'danger' | 'warning' | 'info' | 'muted';
}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

Badge.displayName = "Badge";

export { Badge, badgeVariants };

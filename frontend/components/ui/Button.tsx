"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const buttonVariants = cva(
  "relative inline-flex items-center justify-center gap-2 font-bold whitespace-nowrap transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/20",
        primary:
          "bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/20",
        secondary: "bg-bg text-text border border-border hover:bg-white",
        accent:
          "bg-accent text-white hover:bg-accent-light shadow-lg shadow-accent/20",
        outline:
          "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white",
        ghost: "bg-transparent hover:bg-bg text-text shadow-none",
        "ghost-primary":
          "bg-transparent hover:bg-primary/10 text-primary shadow-none",
        "ghost-danger":
          "bg-transparent hover:bg-danger-bg text-danger shadow-none",
        "ghost-danger-white":
          "bg-transparent hover:bg-danger/10 text-white/70 hover:text-danger-light shadow-none",
        "ghost-success":
          "bg-transparent hover:bg-success-bg text-success shadow-none",
        "ghost-muted": "bg-transparent hover:bg-bg text-text-muted shadow-none",
        "ghost-white":
          "bg-transparent hover:bg-white/10 text-white shadow-none",
        text: "bg-transparent hover:bg-bg/50 text-text-muted hover:text-primary underline-offset-4 hover:underline shadow-none",
        danger:
          "bg-danger text-white hover:bg-danger-light shadow-lg shadow-danger/20",
        destructive:
          "bg-danger text-white hover:bg-danger-light shadow-lg shadow-danger/20",
        success:
          "bg-success text-white hover:bg-success-light shadow-lg shadow-success/20",
        link: "text-primary underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default:
          "px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base min-h-[44px]",
        xs: "px-3 py-1 text-xs min-h-[28px]",
        sm: "px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm min-h-[36px]",
        small: "px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm min-h-[36px]",
        md: "px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base min-h-[44px]",
        medium: "px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base min-h-[44px]",
        lg: "px-6 py-3.5 md:px-8 md:py-4 text-sm md:text-lg min-h-[52px]",
        large: "px-6 py-3.5 md:px-8 md:py-4 text-sm md:text-lg min-h-[52px]",
        icon: "p-2 aspect-square flex items-center justify-center min-h-[36px]",
        "icon-xs":
          "p-1 aspect-square flex items-center justify-center min-h-[24px]",
        "icon-sm":
          "p-1.5 aspect-square flex items-center justify-center min-h-[32px]",
        "icon-lg":
          "p-3 aspect-square flex items-center justify-center min-h-[44px]",
      },
      shape: {
        default: "rounded-xl",
        pill: "rounded-full",
        square: "rounded-lg",
        circle: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      shape: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loading?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  normalCase?: boolean;
  fullWidth?: boolean;
  noShadow?: boolean;
  alignLeft?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    shape = 'default',
    asChild = false,
    type = 'button',
    isLoading, 
    loading, 
    startIcon, 
    endIcon, 
    normalCase,
    fullWidth,
    noShadow,
    alignLeft,
    children, 
    ...props 
  }, ref) => {
    const isBtnLoading = isLoading || loading;

    if (asChild) {
      return (
        <Slot.Root
          ref={ref as React.Ref<any>}
          className={cn(
            buttonVariants({ variant, size, shape }),
            normalCase && "normal-case font-medium",
            fullWidth && "w-full",
            noShadow && "shadow-none",
            alignLeft && "justify-start",
            className
          )}
          {...props}
        >
          {children}
        </Slot.Root>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={props.disabled || isBtnLoading}
        aria-busy={isBtnLoading ? "true" : undefined}
        className={cn(
          buttonVariants({ variant, size, shape }),
          normalCase && "normal-case font-medium",
          fullWidth && "w-full",
          noShadow && "shadow-none",
          alignLeft && "justify-start",
          className
        )}
        {...props}
      >
        {isBtnLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Spinner className="size-5 shrink-0" />
          </span>
        )}
        <span className={cn("inline-flex items-center justify-center gap-2", isBtnLoading && "invisible opacity-0")}>
          {startIcon && <span className="shrink-0 flex items-center justify-center">{startIcon}</span>}
          {children}
          {endIcon && <span className="shrink-0 flex items-center justify-center">{endIcon}</span>}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/ui/spinner";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none outline-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/20",
        primary: "bg-primary text-white hover:bg-primary-light shadow-lg shadow-primary/20",
        secondary: "bg-bg text-text border border-border hover:bg-white",
        accent: "bg-accent text-white hover:bg-accent-light shadow-lg shadow-accent/20",
        outline: "bg-transparent border-2 border-primary text-primary hover:bg-primary hover:text-white",
        ghost: "bg-transparent hover:bg-bg text-text shadow-none",
        "ghost-primary": "bg-transparent hover:bg-primary/10 text-primary shadow-none",
        "ghost-danger": "bg-transparent hover:bg-danger-bg text-danger shadow-none",
        "ghost-danger-white": "bg-transparent hover:bg-danger/10 text-white/70 hover:text-danger-light shadow-none",
        "ghost-success": "bg-transparent hover:bg-success-bg text-success shadow-none",
        "ghost-muted": "bg-transparent hover:bg-bg text-text-muted shadow-none",
        "ghost-white": "bg-transparent hover:bg-white/10 text-white shadow-none",
        text: "bg-transparent hover:bg-bg/50 text-text-muted hover:text-primary underline-offset-4 hover:underline shadow-none",
        danger: "bg-danger text-white hover:bg-danger-light shadow-lg shadow-danger/20",
        destructive: "bg-danger text-white hover:bg-danger-light shadow-lg shadow-danger/20",
        success: "bg-success text-white hover:bg-success-light shadow-lg shadow-success/20",
        link: "text-primary underline-offset-4 hover:underline shadow-none",
      },
      size: {
        default: "px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base",
        xs: "px-3 py-1 text-xs",
        sm: "px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm",
        small: "px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm",
        md: "px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base",
        medium: "px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base",
        lg: "px-6 py-3.5 md:px-8 md:py-4 text-sm md:text-lg",
        large: "px-6 py-3.5 md:px-8 md:py-4 text-sm md:text-lg",
        icon: "p-2 aspect-square flex items-center justify-center",
        "icon-xs": "p-1 aspect-square flex items-center justify-center",
        "icon-sm": "p-1.5 aspect-square flex items-center justify-center",
        "icon-lg": "p-3 aspect:square flex items-center justify-center",
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
  }
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
    const Comp = asChild ? Slot.Root : "button";

    return (
      <Comp
        ref={ref as any}
        type={asChild ? undefined : type}
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
        {isBtnLoading ? (
          <Spinner className="size-5" />
        ) : asChild ? (
          children
        ) : (
          <>
            {startIcon && <span className="shrink-0 flex items-center justify-center">{startIcon}</span>}
            {children}
            {endIcon && <span className="shrink-0 flex items-center justify-center">{endIcon}</span>}
          </>
        )}
      </Comp>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };

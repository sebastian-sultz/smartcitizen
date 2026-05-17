import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 
    | 'primary' 
    | 'secondary' 
    | 'accent' 
    | 'outline' 
    | 'ghost' 
    | 'ghost-primary'
    | 'ghost-danger'
    | 'ghost-danger-white'
    | 'ghost-success'
    | 'ghost-muted'
    | 'ghost-white'
    | 'text' 
    | 'danger' 
    | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'small' | 'medium' | 'large' | 'icon';
  shape?: 'default' | 'pill' | 'square' | 'circle';
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
    
    const variants = {
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
      success: "bg-success text-white hover:bg-success-light shadow-lg shadow-success/20",
    };

    const sizes = {
      xs: "px-3 py-1 text-xs",
      sm: "px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm",
      small: "px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm",
      md: "px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base",
      medium: "px-5 py-2.5 md:px-6 md:py-3 text-sm md:text-base",
      lg: "px-6 py-3.5 md:px-8 md:py-4 text-sm md:text-lg",
      large: "px-6 py-3.5 md:px-8 md:py-4 text-sm md:text-lg",
      icon: "p-2 aspect-square flex items-center justify-center",
    };

    const shapes = {
      default: "rounded-xl",
      pill: "rounded-full",
      square: "rounded-lg",
      circle: "rounded-full",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          shapes[shape],
          normalCase && "normal-case font-medium",
          fullWidth && "w-full",
          noShadow && "shadow-none",
          alignLeft && "justify-start",
          className
        )}
        {...props}
      >
        {isBtnLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5 shrink-0" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span>Loading...</span>
          </span>
        ) : (
          <>
            {startIcon && <span className="shrink-0 flex items-center justify-center">{startIcon}</span>}
            {children}
            {endIcon && <span className="shrink-0 flex items-center justify-center">{endIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button };

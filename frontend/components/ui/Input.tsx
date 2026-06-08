import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const inputVariants = cva(
  "w-full bg-bg border outline-none transition-all text-text focus:ring-1 focus:ring-primary/20",
  {
    variants: {
      size: {
        sm: "px-4 py-2 text-xs sm:text-sm",
        md: "px-6 py-4 text-[15px]",
        lg: "px-8 py-5 text-lg",
      },
      shape: {
        default: "rounded-xl",
        pill: "rounded-full",
        square: "rounded-lg",
      },
      errorState: {
        true: "border-red-500 focus:ring-red-500 focus:border-red-500",
        false: "border-border focus:border-primary",
      }
    },
    defaultVariants: {
      size: "md",
      shape: "default",
      errorState: false,
    }
  }
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type, size = "md", shape = "default", id: customId, ...props }, ref) => {
    const reactId = React.useId();
    const id = customId || reactId;
    const errorId = `${id}-error`;
    const iconPadding = icon ? (size === "sm" ? "pl-10" : size === "lg" ? "pl-14" : "pl-12") : "";

    return (
      <div className="space-y-2 w-full">
        {label && (
          <label htmlFor={id} className="text-[14px] font-bold text-text ml-1 block">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light">
              {icon}
            </div>
          )}
          <input
            id={id}
            type={type}
            className={cn(
              inputVariants({ size, shape, errorState: !!error }),
              iconPadding,
              className
            )}
            ref={ref}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
        </div>
        {error && (
          <p id={errorId} className="text-red-500 text-[12px] ml-1">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

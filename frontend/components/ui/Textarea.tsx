"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
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
        pill: "rounded-2xl",
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

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  label?: string;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, size = "md", shape = "default", id: customId, ...props }, ref) => {
    const reactId = React.useId();
    const id = customId || reactId;
    const errorId = `${id}-error`;

    return (
      <div className="space-y-2 w-full">
        {label && (
          <label htmlFor={id} className="text-[14px] font-bold text-text ml-1 block">
            {label}
          </label>
        )}
        <textarea
          id={id}
          className={cn(
            textareaVariants({ size, shape, errorState: !!error }),
            className
          )}
          ref={ref}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {error && (
          <p id={errorId} className="text-red-500 text-[12px] ml-1">{error}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };

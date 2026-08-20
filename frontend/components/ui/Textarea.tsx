"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const textareaVariants = cva(
  [
    "w-full",
    "bg-bg",
    "border",
    "outline-none",
    "text-text",
    "transition-[border-color,box-shadow,background-color]",
    "placeholder:text-text-light",
    "focus-visible:outline-none",
    "focus-visible:ring-2",
    "focus-visible:ring-primary/20",
    "disabled:cursor-not-allowed",
    "disabled:opacity-60",
    "disabled:bg-bg/70",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "p-3 text-base sm:text-sm",
        md: "p-4 text-base sm:text-sm",
        lg: "p-5 text-base",
      },
      shape: {
        default: "rounded-lg",
        pill: "rounded-2xl",
        square: "rounded-md",
      },
      errorState: {
        true: [
          "border-danger",
          "focus-visible:border-danger",
          "focus-visible:ring-danger/20",
        ].join(" "),
        false: ["border-border", "focus-visible:border-primary"].join(" "),
      },
    },
    defaultVariants: {
      size: "md",
      shape: "default",
      errorState: false,
    },
  },
);

export interface TextareaProps
  extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "size">,
    VariantProps<typeof textareaVariants> {
  label?: React.ReactNode;
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      size = "md",
      shape = "default",
      id: customId,
      disabled,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const id = customId || reactId;
    const errorId = `${id}-error`;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="ml-1 block text-sm font-semibold leading-5 text-text"
          >
            {label}
          </label>
        )}
        <div className={cn(label && "mt-1.5")}>
          <textarea
            id={id}
            disabled={disabled}
            className={cn(
              textareaVariants({ size, shape, errorState: !!error }),
              className,
            )}
            ref={ref}
            aria-invalid={error ? "true" : undefined}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />
        </div>
        {error && (
          <p
            id={errorId}
            role="alert"
            className="ml-1 mt-1 text-xs leading-4 text-danger sm:text-sm sm:leading-5"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };

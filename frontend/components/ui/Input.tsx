import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, type, ...props }, ref) => {
    return (
      <div className="space-y-2 w-full">
        {label && (
          <label className="text-[14px] font-bold text-text ml-1 block">
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
            type={type}
            className={cn(
              "w-full rounded-xl bg-bg border outline-none transition-all px-6 py-4",
              icon && "pl-12",
              error ? "border-red-500 focus:ring-red-500" : "border-border focus:border-primary",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
        {error && (
          <p className="text-red-500 text-[12px] ml-1">{error}</p>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

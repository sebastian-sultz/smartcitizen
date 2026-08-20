// "use client";

// import * as React from "react";
// import { cva, type VariantProps } from "class-variance-authority";
// import { cn } from "@/lib/utils";
// import { Eye, EyeOff } from "lucide-react";

// const inputVariants = cva(
//   "w-full bg-bg border outline-none transition-all text-text focus:ring-1 focus:ring-primary/20",
//   {
//     variants: {
//       size: {
//         sm: "px-4 py-2 text-xs sm:text-sm",
//         md: "px-6 py-4 text-[15px]",
//         lg: "px-8 py-5 text-lg",
//       },
//       shape: {
//         default: "rounded-xl",
//         pill: "rounded-full",
//         square: "rounded-md",
//       },
//       errorState: {
//         true: "border-red-500 focus:ring-red-500 focus:border-red-500",
//         false: "border-border focus:border-primary",
//       },
//     },
//     defaultVariants: {
//       size: "md",
//       shape: "default",
//       errorState: false,
//     },
//   }
// );

// export interface InputProps
//   extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
//     VariantProps<typeof inputVariants> {
//   label?: string;
//   error?: string;
//   icon?: React.ReactNode;
//   rightIcon?: React.ReactNode;
// }

// const Input = React.forwardRef<HTMLInputElement, InputProps>(
//   (
//     {
//       className,
//       label,
//       error,
//       icon,
//       rightIcon,
//       type,
//       size = "md",
//       shape = "default",
//       id: customId,
//       ...props
//     },
//     ref
//   ) => {
//     const reactId = React.useId();
//     const id = customId || reactId;
//     const errorId = `${id}-error`;

//     const [showPassword, setShowPassword] = React.useState(false);
//     const isPassword = type === "password";
//     const actualType = isPassword ? (showPassword ? "text" : "password") : type;

//     const iconPadding = icon
//       ? size === "sm"
//         ? "pl-10"
//         : size === "lg"
//         ? "pl-14"
//         : "pl-12"
//       : "";
//     const rightPadding =
//       isPassword || rightIcon
//         ? size === "sm"
//           ? "pr-10"
//           : size === "lg"
//           ? "pr-14"
//           : "pr-12"
//         : "";

//     return (
//       <div className="space-y-2 w-full">
//         {label && (
//           <label
//             htmlFor={id}
//             className="text-[14px] font-bold text-text ml-1 block"
//           >
//             {label}
//           </label>
//         )}
//         <div className="relative">
//           {icon && (
//             <div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-light pointer-events-none">
//               {icon}
//             </div>
//           )}
//           <input
//             id={id}
//             type={actualType}
//             className={cn(
//               inputVariants({ size, shape, errorState: !!error }),
//               iconPadding,
//               rightPadding,
//               className
//             )}
//             ref={ref}
//             aria-invalid={error ? "true" : undefined}
//             aria-describedby={error ? errorId : undefined}
//             {...props}
//           />
//           {isPassword ? (
//             <button
//               type="button"
//               onClick={() => setShowPassword((prev) => !prev)}
//               tabIndex={-1}
//               aria-label={showPassword ? "Hide password" : "Show password"}
//               className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light hover:text-text focus:outline-none transition-colors"
//             >
//               {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
//             </button>
//           ) : rightIcon ? (
//             <div className="absolute right-4 top-1/2 -translate-y-1/2 text-text-light">
//               {rightIcon}
//             </div>
//           ) : null}
//         </div>
//         {error && (
//           <p id={errorId} className="text-red-500 text-[12px] ml-1">
//             {error}
//           </p>
//         )}
//       </div>
//     );
//   }
// );
// Input.displayName = "Input";

// export { Input };

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Eye, EyeOff } from "lucide-react";

const inputVariants = cva(
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
        sm: "min-h-10 px-4 py-2.5 text-base",
        md: "min-h-10 px-4 py-2.5 text-base",
        lg: "min-h-12 px-5 py-3.5 text-base",
      },

      shape: {
        default: "rounded-lg",
        pill: "rounded-full",
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

export interface InputProps
  extends
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  label?: React.ReactNode;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      error,
      icon,
      rightIcon,
      type,
      size = "md",
      shape = "default",
      id: customId,
      disabled,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();

    const id = customId ?? reactId;
    const errorId = `${id}-error`;

    const [showPassword, setShowPassword] = React.useState(false);

    const isPassword = type === "password";
    const actualType = isPassword ? (showPassword ? "text" : "password") : type;

    const iconPadding = icon
      ? size === "sm"
        ? "pl-10"
        : size === "lg"
          ? "pl-14"
          : "pl-12"
      : "";

    const rightPadding =
      isPassword || rightIcon
        ? size === "sm"
          ? "pr-10"
          : size === "lg"
            ? "pr-14"
            : "pr-12"
        : "";

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

        <div className={cn(label && "mt-1.5", "relative")}>
          {icon && (
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute left-4 top-1/2 z-10 -translate-y-1/2",
                "text-text-light",
                disabled && "opacity-60",
              )}
            >
              {icon}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            type={actualType}
            disabled={disabled}
            className={cn(
              inputVariants({
                size,
                shape,
                errorState: !!error,
              }),
              iconPadding,
              rightPadding,
              className,
            )}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : undefined}
            {...props}
          />

          {isPassword ? (
            <button
              type="button"
              disabled={disabled}
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              className={cn(
                "absolute right-1 top-1/2 -translate-y-1/2",
                "inline-flex size-10 items-center justify-center",
                "rounded-full",
                "text-text-light",
                "transition-colors",
                "hover:text-text",
                "focus-visible:outline-none",
                "focus-visible:ring-2",
                "focus-visible:ring-primary/30",
                "focus-visible:ring-offset-1",
                "disabled:pointer-events-none",
                "disabled:opacity-50",
                size === "lg" && "size-11",
              )}
            >
              {showPassword ? (
                <EyeOff size={18} strokeWidth={1.8} aria-hidden="true" />
              ) : (
                <Eye size={18} strokeWidth={1.8} aria-hidden="true" />
              )}
            </button>
          ) : rightIcon ? (
            <div
              aria-hidden="true"
              className={cn(
                "pointer-events-none absolute right-4 top-1/2 -translate-y-1/2",
                "text-text-light",
                disabled && "opacity-60",
              )}
            >
              {rightIcon}
            </div>
          ) : null}
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

Input.displayName = "Input";

export { Input };
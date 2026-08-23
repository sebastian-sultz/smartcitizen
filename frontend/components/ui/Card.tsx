import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/*                                    Card                                    */
/* -------------------------------------------------------------------------- */

const cardVariants = cva(["relative w-full min-w-0 text-text", "border"], {
  variants: {
    variant: {
      default: "bg-surface border-border/80 shadow-card",

      surface: "bg-surface border-border/80 shadow-card",

      flat: "bg-surface/70 border-border/60 shadow-none",

      subtle: "bg-bg-alt/50 border-border/60 shadow-none",

      elevated: "bg-surface border-border/70 shadow-lg",

      interactive: [
        "bg-surface border-border/80 shadow-card",
        "cursor-pointer",
        "transition-[transform,box-shadow,border-color] duration-200 ease-out",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg",
        "active:translate-y-0 active:scale-[0.995]",
        "focus-visible:outline-none",
        "focus-visible:ring-2 focus-visible:ring-primary/50",
        "focus-visible:ring-offset-2",
      ].join(" "),

      outline: "bg-transparent border-border shadow-none",

      ghost: "bg-transparent border-transparent shadow-none",

      primary: "bg-primary/5 border-primary/20 shadow-sm",

      accent: "bg-accent/5 border-accent/20 shadow-sm",

      glass: [
        "bg-surface/80",
        "border-border/50",
        "backdrop-blur-xl",
        "shadow-xl",
      ].join(" "),

      dark: "bg-dark text-white border-white/10 shadow-xl",
    },

    shape: {
      default: "rounded-xl sm:rounded-[16px] md:rounded-[20px]",

      sm: "rounded-xl",

      md: "rounded-2xl",

      lg: "rounded-3xl sm:rounded-[24px] md:rounded-[28px]",

      xl: "rounded-3xl sm:rounded-[28px] md:rounded-[32px]",

      pill: "rounded-full",

      none: "rounded-none",

      "mobile-flush": [
        "rounded-none",
        "border-x-0",
        "shadow-none",
        "sm:rounded-2xl sm:border-x sm:shadow-card",
        "md:rounded-[20px]",
      ].join(" "),
    },

    padding: {
      none: "",

      sm: "p-3 sm:p-4",

      default: "",

      md: "p-4 sm:p-6 md:p-8",

      lg: "p-5 sm:p-8 md:p-10",
    },
  },

  defaultVariants: {
    variant: "default",
    shape: "default",
    padding: "default",
  },
});

export interface CardProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, shape, padding, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card"
        className={cn(
          cardVariants({
            variant,
            shape,
            padding,
          }),
          className,
        )}
        {...props}
      />
    );
  },
);

Card.displayName = "Card";

/* -------------------------------------------------------------------------- */
/*                                 CardHeader                                 */
/* -------------------------------------------------------------------------- */

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, bordered = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-header"
        className={cn(
          [
            "peer flex min-w-0 flex-col",
            "px-4 pt-4 pb-3",
            "sm:px-6 sm:pt-6 sm:pb-4",
            "md:px-8 md:pt-8 md:pb-4",
            "gap-1.5",
          ].join(" "),

          bordered &&
            ["border-b border-border/50", "pb-4 sm:pb-5 md:pb-6"].join(" "),

          className,
        )}
        {...props}
      />
    );
  },
);

CardHeader.displayName = "CardHeader";

/* -------------------------------------------------------------------------- */
/*                                  CardTitle                                 */
/* -------------------------------------------------------------------------- */

const cardTitleVariants = cva(
  [
    "min-w-0",
    "font-display font-bold tracking-tight",
    "text-text",
    "leading-tight",
    "break-words",
  ].join(" "),
  {
    variants: {
      size: {
        sm: "text-base sm:text-lg",

        default: "text-lg sm:text-xl md:text-2xl",

        md: "text-xl sm:text-2xl md:text-2xl",

        lg: "text-xl sm:text-2xl md:text-3xl font-extrabold",

        xl: "text-2xl sm:text-3xl md:text-4xl font-extrabold",
      },
    },

    defaultVariants: {
      size: "default",
    },
  },
);

export interface CardTitleProps
  extends
    React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof cardTitleVariants> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "div";
}

const CardTitle = React.forwardRef<HTMLElement, CardTitleProps>(
  ({ className, size, as: Component = "h3", ...props }, ref) => {
    return React.createElement(Component, {
      ...props,
      ref,
      "data-slot": "card-title",
      className: cn(cardTitleVariants({ size }), className),
    });
  },
);

CardTitle.displayName = "CardTitle";

/* -------------------------------------------------------------------------- */
/*                              CardDescription                              */
/* -------------------------------------------------------------------------- */

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      data-slot="card-description"
      className={cn(
        [
          "min-w-0",
          "text-sm text-text-muted",
          "font-normal leading-relaxed",
          "break-words",
        ].join(" "),
        className,
      )}
      {...props}
    />
  );
});

CardDescription.displayName = "CardDescription";

/* -------------------------------------------------------------------------- */
/*                                 CardContent                                */
/* -------------------------------------------------------------------------- */

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-content"
        className={cn(
          [
            "min-w-0",
            "px-4 py-4",
            "sm:px-5 sm:py-3",
            "md:p-5",

            // When CardContent is the first section of a card,
            // it needs its own top spacing (matching pb and px).
            // "first:pt-4",
            // "sm:first:pt-6",
            // "md:first:pt-0",
          ].join(" "),
          className,
        )}
        {...props}
      />
    );
  },
);

CardContent.displayName = "CardContent";

/* -------------------------------------------------------------------------- */
/*                                  CardFooter                                */
/* -------------------------------------------------------------------------- */

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  bordered?: boolean;
}

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, bordered = false, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-footer"
        className={cn(
          [
            "flex min-w-0 items-center gap-3",
            "flex-wrap",
            "px-4 pb-4",
            "sm:px-6 sm:pb-6",
            "md:px-8 md:pb-8",
          ].join(" "),

          bordered &&
            [
              "border-t border-border/50",
              "mt-2",
              "pt-4",
              "sm:pt-5",
              "md:pt-6",
            ].join(" "),

          className,
        )}
        {...props}
      />
    );
  },
);

CardFooter.displayName = "CardFooter";

/* -------------------------------------------------------------------------- */
/*                                  CardAction                                */
/* -------------------------------------------------------------------------- */

export interface CardActionProps extends React.HTMLAttributes<HTMLDivElement> {}

const CardAction = React.forwardRef<HTMLDivElement, CardActionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="card-action"
        className={cn(
          [
            "ml-auto shrink-0",
            "flex items-center gap-2",
            "self-start sm:self-center",
            "max-w-full",
          ].join(" "),
          className,
        )}
        {...props}
      />
    );
  },
);

CardAction.displayName = "CardAction";

/* -------------------------------------------------------------------------- */
/*                                  Exports                                   */
/* -------------------------------------------------------------------------- */

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
  cardVariants,
  cardTitleVariants,
};

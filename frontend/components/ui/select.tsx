"use client";

import * as React from "react";
import { Select as SelectPrimitive } from "radix-ui";
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Select({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Root>) {
  return <SelectPrimitive.Root data-slot="select" {...props} />;
}

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    />
  );
}

function SelectValue({
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}

type SelectTriggerProps = React.ComponentProps<
  typeof SelectPrimitive.Trigger
> & {
  size?: "sm" | "md" | "lg";
  error?: string | boolean;
  label?: React.ReactNode;
};

function SelectTrigger({
  className,
  size = "md",
  error,
  label,
  id: customId,
  disabled,
  children,
  ...props
}: SelectTriggerProps) {
  const reactId = React.useId();
  const id = customId ?? reactId;
  const errorId = `${id}-error`;
  const isError = Boolean(error);
  const errorMessage = typeof error === "string" ? error : undefined;

  const trigger = (
    <SelectPrimitive.Trigger
      id={id}
      data-slot="select-trigger"
      data-size={size}
      disabled={disabled}
      aria-invalid={isError || undefined}
      aria-describedby={errorMessage ? errorId : undefined}
      className={cn(
        "flex w-full min-w-0 items-center justify-between gap-2",
        "bg-bg border outline-none text-text",
        "transition-[border-color,box-shadow,background-color]",
        "whitespace-nowrap",
        "placeholder:text-text-light",
        "focus-visible:outline-none",
        "focus-visible:ring-2",
        "focus-visible:ring-primary/20",
        "disabled:cursor-not-allowed",
        "disabled:opacity-60",
        "disabled:bg-bg/70",
        "data-placeholder:text-text-light",
        "data-[state=open]:border-primary",
        "data-[state=open]:ring-2",
        "data-[state=open]:ring-primary/20",

        isError
          ? [
              "border-danger",
              "focus-visible:border-danger",
              "focus-visible:ring-danger/20",
              "data-[state=open]:border-danger",
              "data-[state=open]:ring-danger/20",
            ].join(" ")
          : "border-border focus-visible:border-primary",

        size === "sm" && "min-h-10 px-4 py-2.5 text-sm",
        size === "md" && "min-h-10 px-4 py-3 text-sm",
        size === "lg" && "min-h-12 px-5 py-3.5 text-base",

        "rounded-lg",

        "[&_svg]:pointer-events-none",
        "[&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-5",

        className,
      )}
      {...props}
    >
      {children}

      <SelectPrimitive.Icon asChild>
        <ChevronDownIcon
          className={cn(
            "shrink-0 text-text-light transition-transform duration-200",
            "group-data-[state=open]:rotate-180",
            size === "sm" && "size-4",
            size === "md" && "size-5",
            size === "lg" && "size-5",
          )}
        />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  );

  if (label || errorMessage) {
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
        <div className={cn(label && "mt-1.5")}>{trigger}</div>
        {errorMessage && (
          <p
            id={errorId}
            role="alert"
            className="ml-1 mt-1 text-xs leading-4 text-danger sm:text-sm sm:leading-5"
          >
            {errorMessage}
          </p>
        )}
      </div>
    );
  }

  return trigger;
}

function SelectContent({
  className,
  children,
  position = "popper",
  align = "start",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Content>) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Content
        data-slot="select-content"
        className={cn(
          "relative z-50 max-h-96 min-w-36 overflow-x-hidden overflow-y-auto",
          "rounded-lg border border-border",
          "bg-surface text-text shadow-card",
          "p-1.5",
          "data-[state=open]:animate-in",
          "data-[state=closed]:animate-out",
          "data-[state=open]:fade-in-0",
          "data-[state=closed]:fade-out-0",
          "data-[state=open]:zoom-in-95",
          "data-[state=closed]:zoom-out-95",
          "data-[side=bottom]:slide-in-from-top-1",
          "data-[side=top]:slide-in-from-bottom-1",
          "data-[side=left]:slide-in-from-right-1",
          "data-[side=right]:slide-in-from-left-1",
          position === "popper" && [
            "data-[side=bottom]:translate-y-1",
            "data-[side=left]:-translate-x-1",
            "data-[side=right]:translate-x-1",
            "data-[side=top]:-translate-y-1",
          ],
          className,
        )}
        position={position}
        align={align}
        {...props}
      >
        <SelectScrollUpButton />

        <SelectPrimitive.Viewport
          data-position={position}
          className={cn(
            "p-0.5",
            position === "popper" &&
              "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
          )}
        >
          {children}
        </SelectPrimitive.Viewport>

        <SelectScrollDownButton />
      </SelectPrimitive.Content>
    </SelectPrimitive.Portal>
  );
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Label>) {
  return (
    <SelectPrimitive.Label
      data-slot="select-label"
      className={cn(
        "px-3 py-2 text-xs font-bold uppercase tracking-wider text-text-muted",
        className,
      )}
      {...props}
    />
  );
}

function SelectItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Item>) {
  return (
    <SelectPrimitive.Item
      data-slot="select-item"
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-2",
        "rounded-md py-2.5 pr-9 pl-3",
        "text-sm font-medium text-text",
        "outline-none",
        "transition-colors",
        "hover:bg-bg",
        "focus:bg-bg",
        "focus:text-primary",
        "data-[disabled]:pointer-events-none",
        "data-[disabled]:opacity-50",
        "[&_svg]:pointer-events-none",
        "[&_svg]:shrink-0",
        "[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <span className="pointer-events-none absolute right-3 flex size-4 items-center justify-center text-primary">
        <SelectPrimitive.ItemIndicator>
          <CheckIcon className="size-4" />
        </SelectPrimitive.ItemIndicator>
      </span>

      <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  );
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

function SelectScrollUpButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollUpButton>) {
  return (
    <SelectPrimitive.ScrollUpButton
      data-slot="select-scroll-up-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center",
        "bg-popover py-1",
        "[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronUpIcon />
    </SelectPrimitive.ScrollUpButton>
  );
}

function SelectScrollDownButton({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.ScrollDownButton>) {
  return (
    <SelectPrimitive.ScrollDownButton
      data-slot="select-scroll-down-button"
      className={cn(
        "z-10 flex cursor-default items-center justify-center",
        "bg-popover py-1",
        "[&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    >
      <ChevronDownIcon />
    </SelectPrimitive.ScrollDownButton>
  );
}

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectScrollDownButton,
  SelectScrollUpButton,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
};
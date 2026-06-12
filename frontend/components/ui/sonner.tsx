"use client";

import { Toaster as Sonner, type ToasterProps } from "sonner";
import {
  CircleCheckIcon,
  InfoIcon,
  TriangleAlertIcon,
  OctagonXIcon,
} from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-5 text-success shrink-0" />,
        info: <InfoIcon className="size-5 text-primary shrink-0" />,
        warning: <TriangleAlertIcon className="size-5 text-accent shrink-0" />,
        error: <OctagonXIcon className="size-5 text-danger shrink-0" />,
        loading: <Spinner className="size-5 text-primary shrink-0" />,
      }}
      style={
        {
          "--normal-bg": "var(--color-surface)",
          "--normal-text": "var(--color-text)",
          "--normal-border": "var(--color-border)",
          "--border-radius": "16px",
          "--font-sans": "var(--font-body)",
          "--gray2": "var(--color-bg-alt)",
          "--gray5": "var(--color-border)",
          "--gray12": "var(--color-text)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-surface text-text border-border border rounded-2xl p-4 shadow-card flex items-center gap-3 font-body font-bold text-sm",
          title: "font-display font-bold text-text text-sm",
          description: "text-text-muted text-xs leading-relaxed font-medium",
          success: "bg-success-bg border-success/15 text-success",
          error: "bg-danger-bg border-danger/15 text-danger",
          warning: "bg-accent/5 border-accent/15 text-accent",
          info: "bg-primary/5 border-primary/15 text-primary",
        },
      }}
      closeButton
      {...props}
    />
  );
};

export { Toaster };

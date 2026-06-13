import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(
  dateVal?: string | Date,
  preset: "long" | "short" | "medium" | "default" | "long-in" | "short-time" = "long"
) {
  if (!dateVal) return "";
  try {
    const date = typeof dateVal === "string" ? new Date(dateVal) : dateVal;
    if (isNaN(date.getTime())) return String(dateVal);

    switch (preset) {
      case "short":
        return date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
      case "medium":
        return date.toLocaleDateString("en-IN", {
          dateStyle: "medium",
        });
      case "long-in":
        return date.toLocaleDateString("en-IN", {
          day: "numeric",
          month: "long",
          year: "numeric",
        });
      case "short-time":
        return date.toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          hour: "2-digit",
          minute: "2-digit",
        });
      case "default":
        return date.toLocaleDateString();
      case "long":
      default:
        return date.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        });
    }
  } catch (e) {
    return String(dateVal);
  }
}

export const downloadBlob = (blob: Blob | string, filename: string) => {
  if (typeof window === "undefined") return;
  const isString = typeof blob === "string";
  const url = isString ? blob : window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  if (!isString) {
    window.URL.revokeObjectURL(url);
  }
};

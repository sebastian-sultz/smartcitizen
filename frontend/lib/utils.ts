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

export function formatUserSlug(id?: string): string {
  if (!id) return "";
  if (id.length > 8) {
    return `GSC-${id.substring(0, 8).toUpperCase()}`;
  }
  return id;
}

export function compressImage(
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.85
): Promise<File> {
  return new Promise((resolve, reject) => {
    // Canvas is only supported on browser side
    if (typeof window === "undefined" || !window.HTMLCanvasElement) {
      resolve(file);
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(file);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            const nameWithoutExtension = file.name.replace(/\.[^/.]+$/, "");
            const newFile = new File([blob], `${nameWithoutExtension}.jpg`, {
              type: "image/jpeg",
              lastModified: Date.now(),
            });
            resolve(newFile);
          },
          "image/jpeg",
          quality
        );
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

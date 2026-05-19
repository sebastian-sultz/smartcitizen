import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function cva(base: string, config: any) {
  return function(props: any) {
    const variants = config?.variants || {};
    const defaultVariants = config?.defaultVariants || {};
    let classes: ClassValue[] = [base];
    for (const key in variants) {
      const variantValue = props?.[key] ?? defaultVariants[key];
      if (variantValue && variants[key][variantValue]) {
        classes.push(variants[key][variantValue]);
      }
    }
    return cn(...classes);
  }
}

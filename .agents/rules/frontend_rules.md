---
trigger: always_on
description: Strict frontend coding rules for React components, Next.js Image optimization, and Tailwind CSS styling.
---

## Frontend Coding Rules

This project enforces strict frontend coding rules for Next.js, React, and Tailwind CSS. Always follow these guidelines when writing, refactoring, or editing frontend code.

### 1. Preferred UI Components
Do not use raw HTML tags if a corresponding custom UI component is available in [frontend/components/ui/](file:///Users/sebastian/Desktop/c1/Code/smartcitizen/frontend/components/ui/).
* **Buttons**: Always use `Button` from `@/components/ui/Button` instead of raw `<button>`.
* **Inputs**: Always use `Input` from `@/components/ui/Input` instead of raw `<input>`.
* **Badges**: Always use `Badge` from `@/components/ui/Badge` instead of styled divs/spans.
* **Cards**: Always use components from `@/components/ui/Card` (`Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`) instead of generic styled divs.
* **Empty State**: Always use `EmptyState` from `@/components/ui/EmptyState` for empty lists or searches.
* **Modals / Dialogs**: Always use the components from `@/components/ui/dialog` (such as `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, etc.) for overlays.
* **Checkboxes**: Always use `Checkbox` from `@/components/ui/checkbox`.
* **Select Dropdowns**: Always use the components from `@/components/ui/select`.
* **Separators**: Always use `Separator` from `@/components/ui/separator` for horizontal/vertical lines.
* **Skeletons**: Always use `Skeleton` from `@/components/ui/skeleton` for loading placeholders.
* **Spinners**: Always use `Spinner` from `@/components/ui/spinner` for loading indicators.
* **Switches**: Always use `Switch` from `@/components/ui/switch` for toggle buttons.
* **Tables**: Always use the table components from `@/components/ui/table` or `@/components/ui/TableComponent`.
* **Tabs**: Always use components from `@/components/ui/tabs`.
* **Tooltips**: Always use components from `@/components/ui/tooltip`.

### 2. Next.js Image Optimization
* **Never** use raw `<img>` tags for images in frontend components or pages.
* **Always** import and use the Next.js `Image` component from `next/image`:
  ```tsx
  import Image from "next/image";
  ```
* Always specify appropriate optimization props:
  * Provide `alt` descriptive text.
  * Provide explicit `width` and `height` to prevent Layout Shift, or use `fill` with a parent element having `position: relative` (Tailwind class `relative`).
  * Use the `priority` prop for above-the-fold images.
  * Define suitable `sizes` for responsive image sizing.

### 3. Styling with Tailwind CSS
* **Always** use Tailwind utility classes for all styling, spacing, colors, layouts, typography, and interactive behaviors (hover, focus, active).
* **Never** use inline `style` props, except for dynamically calculated dimensions/percentages, background image URLs, or CSS variables.
* **Never** write plain CSS or CSS modules. Rely entirely on Tailwind classes and the color/spacing config defined in `tailwind.config.js` and `frontend/app/globals.css`.

### 4. General React & TypeScript Standards
* Maintain strong typescript safety. Explicitly type all parameters, component props, and API response structures. Avoid the `any` type.
* Ensure code is clean, responsive, and uses semantic elements (e.g. `<article>`, `<section>`, `<header>`, `<footer>`, etc.) properly.
* **Form State Management**: Always prefer the `useFormik` hook over the `<Formik>` and `<Form>` component wrappers. This avoids deeply nested JSX wrappers and keeps form initialization, validation, and submission logic clean, readable, and highly maintainable.

### 5. Mobile-First and Theme Responsive Design
* **Mobile-First Development**: Design interfaces starting from the smallest screen size (mobile viewports). Use base Tailwind classes to target mobile screens, and apply screen size prefixes (e.g., `sm:`, `md:`, `lg:`, `xl:`) only when scaling up layouts for larger screens.
* **Theme Compliance**: Follow the project's design system using the HSL color variables and Tailwind custom class tokens configured in `tailwind.config.js` and `globals.css` (e.g., use classes like `text-primary`, `bg-bg`, `border-border`, etc. instead of hardcoded hex values).
* **Responsive Spacing**: Ensure padding, margin, and typography scale appropriately for different viewports (e.g., use `p-6 md:p-12`, `py-12 md:py-16`, and `text-2xl md:text-4xl`).



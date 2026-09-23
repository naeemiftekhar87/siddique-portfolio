import * as React from "react"
import { cn } from "cn"

// Design variants shared by Input, Textarea, and NativeSelect: exact classes
// from the ported design. Width and padding tweaks are passed via className.
export const fieldDesignVariants = {
  "admin-field":
    "px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500",
  "admin-field-dark":
    "bg-slate-900 border border-slate-800 rounded-xl text-slate-200 text-sm focus:outline-none focus:border-blue-500",
  "site-field":
    "px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-blue-100 focus:bg-white transition-all",
  "site-search":
    "pl-9 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-cyan-400 focus:ring-2",
  /** No preset styles: pass the full design via className. */
  unstyled: "",
} as const

export type FieldVariant = "default" | keyof typeof fieldDesignVariants

function Input({
  className,
  type,
  variant = "default",
  ...props
}: React.ComponentProps<"input"> & { variant?: FieldVariant }) {
  const design = variant !== "default"
  return (
    <input
      type={type}
      data-slot="input"
      data-design={design ? "" : undefined}
      className={variant === "unstyled" ? className : cn(
        design
          ? fieldDesignVariants[variant]
          : "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }

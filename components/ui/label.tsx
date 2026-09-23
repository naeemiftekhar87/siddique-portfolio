"use client"

import * as React from "react"
import { cn } from "cn"
import { Label as LabelPrimitive } from "radix-ui"

// Design variants: exact classes from the ported design (margins via className).
const labelDesignVariants = {
  "admin-label": "block text-xs text-slate-400",
  "site-label": "block text-sm font-medium text-slate-700",
  /** No preset styles: pass the full design via className. */
  unstyled: "",
} as const

function Label({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root> & {
  variant?: "default" | keyof typeof labelDesignVariants
}) {
  const design = variant !== "default"
  return (
    <LabelPrimitive.Root
      data-slot="label"
      data-design={design ? "" : undefined}
      className={variant === "unstyled" ? className : cn(
        design
          ? labelDesignVariants[variant]
          : "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
}

export { Label }

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

// shadcn's stock base styles. Only the stock variants use them; the design
// variants below reproduce the ported site/admin design exactly, so they must
// not inherit sizing, borders, or the forced icon size.
const stockBase =
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

// Design variants: exact classes from the ported design. Layout and spacing
// (flex, gap, padding, width) are passed per use via className.
const designVariants = {
  "admin-primary":
    "bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 transition-colors",
  "admin-secondary":
    "bg-slate-800 text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-700 transition-colors",
  "admin-outline":
    "bg-slate-800 text-slate-300 text-sm font-medium rounded-xl border border-slate-700 hover:border-slate-600 transition-colors",
  "admin-icon-danger":
    "p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-950/30 transition-all",
  "admin-icon-edit":
    "p-1.5 rounded-lg text-slate-500 hover:text-amber-400 hover:bg-amber-950/30 transition-all",
  "admin-icon-info":
    "p-1.5 rounded-lg text-slate-500 hover:text-blue-400 hover:bg-blue-950/30 transition-all",
  "admin-icon-teal":
    "p-1.5 rounded-lg text-slate-500 hover:text-teal-400 hover:bg-teal-950/30 transition-all",
  "admin-ghost":
    "p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-all",
  "admin-ghost-danger":
    "p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-all",
  "admin-danger-sm":
    "px-3 py-1.5 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700",
  // Public site (padding, text size, transition, shadow via className)
  "site-primary": "bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700",
  "site-glass": "bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20",
  "site-outline": "bg-white border border-slate-200 rounded-xl",
  /** No preset styles: pass the full design via className. */
  unstyled: "",
} as const

type DesignVariant = keyof typeof designVariants

const buttonVariants = cva("", {
  variants: {
    variant: {
      default: cn(stockBase, "bg-primary text-primary-foreground hover:bg-primary/80"),
      outline: cn(
        stockBase,
        "border-border bg-background hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:border-input dark:bg-input/30 dark:hover:bg-input/50"
      ),
      secondary: cn(
        stockBase,
        "bg-secondary text-secondary-foreground hover:bg-[color-mix(in_oklch,var(--secondary),var(--foreground)_5%)] aria-expanded:bg-secondary aria-expanded:text-secondary-foreground"
      ),
      ghost: cn(
        stockBase,
        "hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50"
      ),
      destructive: cn(
        stockBase,
        "bg-destructive/10 text-destructive hover:bg-destructive/20 focus-visible:border-destructive/40 focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40"
      ),
      link: cn(stockBase, "text-primary underline-offset-4 hover:underline"),
      ...designVariants,
    },
    size: {
      default:
        "h-8 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      xs: "h-6 gap-1 rounded-[min(var(--radius-md),10px)] px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
      sm: "h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3.5",
      lg: "h-9 gap-1.5 px-2.5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
      icon: "size-8",
      "icon-xs":
        "size-6 rounded-[min(var(--radius-md),10px)] in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
      "icon-sm":
        "size-7 rounded-[min(var(--radius-md),12px)] in-data-[slot=button-group]:rounded-lg",
      "icon-lg": "size-9",
      /** Used by design variants: sizing comes from className. */
      none: "",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

function isDesignVariant(variant: string): variant is DesignVariant {
  return variant in designVariants
}

function Button({
  className,
  variant = "default",
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const design = isDesignVariant(variant ?? "default")
  const resolvedSize = size ?? (design ? "none" : "default")

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={resolvedSize}
      data-design={design ? "" : undefined}
      className={
        variant === "unstyled"
          ? className
          : cn(buttonVariants({ variant, size: resolvedSize }), className)
      }
      {...props}
    />
  )
}

export { Button, buttonVariants }

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { Slot } from "radix-ui"

const stockBase =
  "group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!"

const badgeVariants = cva(
  "",
  {
    variants: {
      variant: {
        default: stockBase + " " + "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          stockBase + " " + "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          stockBase + " " + "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          stockBase + " " + "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          stockBase + " " + "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: stockBase + " " + "text-primary underline-offset-4 hover:underline",
        /** No preset styles: pass the full design via className (no merging). */
        unstyled: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      data-design={variant === "unstyled" ? "" : undefined}
      className={
        variant === "unstyled" ? className : cn(badgeVariants({ variant }), className)
      }
      {...props}
    />
  )
}

export { Badge, badgeVariants }

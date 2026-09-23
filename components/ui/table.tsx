"use client"

import * as React from "react"
import { cn } from "cn"

type TableVariant = { variant?: "default" | "unstyled" }

function Table({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"table"> & TableVariant) {
  // "unstyled": bare <table> (no scroll container, no preset classes) for the
  // ported design, which styles tables entirely via className.
  if (variant === "unstyled") {
    return <table data-slot="table" data-design="" className={className} {...props} />
  }
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  )
}

function TableHeader({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"thead"> & TableVariant) {
  return (
    <thead
      data-slot="table-header"
      data-design={variant === "unstyled" ? "" : undefined}
      className={variant === "unstyled" ? className : cn("[&_tr]:border-b", className)}
      {...props}
    />
  )
}

function TableBody({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"tbody"> & TableVariant) {
  return (
    <tbody
      data-slot="table-body"
      data-design={variant === "unstyled" ? "" : undefined}
      className={variant === "unstyled" ? className : cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  )
}

function TableFooter({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"tfoot"> & TableVariant) {
  return (
    <tfoot
      data-slot="table-footer"
      data-design={variant === "unstyled" ? "" : undefined}
      className={variant === "unstyled" ? className : cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
      {...props}
    />
  )
}

function TableRow({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"tr"> & TableVariant) {
  return (
    <tr
      data-slot="table-row"
      data-design={variant === "unstyled" ? "" : undefined}
      className={variant === "unstyled" ? className : cn("border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted", className)}
      {...props}
    />
  )
}

function TableHead({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"th"> & TableVariant) {
  return (
    <th
      data-slot="table-head"
      data-design={variant === "unstyled" ? "" : undefined}
      className={variant === "unstyled" ? className : cn("h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  )
}

function TableCell({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"td"> & TableVariant) {
  return (
    <td
      data-slot="table-cell"
      data-design={variant === "unstyled" ? "" : undefined}
      className={variant === "unstyled" ? className : cn("p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0", className)}
      {...props}
    />
  )
}

function TableCaption({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"caption"> & TableVariant) {
  return (
    <caption
      data-slot="table-caption"
      data-design={variant === "unstyled" ? "" : undefined}
      className={variant === "unstyled" ? className : cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}

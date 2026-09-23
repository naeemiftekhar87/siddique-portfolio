"use client";

import { useEffect } from "react";

/**
 * Adds the admin theme classes to <html> while an admin route is mounted so
 * shadcn portals (Dialog, Select, Popover, Sonner), which render outside the
 * admin wrapper, are dark too. See docs/design.md §4.
 */
export function AdminHtmlTheme() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("admin-theme", "dark");
    return () => root.classList.remove("admin-theme", "dark");
  }, []);

  return null;
}

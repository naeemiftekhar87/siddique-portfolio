const FIRST_FIELD =
  "input:not([type=hidden]):not([type=file]):not([type=checkbox]):not([type=color]):not([disabled]), textarea:not([disabled]), select:not([disabled])";

/**
 * Callback ref for an admin add/edit form: when the form opens, scroll it into
 * view (the admin scrolls inside <main>, not the window) and focus its first
 * field, so it is obvious where to type.
 *
 * It is a module-level function, so React calls it only when the element
 * mounts. Give a shared form a `key` per entry so opening another entry
 * remounts it and runs this again.
 */
export function revealForm(el: HTMLElement | null) {
  if (!el) return;
  requestAnimationFrame(() => {
    if (!el.isConnected) return;
    const scroller = el.closest("main");
    const top = el.getBoundingClientRect().top - (scroller?.getBoundingClientRect().top ?? 0);
    // Only scroll when the form starts above the view or low on the screen.
    if (top < 0 || top > window.innerHeight * 0.5) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      el.style.scrollMarginTop = "24px";
      el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    }
    el.querySelector<HTMLElement>(FIRST_FIELD)?.focus({ preventScroll: true });
  });
}

"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { animate, inView } from "motion";

// Site-wide animation on Motion (formerly Framer Motion), run on the server-
// rendered DOM so page components stay unchanged:
//  - Header banners (.site-hero): their content rises in with a stagger.
//  - Scroll reveal: glass cards and section headings below the fold rise in as
//    they enter the viewport, staggered among siblings.
// Inline styles are cleared afterwards so hover effects keep working.
// Reduced motion: everything is shown immediately.

const EASE = [0.2, 0.7, 0.2, 1] as const;
const REVEAL_SELECTOR = [
  ".site-public .glass-card",
  ".site-public [data-reveal]",
  ".site-public h2",
].join(", ");

function settle(el: HTMLElement) {
  el.style.removeProperty("opacity");
  el.style.removeProperty("transform");
  el.style.removeProperty("filter");
  el.removeAttribute("data-motion-pending");
  el.setAttribute("data-motion-done", "");
}

export default function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const stops: Array<() => void> = [];
    // Elements mid-animation; reset on cleanup so the next run redoes them
    // (route change, or React's development double-run of effects).
    const active = new Set<HTMLElement>();
    const done = (el: HTMLElement) => {
      active.delete(el);
      settle(el);
    };

    const heroes = () => {
      const items = document.querySelectorAll<HTMLElement>(".site-public .site-hero > * > *:not([data-motion-done])");
      items.forEach((el, i) => {
        if (reduced) return settle(el);
        el.setAttribute("data-motion-done", "");
        active.add(el);
        const controls = animate(
          el,
          { opacity: [0, 1], y: [18, 0], filter: ["blur(6px)", "blur(0px)"] },
          { duration: 0.8, delay: Math.min(i, 5) * 0.08, ease: EASE },
        );
        controls.then(() => done(el));
        stops.push(() => controls.stop());
      });
    };

    const reveals = () => {
      const counts = new Map<Element, number>();
      document.querySelectorAll<HTMLElement>(REVEAL_SELECTOR).forEach((el) => {
        if (el.hasAttribute("data-motion-seen") || el.closest(".site-hero, [data-motion-managed]")) return;
        el.setAttribute("data-motion-seen", "");
        // Already on screen: leave it alone (no flash of hidden content).
        if (reduced || el.getBoundingClientRect().top < window.innerHeight * 0.92) return;

        const parent = el.parentElement ?? document.body;
        const index = counts.get(parent) ?? 0;
        counts.set(parent, index + 1);
        el.setAttribute("data-motion-pending", "");
        active.add(el);
        el.style.opacity = "0";
        el.style.transform = "translateY(28px) scale(0.985)";

        const stop = inView(
          el,
          () => {
            const controls = animate(
              el,
              { opacity: [0, 1], y: [28, 0], scale: [0.985, 1] },
              { duration: 0.7, delay: Math.min(index, 5) * 0.07, ease: EASE },
            );
            controls.then(() => done(el));
          },
          { margin: "0px 0px -8% 0px" },
        );
        stops.push(stop);
      });
    };

    const run = () => {
      heroes();
      reveals();
    };
    run();
    // Content that appears later (filters, tabs, expanding cards) is picked up
    // too; at most one scan per frame.
    let frame = 0;
    const observer = new MutationObserver(() => {
      if (!frame) frame = requestAnimationFrame(() => { frame = 0; run(); });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      stops.forEach((stop) => stop());
      active.forEach((el) => {
        ["opacity", "transform", "filter"].forEach((p) => el.style.removeProperty(p));
        ["data-motion-pending", "data-motion-seen", "data-motion-done"].forEach((a) => el.removeAttribute(a));
      });
    };
  }, [pathname]);

  return null;
}

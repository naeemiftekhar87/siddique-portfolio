"use client";

import { useEffect, useRef, useState } from "react";

const DURATION_MS = 1200;

/**
 * Counts the number inside `value` ("12", "5+", "1,200") up from zero the
 * first time it scrolls into view. The final value is what renders on the
 * server and without JavaScript; reduced-motion users and non-numeric values
 * just see the final value.
 */
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const match = value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
    const el = ref.current;
    if (!match || !el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, prefix, numText, suffix] = match;
    const target = Number(numText.replace(/,/g, ""));
    const decimals = numText.split(".")[1]?.length ?? 0;
    if (!Number.isFinite(target) || target === 0) return;

    let frame = 0;
    const format = (n: number) =>
      `${prefix}${n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        // rAF timestamps can precede `start` slightly; clamp so the first frame is never negative ("-0").
        const t = Math.min(Math.max((now - start) / DURATION_MS, 0), 1);
        const eased = 1 - (1 - t) ** 3;
        setDisplay(format(target * eased));
        if (t < 1) frame = requestAnimationFrame(tick);
        else setDisplay(value);
      };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}

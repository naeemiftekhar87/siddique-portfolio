"use client";

import { useLayoutEffect, useRef } from "react";

// A4 at 96 dpi: 210 × 297 mm.
const SHEET_W = 793.7;
const SHEET_H = 1122.5;
// Below this the text gets too small to read; longer content flows onto a
// second page instead (reduce the section limits in Admin → Resume).
const MIN_FIT = 0.6;

/**
 * An A4 page for a resume document, identical on screen and in print
 * ("Download PDF" = Save as PDF). The document is laid out at A4 width; if it
 * is taller than one page it is scaled down (CSS zoom, re-flowed at the wider
 * width so it still fills the page) until it fits, so the PDF is one page.
 * On narrow screens the whole sheet is zoomed to the available width.
 *
 * Content inside must not use viewport breakpoints (sm:, md:…): the sheet is
 * always A4 wide, whatever the screen.
 */
export function ResumeSheet({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const frame = frameRef.current, sheet = sheetRef.current, content = contentRef.current;
    if (!frame || !sheet || !content) return;

    const fit = () => {
      // Measure unzoomed, at the width the content would get at scale f.
      sheet.style.zoom = "1";
      content.style.zoom = "1";
      content.style.minHeight = "0";
      const fits = (f: number) => {
        content.style.width = `${SHEET_W / f}px`;
        return content.scrollHeight * f <= SHEET_H;
      };
      let f = 1;
      let overflow = false;
      if (!fits(1)) {
        let lo = MIN_FIT, hi = 1;
        for (let i = 0; i < 10; i++) {
          const mid = (lo + hi) / 2;
          if (fits(mid)) lo = mid; else hi = mid;
        }
        f = lo;
        overflow = !fits(f);
      }
      content.style.width = `${SHEET_W / f}px`;
      content.style.zoom = String(f);
      // Fill the page so column backgrounds reach the bottom edge.
      content.style.minHeight = overflow ? "0" : `${SHEET_H / f}px`;
      sheet.dataset.overflow = String(overflow);
      sheet.style.zoom = String(Math.min(1, frame.clientWidth / SHEET_W));
    };

    let raf = 0;
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(fit);
    };
    fit();
    document.fonts?.ready.then(schedule);
    // Images (photo, logos) can change the height once loaded.
    content.addEventListener("load", schedule, true);
    const ro = new ResizeObserver(schedule);
    ro.observe(frame);
    // Ctrl+P / the Download button: make sure the layout is current.
    window.addEventListener("beforeprint", fit);
    return () => {
      cancelAnimationFrame(raf);
      content.removeEventListener("load", schedule, true);
      ro.disconnect();
      window.removeEventListener("beforeprint", fit);
    };
  }, []);

  return (
    <div ref={frameRef} className="resume-frame w-full max-w-[210mm] mx-auto">
      <div ref={sheetRef} className={`resume-sheet ${className}`}>
        <div ref={contentRef} className="resume-content flex flex-col">
          {children}
        </div>
      </div>
    </div>
  );
}

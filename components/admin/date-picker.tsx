"use client";

import { useState } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { format, isValid, parse } from "date-fns";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type DatePickerProps = {
  id: string;
  value: string;
  onChange: (value: string) => void;
  precision?: "date" | "month" | "year";
  allowPresent?: boolean;
};

// Accept the existing human-readable dates without changing them on load.
function readDate(value: string): Date | undefined {
  for (const pattern of ["yyyy-MM-dd", "MMM yyyy", "MMMM yyyy", "MMM d, yyyy", "MMMM d, yyyy", "d MMM yyyy", "yyyy-MM", "yyyy", "M/d/yyyy"]) {
    const date = parse(value.trim(), pattern, new Date(2000, 0, 1));
    if (isValid(date)) return date;
  }
}

/** Admin date fields keep their existing string contracts and public formatting. */
export function DatePicker({ id, value, onChange, precision = "date", allowPresent = false }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const selected = value ? readDate(value) : undefined;
  const [yearStart, setYearStart] = useState(2000);
  const placeholder = precision === "year" ? "Pick a year" : precision === "month" ? "Pick a month and year" : "Pick a date";

  const choose = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={(next) => {
      if (next) setYearStart(Math.max(1900, Math.min(2189, (selected?.getFullYear() ?? new Date().getFullYear()) - 5)));
      setOpen(next);
    }}>
      <PopoverTrigger asChild>
        <Button id={id} type="button" variant="admin-outline"
          className="flex w-full min-w-0 items-center justify-between gap-2 px-3 py-2.5 text-left font-normal focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400">
          <span className={`truncate ${value ? "text-slate-200" : "text-slate-400"}`}>
            {value || placeholder}
          </span>
          <CalendarIcon size={16} className="shrink-0 text-slate-400" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start"
        className="dark w-auto max-w-[calc(100vw-2rem)] border border-slate-700 bg-slate-900 p-0 text-slate-100 scheme-dark [--background:var(--color-slate-900)] [--foreground:var(--color-slate-100)] [--popover:var(--color-slate-900)] [--popover-foreground:var(--color-slate-100)] [--muted:var(--color-slate-800)] [--muted-foreground:var(--color-slate-400)] [--primary:var(--color-blue-600)] [--primary-foreground:var(--color-white)] [--border:var(--color-slate-700)] [--ring:var(--color-blue-400)]"
        aria-label={placeholder}>
        {precision === "year" ? (
          <div className="w-64 p-3">
            <div className="mb-3 flex items-center justify-between gap-2">
              <Button type="button" variant="ghost" size="icon-sm" aria-label="Previous years"
                disabled={yearStart === 1900} onClick={() => setYearStart(Math.max(1900, yearStart - 12))}>
                <ChevronLeft />
              </Button>
              <span className="text-sm" aria-live="polite">{yearStart}–{Math.min(2200, yearStart + 11)}</span>
              <Button type="button" variant="ghost" size="icon-sm" aria-label="Next years"
                disabled={yearStart + 11 >= 2200} onClick={() => setYearStart(Math.min(2189, yearStart + 12))}>
                <ChevronRight />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 12 }, (_, index) => yearStart + index).map((year) => (
                <Button key={year} type="button" variant={value === String(year) ? "default" : "ghost"}
                  aria-pressed={value === String(year)} onClick={() => choose(String(year))}>
                  {year}
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <Calendar mode="single" selected={selected} defaultMonth={selected} className="[--cell-size:--spacing(9)]"
            captionLayout="dropdown" startMonth={new Date(1900, 0)} endMonth={new Date(2200, 11)}
            disabled={{ before: new Date(1900, 0, 1), after: new Date(2200, 11, 31) }}
            autoFocus
            onSelect={(date) => {
              if (date) choose(format(date, precision === "month" ? "MMM yyyy" : "yyyy-MM-dd"));
            }}
          />
        )}
        <div className="flex items-center justify-between gap-2 border-t border-slate-700 p-2">
          <Button type="button" variant="ghost" size="sm" disabled={!value} onClick={() => choose("")}>Clear</Button>
          {allowPresent && <Button type="button" variant="ghost" size="sm" onClick={() => choose("Present")}>Present</Button>}
        </div>
      </PopoverContent>
    </Popover>
  );
}

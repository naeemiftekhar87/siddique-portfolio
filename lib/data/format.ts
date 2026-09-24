/** "Jan 2024 – Present", or whichever end is known; empty when neither is. */
export function dateRange(start: string, end: string) {
  return start && end ? `${start} – ${end}` : start || end;
}

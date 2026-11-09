import { isValid, parse } from "date-fns";

/** Supported stored dates: calendar ISO dates, month/year labels and legacy years. */
export function parseContentDate(value: string): Date | undefined {
  for (const pattern of ["yyyy-MM-dd", "MMM yyyy", "MMMM yyyy", "MMM, yyyy", "MMMM, yyyy", "MMM d, yyyy", "MMMM d, yyyy", "d MMM yyyy", "yyyy-MM", "yyyy", "M/d/yyyy"]) {
    const date = parse(value.trim(), pattern, new Date(2000, 0, 1));
    if (isValid(date)) return date;
  }
}

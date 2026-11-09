import type { Achievement, Certificate, EBook, Education, Experience, Paper, UpcomingResearch } from "./schemas";
import { parseContentDate } from "./dates";

type ContentDate = string | number | null | undefined;

function dateKey(value: ContentDate): number {
  if (value == null || value === "") return -Infinity;
  if (typeof value === "string" && /^present$/i.test(value.trim())) return Infinity;
  const date = parseContentDate(String(value));
  // Compare calendar parts, never UTC timestamps or alphabetic month labels.
  return date ? date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate() : -Infinity;
}

/** Returns a new array; dated content first, then most recently added for ties. */
function newestFirst<T extends { id: number }>(items: readonly T[], ...dates: ((item: T) => ContentDate)[]): T[] {
  const keyed = items.map((item) => ({ item, keys: dates.map((getDate) => dateKey(getDate(item))) }));
  keyed.sort((a, b) => {
    for (let i = 0; i < a.keys.length; i++) {
      if (a.keys[i] !== b.keys[i]) return a.keys[i] > b.keys[i] ? -1 : 1;
    }
    return b.item.id - a.item.id;
  });
  return keyed.map(({ item }) => item);
}

export const orderExperiences = (items: readonly Experience[]) =>
  newestFirst(items, (item) => item.endDate || item.startDate, (item) => item.startDate);

export const orderEducation = (items: readonly Education[]) =>
  newestFirst(items, (item) => item.endDate || (item.status === "In Progress" ? "Present" : item.startDate), (item) => item.startDate);

export const orderAchievements = (items: readonly Achievement[]) => newestFirst(items, (item) => item.date);
export const orderCertificates = (items: readonly Certificate[]) => newestFirst(items, (item) => item.completionDate);
export const orderPapers = (items: readonly Paper[]) => newestFirst(items, (item) => item.year ?? item.submissionDate, (item) => item.submissionDate);
export const orderUpcomingResearch = (items: readonly UpcomingResearch[]) => newestFirst(items, (item) => item.expectedYear);
export const orderEbooks = (items: readonly EBook[]) => newestFirst(items, (item) => item.year);

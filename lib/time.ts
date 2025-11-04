import { format, formatDistance, isAfter, isBefore, parseISO, isValid } from "date-fns";

function safeParseDate(date: string | Date | null | undefined): Date | null {
  if (!date) return null;
  if (date instanceof Date) {
    return isValid(date) ? date : null;
  }
  try {
    const parsed = parseISO(date);
    return isValid(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export function formatDate(date: string | Date | null | undefined): string {
  const d = safeParseDate(date);
  if (!d) return "Invalid date";
  return format(d, "MMM d, yyyy");
}

export function formatDateTime(date: string | Date | null | undefined): string {
  const d = safeParseDate(date);
  if (!d) return "Invalid date";
  return format(d, "MMM d, yyyy h:mm a");
}

export function formatTime(date: string | Date | null | undefined): string {
  const d = safeParseDate(date);
  if (!d) return "Invalid time";
  return format(d, "h:mm a");
}

export function formatRelative(date: string | Date | null | undefined): string {
  const d = safeParseDate(date);
  if (!d) return "Invalid date";
  return formatDistance(d, new Date(), { addSuffix: true });
}

export function isDueSoon(dueAt: string | null | undefined, hoursThreshold: number = 48): boolean {
  const due = safeParseDate(dueAt);
  if (!due) return false;
  const threshold = new Date();
  threshold.setHours(threshold.getHours() + hoursThreshold);
  return isAfter(due, new Date()) && isBefore(due, threshold);
}

export function isOverdue(dueAt: string | null | undefined): boolean {
  const due = safeParseDate(dueAt);
  if (!due) return false;
  return isBefore(due, new Date());
}

export function isUpcoming(startAt: string | null | undefined, hoursThreshold: number = 72): boolean {
  const start = safeParseDate(startAt);
  if (!start) return false;
  const threshold = new Date();
  threshold.setHours(threshold.getHours() + hoursThreshold);
  return isAfter(start, new Date()) && isBefore(start, threshold);
}

export function getWeekDates(): Date[] {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday
  const monday = new Date(today);
  monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    return date;
  });
}

export function isSameDay(date1: string | Date, date2: string | Date): boolean {
  const d1 = typeof date1 === "string" ? parseISO(date1) : date1;
  const d2 = typeof date2 === "string" ? parseISO(date2) : date2;
  return (
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate()
  );
}


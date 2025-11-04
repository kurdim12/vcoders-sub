import { format, formatDistance, isAfter, isBefore, parseISO } from "date-fns";

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy h:mm a");
}

export function formatTime(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "h:mm a");
}

export function formatRelative(date: string | Date): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return formatDistance(d, new Date(), { addSuffix: true });
}

export function isDueSoon(dueAt: string, hoursThreshold: number = 48): boolean {
  const due = parseISO(dueAt);
  const threshold = new Date();
  threshold.setHours(threshold.getHours() + hoursThreshold);
  return isAfter(due, new Date()) && isBefore(due, threshold);
}

export function isOverdue(dueAt: string): boolean {
  return isBefore(parseISO(dueAt), new Date());
}

export function isUpcoming(startAt: string, hoursThreshold: number = 72): boolean {
  const start = parseISO(startAt);
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


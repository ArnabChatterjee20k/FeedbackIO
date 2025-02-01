import { format, addDays, subDays, parse } from "date-fns";

const FORMAT = "yyyy-MM-dd";

export function formatDate(date: Date) {
  return format(date, FORMAT);
}

export function getToday() {
  return formatDate(new Date());
}

export function getYesterday() {
  return formatDate(subDays(new Date(), 1));
}

export function getTomorrow() {
  return formatDate(addDays(new Date(), 1));
}

export function getSevenDaysAgo() {
  return formatDate(subDays(new Date(), 7));
}

export function getThirtyDaysAgo() {
  return formatDate(subDays(new Date(), 30));
}

export function getDate(days: number) {
  return formatDate(addDays(new Date(), days));
}
export function getPreviousDay(date: string) {
  const parsedDate = parse(date, FORMAT, new Date());
  return format(subDays(parsedDate, 1), FORMAT);
}

export function getDateFromString(date: string) {
  return parse(date, FORMAT, new Date());
}

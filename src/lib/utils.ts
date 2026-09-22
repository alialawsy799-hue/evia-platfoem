import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const LATIN_LOCALE = "en-US";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, fractionDigits = 0) {
  return new Intl.NumberFormat(LATIN_LOCALE, {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(value);
}

export function formatPrice(amount: number) {
  return `${formatNumber(Math.round(amount))} د.ع`;
}

export function formatDate(value: string | number | Date) {
  return new Intl.DateTimeFormat(LATIN_LOCALE, {
    dateStyle: "medium",
  }).format(new Date(value));
}

export function formatDateTime(value: string | number | Date) {
  return new Intl.DateTimeFormat(LATIN_LOCALE, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatDuration(minutes: number) {
  if (minutes < 60) return `${formatNumber(minutes)} د`;
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest
    ? `${formatNumber(hours)} س ${formatNumber(rest)} د`
    : `${formatNumber(hours)} ساعة`;
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u0600-\u06FF-]+/g, "");
}

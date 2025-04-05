
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a number as a currency string in USD.
 * Handles null and undefined values by defaulting to 0.
 */
export function formatCurrency(value: number | null | undefined): string {
  // Ensure value is a number or defaults to 0
  const numericValue = value === null || value === undefined ? 0 : value;
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(numericValue);
}

/**
 * Generates a unique ID for use in file naming, database entries, etc.
 * Uses a combination of timestamp and random characters.
 */
export function generateUniqueId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomStr}`;
}

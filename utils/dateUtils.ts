/**
 * Centralized date utilities for consistent date handling across the application
 * All dates are formatted as YYYY-MM-DD strings for storage and ISO compatibility
 */

/**
 * Formats a Date object to YYYY-MM-DD string format
 * Uses local timezone to avoid timezone conversion issues
 */
export const formatDateToString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Parses a YYYY-MM-DD string to a Date object
 * Uses local timezone to avoid timezone conversion issues
 */
export const parseStringToDate = (dateStr: string): Date => {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Generates an array of Date objects between start and end dates (inclusive)
 */
export const generateDateRange = (startDate: Date, endDate: Date): Date[] => {
  const dates: Date[] = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};

/**
 * Generates an array of YYYY-MM-DD strings between start and end dates (inclusive)
 */
export const generateDateStringRange = (startDate: Date, endDate: Date): string[] => {
  return generateDateRange(startDate, endDate).map(formatDateToString);
};

/**
 * Checks if two dates are the same day (ignoring time)
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

/**
 * Checks if a date is a weekend (Saturday or Sunday)
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday = 0, Saturday = 6
};

/**
 * Gets today's date as a YYYY-MM-DD string
 */
export const getTodayString = (): string => {
  return formatDateToString(new Date());
};

/**
 * Validates if a date string is in valid YYYY-MM-DD format
 */
export const isValidDateString = (dateStr: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;

  const date = parseStringToDate(dateStr);
  return formatDateToString(date) === dateStr;
};

/**
 * Compares two date strings
 * Returns: -1 if date1 < date2, 0 if equal, 1 if date1 > date2
 */
export const compareDateStrings = (date1: string, date2: string): number => {
  if (date1 < date2) return -1;
  if (date1 > date2) return 1;
  return 0;
};

/**
 * Checks if a date falls within a date range (inclusive)
 */
export const isDateInRange = (date: Date | string, startDate: Date | string, endDate: Date | string): boolean => {
  const dateStr = typeof date === 'string' ? date : formatDateToString(date);
  const startStr = typeof startDate === 'string' ? startDate : formatDateToString(startDate);
  const endStr = typeof endDate === 'string' ? endDate : formatDateToString(endDate);

  return dateStr >= startStr && dateStr <= endStr;
};

/**
 * Validates that a date range is valid (endDate >= startDate)
 */
export const validateDateRange = (startDate: Date | string, endDate: Date | string): boolean => {
  const startStr = typeof startDate === 'string' ? startDate : formatDateToString(startDate);
  const endStr = typeof endDate === 'string' ? endDate : formatDateToString(endDate);

  return endStr >= startStr;
};
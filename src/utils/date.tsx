// Specifies the types of values that can be passed as a date.
type DateValue = Date | string | number;

const MONTHS: Record<string, string> = {
  "01": "January",
  "02": "February",
  "03": "March",
  "04": "April",
  "05": "May",
  "06": "June",
  "07": "July",
  "08": "August",
  "09": "September",
  "10": "October",
  "11": "November",
  "12": "December",
};

// Converts a DateValue to a Date object.
export function toDate(value: DateValue): Date {
  return value instanceof Date ? value : new Date(value);
}

// Returns a string representing a date in the format "YYYY-MM-DD" (e.g. "2026-06-14").
export function formatDate(value: DateValue): string {
  const date = toDate(value);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
}

// Returns a string representing the date in a long format (e.g. 30 July 2026)
export function formatLongDate(date: string): string {
  const day = date.slice(8, 10);
  const month = MONTHS[date.slice(5, 7)];
  const year = date.slice(0, 4);
  return `${day} ${month} ${year}`;
}

// Returns a string representing a time in the format "HH:MM:SS" (e.g. "08:00:00").
export function formatTime(value: DateValue): string {
  const date = toDate(value);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  return `${hours}:${minutes}:${seconds}`;
}

// Returns a string representing a date and time in the format "YYYY-MM-DD HH:MM:SS" (e.g. "2026-06-14 08:00:00").
export function formatDateTime(value: DateValue = new Date()): string {
  const date = toDate(value);
  return `${formatDate(date)} ${formatTime(date)}`;
}

// Returns a string representing the date and time in a more readable format (e.g. "20 July 2026 at 12:00")
export function formatReadingDateTime(recordedAt: string): string {
  const date = recordedAt.slice(0, 10);
  const time = recordedAt.slice(11, 16);

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  let dateLabel: string;
  if (date === formatDate(new Date())) {
    dateLabel = "Today";
  } else if (date === formatDate(yesterday)) {
    dateLabel = "Yesterday";
  } else {
    dateLabel = formatLongDate(date);
  }
  return `${dateLabel} at ${time}`;
}

// Returns a greeting based on the time of day ("Good morning", "Good afternoon", "Good evening").
export function greeting(date: DateValue = new Date()): string {
  const hour = toDate(date).getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

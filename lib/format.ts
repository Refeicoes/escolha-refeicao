import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const TIME_ZONE = "America/Sao_Paulo";

export const MEAL_TYPE_LABELS: Record<string, string> = {
  TERCA: "Terça-feira",
  QUINTA: "Quinta-feira",
};

export const SELECTION_LABELS: Record<string, string> = {
  MASSA: "Massa",
  STREET_FOOD: "Street Food",
  TRADICIONAL: "Rampa Tradicional",
};

// mealDate comes from a @db.Date column: it has no real time-of-day, so it
// must be formatted from its UTC components — running it through a timezone
// conversion would shift it back a calendar day for any zone west of UTC.
export function formatDateOnlyBR(date: Date): string {
  const day = String(date.getUTCDate()).padStart(2, "0");
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const year = date.getUTCFullYear();
  return `${day}/${month}/${year}`;
}

// respondedAt/deadline are real instants, so these do need zone conversion
// for display.
export function formatZonedDatePart(date: Date): string {
  return format(toZonedTime(date, TIME_ZONE), "dd/MM/yyyy");
}

export function formatZonedTimePart(date: Date): string {
  return format(toZonedTime(date, TIME_ZONE), "HH:mm:ss");
}

export function formatZonedDateTime(date: Date): string {
  return format(toZonedTime(date, TIME_ZONE), "dd/MM/yyyy HH:mm:ss");
}

// For <input type="datetime-local"> values, which are naive local time
// strings meant to represent Brasília time.
export function dateOnlyInputValue(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function datetimeLocalInputValue(date: Date): string {
  return format(toZonedTime(date, TIME_ZONE), "yyyy-MM-dd'T'HH:mm");
}

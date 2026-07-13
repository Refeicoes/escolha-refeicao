import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { prisma } from "@/lib/prisma";
import type { MealEvent, MealType } from "@/app/generated/prisma/client";

const TIME_ZONE = "America/Sao_Paulo";
const DEADLINE_TIME = "16:00";
const DEADLINE_DAYS_BEFORE = 1;

// The meal itself is served Tuesday (Massa) and Thursday (Street Food). JS
// Date#getDay(): Sun=0..Sat=6.
const WEEKDAY_MEAL_TYPES: { dayOfWeek: number; mealType: MealType }[] = [
  { dayOfWeek: 2, mealType: "TERCA" },
  { dayOfWeek: 4, mealType: "QUINTA" },
];

export function getBrazilTodayDateOnly(): Date {
  const zoned = toZonedTime(new Date(), TIME_ZONE);
  return new Date(Date.UTC(zoned.getFullYear(), zoned.getMonth(), zoned.getDate()));
}

export function isMealEventOpen(
  event: Pick<MealEvent, "status" | "deadline">,
  now: Date = new Date()
): boolean {
  return event.status === "OPEN" && now.getTime() <= event.deadline.getTime();
}

function nextOccurrenceOnOrAfter(from: Date, targetDayOfWeek: number): Date {
  const result = new Date(from);
  const diff = (targetDayOfWeek - result.getUTCDay() + 7) % 7;
  result.setUTCDate(result.getUTCDate() + diff);
  return result;
}

// Orders close the day before the meal (Monday 16:00 for Tuesday's Massa,
// Wednesday 16:00 for Thursday's Street Food), not on the meal day itself.
function toDeadline(mealDate: Date): Date {
  const cutoff = new Date(mealDate);
  cutoff.setUTCDate(cutoff.getUTCDate() - DEADLINE_DAYS_BEFORE);
  const year = cutoff.getUTCFullYear();
  const month = String(cutoff.getUTCMonth() + 1).padStart(2, "0");
  const day = String(cutoff.getUTCDate()).padStart(2, "0");
  return fromZonedTime(`${year}-${month}-${day}T${DEADLINE_TIME}`, TIME_ZONE);
}

// Employees can register any day of the week for the upcoming Tuesday/
// Thursday slot, so those slots need to exist before anyone asks for them —
// the admin should not have to remember to create them every week. This
// creates the next two occurrences of each weekday (this week's and next
// week's) if missing, and never touches a slot that already exists (so an
// admin who customized a deadline, or closed a slot early, is never
// overwritten).
export async function ensureUpcomingMealEvents(): Promise<void> {
  const today = getBrazilTodayDateOnly();

  for (const { dayOfWeek, mealType } of WEEKDAY_MEAL_TYPES) {
    const firstOccurrence = nextOccurrenceOnOrAfter(today, dayOfWeek);
    const secondOccurrence = new Date(firstOccurrence);
    secondOccurrence.setUTCDate(secondOccurrence.getUTCDate() + 7);

    for (const mealDate of [firstOccurrence, secondOccurrence]) {
      const existing = await prisma.mealEvent.findUnique({ where: { mealDate } });
      if (existing) continue;
      await prisma.mealEvent.create({
        data: { mealDate, mealType, deadline: toDeadline(mealDate), status: "OPEN" },
      });
    }
  }
}

export async function getNextUpcomingMealEvent(): Promise<MealEvent | null> {
  await ensureUpcomingMealEvents();

  const today = getBrazilTodayDateOnly();
  const candidates = await prisma.mealEvent.findMany({
    where: { mealDate: { gte: today }, status: "OPEN" },
    orderBy: { mealDate: "asc" },
    take: 5,
  });
  return candidates.find((event) => isMealEventOpen(event)) ?? null;
}

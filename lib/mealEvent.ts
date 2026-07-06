import { toZonedTime } from "date-fns-tz";
import { prisma } from "@/lib/prisma";
import type { MealEvent } from "@/app/generated/prisma/client";

const TIME_ZONE = "America/Sao_Paulo";

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

export async function getNextUpcomingMealEvent(): Promise<MealEvent | null> {
  const today = getBrazilTodayDateOnly();
  const candidates = await prisma.mealEvent.findMany({
    where: { mealDate: { gte: today }, status: "OPEN" },
    orderBy: { mealDate: "asc" },
    take: 5,
  });
  return candidates.find((event) => isMealEventOpen(event)) ?? null;
}

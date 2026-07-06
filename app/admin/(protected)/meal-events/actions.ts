"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { fromZonedTime } from "date-fns-tz";
import { prisma } from "@/lib/prisma";
import { mealEventSchema } from "@/lib/validation";

const TIME_ZONE = "America/Sao_Paulo";

export interface MealEventActionResult {
  ok: boolean;
  error?: string;
}

function parseMealDate(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export async function createMealEventAction(
  _prev: MealEventActionResult,
  formData: FormData
): Promise<MealEventActionResult> {
  const parsed = mealEventSchema.safeParse({
    mealDate: formData.get("mealDate"),
    mealType: formData.get("mealType"),
    deadline: formData.get("deadline"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const mealDate = parseMealDate(parsed.data.mealDate);
  const deadline = fromZonedTime(parsed.data.deadline, TIME_ZONE);

  const existing = await prisma.mealEvent.findUnique({ where: { mealDate } });
  if (existing) {
    return { ok: false, error: "Já existe um evento para esta data." };
  }

  await prisma.mealEvent.create({
    data: { mealDate, mealType: parsed.data.mealType, deadline },
  });
  revalidatePath("/admin/meal-events");
  redirect("/admin/meal-events");
}

export async function updateMealEventAction(
  id: number,
  _prev: MealEventActionResult,
  formData: FormData
): Promise<MealEventActionResult> {
  const parsed = mealEventSchema.safeParse({
    mealDate: formData.get("mealDate"),
    mealType: formData.get("mealType"),
    deadline: formData.get("deadline"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const mealDate = parseMealDate(parsed.data.mealDate);
  const deadline = fromZonedTime(parsed.data.deadline, TIME_ZONE);

  const existing = await prisma.mealEvent.findFirst({ where: { mealDate, NOT: { id } } });
  if (existing) {
    return { ok: false, error: "Já existe um evento para esta data." };
  }

  await prisma.mealEvent.update({
    where: { id },
    data: { mealDate, mealType: parsed.data.mealType, deadline },
  });
  revalidatePath("/admin/meal-events");
  redirect("/admin/meal-events");
}

export async function toggleMealEventStatusAction(id: number) {
  const event = await prisma.mealEvent.findUniqueOrThrow({ where: { id } });
  await prisma.mealEvent.update({
    where: { id },
    data: { status: event.status === "OPEN" ? "CLOSED" : "OPEN" },
  });
  revalidatePath("/admin/meal-events");
}

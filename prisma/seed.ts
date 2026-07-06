import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { fromZonedTime } from "date-fns-tz";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const TIME_ZONE = "America/Sao_Paulo";

function nextWeekday(from: Date, targetDayOfWeek: number): Date {
  const result = new Date(from);
  const diff = (targetDayOfWeek - result.getDay() + 7) % 7 || 7;
  result.setDate(result.getDate() + diff);
  return result;
}

function dateOnlyUTC(d: Date): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
}

async function main() {
  const companies = ["Matriz", "Filial 1", "Filial 2"];
  for (const name of companies) {
    await prisma.company.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  const today = new Date();
  const nextTuesday = nextWeekday(today, 2);
  const nextThursday = nextWeekday(today, 4);

  const events: { date: Date; type: "TERCA" | "QUINTA" }[] = [
    { date: nextTuesday, type: "TERCA" },
    { date: nextThursday, type: "QUINTA" },
  ];

  for (const { date, type } of events) {
    const mealDate = dateOnlyUTC(date);
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    const deadline = fromZonedTime(`${y}-${m}-${d}T10:00`, TIME_ZONE);

    await prisma.mealEvent.upsert({
      where: { mealDate },
      update: {},
      create: { mealDate, mealType: type, deadline, status: "OPEN" },
    });
  }

  console.log("Seed concluído: 3 empresas e 2 eventos (próxima terça e quinta) criados.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

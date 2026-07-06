import { prisma } from "@/lib/prisma";
import {
  formatDateOnlyBR,
  formatZonedDatePart,
  formatZonedTimePart,
  MEAL_TYPE_LABELS,
  SELECTION_LABELS,
} from "@/lib/format";
import type { SelectionOption } from "@/app/generated/prisma/client";

export interface ReportFilters {
  companyId?: number;
  mealEventId?: number;
  dateFrom?: Date;
  dateTo?: Date;
}

export interface ReportRow {
  matricula: string;
  nome: string;
  empresa: string;
  dataRefeicao: string;
  tipoRefeicao: string;
  escolha: string;
  dataResposta: string;
  horaResposta: string;
}

export async function getResponsesForReport(filters: ReportFilters = {}): Promise<ReportRow[]> {
  const responses = await prisma.response.findMany({
    where: {
      ...(filters.mealEventId ? { mealEventId: filters.mealEventId } : {}),
      ...(filters.companyId ? { companyIdAtResponse: filters.companyId } : {}),
      ...(filters.dateFrom || filters.dateTo
        ? {
            mealEvent: {
              mealDate: {
                ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
                ...(filters.dateTo ? { lte: filters.dateTo } : {}),
              },
            },
          }
        : {}),
    },
    include: { employee: true, mealEvent: true, company: true },
    orderBy: { respondedAt: "desc" },
  });

  return responses.map((r) => ({
    matricula: r.employee.registrationNumber,
    nome: r.fullNameAtResponse,
    empresa: r.company.name,
    dataRefeicao: formatDateOnlyBR(r.mealEvent.mealDate),
    tipoRefeicao: MEAL_TYPE_LABELS[r.mealEvent.mealType],
    escolha: SELECTION_LABELS[r.selection],
    dataResposta: formatZonedDatePart(r.respondedAt),
    horaResposta: formatZonedTimePart(r.respondedAt),
  }));
}

export interface MealEventTotals {
  totals: Record<SelectionOption, number>;
  percentuais: Record<SelectionOption, number>;
  totalGeral: number;
}

export async function getTotalsForMealEvent(mealEventId: number): Promise<MealEventTotals> {
  const grouped = await prisma.response.groupBy({
    by: ["selection"],
    where: { mealEventId },
    _count: { _all: true },
  });

  const totals: Record<SelectionOption, number> = {
    MASSA: 0,
    STREET_FOOD: 0,
    TRADICIONAL: 0,
  };
  for (const g of grouped) {
    totals[g.selection] = g._count._all;
  }
  const totalGeral = Object.values(totals).reduce((a, b) => a + b, 0);

  const percentuais = Object.fromEntries(
    (Object.keys(totals) as SelectionOption[]).map((key) => [
      key,
      totalGeral > 0 ? (totals[key] / totalGeral) * 100 : 0,
    ])
  ) as Record<SelectionOption, number>;

  return { totals, percentuais, totalGeral };
}

import { requireAdmin } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getResponsesForReport, getTotalsForMealEvent } from "@/lib/reportQueries";
import { buildSummaryPdf } from "@/lib/export/pdf";
import { formatDateOnlyBR, MEAL_TYPE_LABELS } from "@/lib/format";

export const runtime = "nodejs";

export async function GET(request: Request) {
  await requireAdmin();

  const { searchParams } = new URL(request.url);
  const mealEventIdParam = searchParams.get("mealEventId");
  if (!mealEventIdParam) {
    return new Response("mealEventId é obrigatório", { status: 400 });
  }
  const mealEventId = Number(mealEventIdParam);

  const event = await prisma.mealEvent.findUnique({ where: { id: mealEventId } });
  if (!event) {
    return new Response("Evento não encontrado", { status: 404 });
  }

  const [rows, totals] = await Promise.all([
    getResponsesForReport({ mealEventId }),
    getTotalsForMealEvent(mealEventId),
  ]);

  const buffer = await buildSummaryPdf({
    mealDateLabel: formatDateOnlyBR(event.mealDate),
    mealTypeLabel: MEAL_TYPE_LABELS[event.mealType],
    totals,
    rows: rows.map((r) => ({
      matricula: r.matricula,
      nome: r.nome,
      empresa: r.empresa,
      escolha: r.escolha,
      dataRefeicao: r.dataRefeicao,
    })),
  });

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="resumo-refeicao-${mealEventId}.pdf"`,
    },
  });
}

import { requireAdmin } from "@/lib/auth";
import { getResponsesForReport } from "@/lib/reportQueries";
import { buildResponsesWorkbook } from "@/lib/export/excel";

export const runtime = "nodejs";

export async function GET(request: Request) {
  await requireAdmin();

  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  const mealEventId = searchParams.get("mealEventId");

  const rows = await getResponsesForReport({
    companyId: companyId ? Number(companyId) : undefined,
    mealEventId: mealEventId ? Number(mealEventId) : undefined,
  });

  const buffer = await buildResponsesWorkbook(rows);

  return new Response(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": 'attachment; filename="relatorio-refeicoes.xlsx"',
    },
  });
}

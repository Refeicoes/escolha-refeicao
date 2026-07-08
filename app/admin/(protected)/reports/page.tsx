import { prisma } from "@/lib/prisma";
import { getResponsesForReport } from "@/lib/reportQueries";
import { formatDateOnlyBR, MEAL_TYPE_LABELS } from "@/lib/format";
import { ReportFilters } from "./ReportFilters";
import { ReportTable } from "./ReportTable";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ companyId?: string; mealEventId?: string }>;
}) {
  const params = await searchParams;
  const companyId = params.companyId ? Number(params.companyId) : undefined;
  const mealEventId = params.mealEventId ? Number(params.mealEventId) : undefined;

  const [companies, mealEvents, rows] = await Promise.all([
    prisma.company.findMany({ orderBy: { name: "asc" } }),
    prisma.mealEvent.findMany({ orderBy: { mealDate: "desc" } }),
    getResponsesForReport({ companyId, mealEventId }),
  ]);

  const exportQuery = new URLSearchParams();
  if (companyId) exportQuery.set("companyId", String(companyId));
  if (mealEventId) exportQuery.set("mealEventId", String(mealEventId));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-brand-700">Relatórios</h1>
        <div className="flex gap-3">
          <a
            href={`/api/admin/export/xlsx?${exportQuery.toString()}`}
            className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-emerald-700"
          >
            Exportar Excel
          </a>
          {mealEventId && (
            <a
              href={`/api/admin/export/pdf?mealEventId=${mealEventId}`}
              className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-rose-700"
            >
              Exportar PDF (resumo)
            </a>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-card-border bg-white p-6 shadow-[0_20px_50px_-25px_rgba(27,59,111,0.25)]">
        <ReportFilters
          companies={companies}
          mealEvents={mealEvents.map((e) => ({
            id: e.id,
            label: `${MEAL_TYPE_LABELS[e.mealType]} - ${formatDateOnlyBR(e.mealDate)}`,
          }))}
          selectedCompanyId={companyId}
          selectedMealEventId={mealEventId}
        />

        <div className="mt-6">
          <ReportTable rows={rows} />
        </div>
      </div>
    </div>
  );
}

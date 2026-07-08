import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateOnlyBR, formatZonedDateTime, MEAL_TYPE_LABELS } from "@/lib/format";
import { toggleMealEventStatusAction } from "./actions";

export default async function MealEventsPage() {
  const events = await prisma.mealEvent.findMany({ orderBy: { mealDate: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-brand-700">Eventos de Refeição</h1>
        <Link
          href="/admin/meal-events/new"
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-600"
        >
          Novo Evento
        </Link>
      </div>

      <div className="rounded-2xl border border-card-border bg-white p-6 shadow-[0_20px_50px_-25px_rgba(27,59,111,0.25)]">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-card-border text-left text-brand-700">
              <th className="py-2 font-semibold">Data</th>
              <th className="py-2 font-semibold">Tipo</th>
              <th className="py-2 font-semibold">Prazo</th>
              <th className="py-2 font-semibold">Status</th>
              <th className="py-2"></th>
            </tr>
          </thead>
          <tbody>
            {events.map((e) => (
              <tr key={e.id} className="border-b border-card-border/70 hover:bg-brand-50">
                <td className="py-2">{formatDateOnlyBR(e.mealDate)}</td>
                <td className="py-2">{MEAL_TYPE_LABELS[e.mealType]}</td>
                <td className="py-2">{formatZonedDateTime(e.deadline)}</td>
                <td className="py-2">
                  <span
                    className={
                      e.status === "OPEN"
                        ? "rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700"
                        : "rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500"
                    }
                  >
                    {e.status === "OPEN" ? "Aberto" : "Fechado"}
                  </span>
                </td>
                <td className="flex gap-3 py-2">
                  <Link
                    href={`/admin/meal-events/${e.id}/edit`}
                    className="text-brand-600 hover:text-brand-700"
                  >
                    Editar
                  </Link>
                  <form
                    action={async () => {
                      "use server";
                      await toggleMealEventStatusAction(e.id);
                    }}
                  >
                    <button type="submit" className="text-ink-muted hover:text-brand-600">
                      {e.status === "OPEN" ? "Fechar" : "Reabrir"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

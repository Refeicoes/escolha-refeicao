import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatDateOnlyBR, formatZonedDateTime, MEAL_TYPE_LABELS } from "@/lib/format";
import { toggleMealEventStatusAction } from "./actions";

export default async function MealEventsPage() {
  const events = await prisma.mealEvent.findMany({ orderBy: { mealDate: "desc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Eventos de Refeição</h1>
        <Link
          href="/admin/meal-events/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
        >
          Novo Evento
        </Link>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Data</th>
            <th className="py-2">Tipo</th>
            <th className="py-2">Prazo</th>
            <th className="py-2">Status</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {events.map((e) => (
            <tr key={e.id} className="border-b">
              <td className="py-2">{formatDateOnlyBR(e.mealDate)}</td>
              <td className="py-2">{MEAL_TYPE_LABELS[e.mealType]}</td>
              <td className="py-2">{formatZonedDateTime(e.deadline)}</td>
              <td className="py-2">{e.status === "OPEN" ? "Aberto" : "Fechado"}</td>
              <td className="flex gap-3 py-2">
                <Link href={`/admin/meal-events/${e.id}/edit`} className="text-blue-600">
                  Editar
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await toggleMealEventStatusAction(e.id);
                  }}
                >
                  <button type="submit" className="text-gray-600">
                    {e.status === "OPEN" ? "Fechar" : "Reabrir"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

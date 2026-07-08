import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { dateOnlyInputValue, datetimeLocalInputValue } from "@/lib/format";
import { MealEventForm } from "../../MealEventForm";
import { updateMealEventAction } from "../../actions";

export default async function EditMealEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const event = await prisma.mealEvent.findUnique({ where: { id: Number(id) } });
  if (!event) notFound();

  const boundAction = updateMealEventAction.bind(null, event.id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-brand-700">Editar Evento de Refeição</h1>
      <MealEventForm
        action={boundAction}
        defaultValues={{
          mealDate: dateOnlyInputValue(event.mealDate),
          mealType: event.mealType,
          deadline: datetimeLocalInputValue(event.deadline),
        }}
        submitLabel="Salvar"
      />
    </div>
  );
}

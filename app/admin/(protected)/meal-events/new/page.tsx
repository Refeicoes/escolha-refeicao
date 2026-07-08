import { MealEventForm } from "../MealEventForm";
import { createMealEventAction } from "../actions";

export default function NewMealEventPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-brand-700">Novo Evento de Refeição</h1>
      <MealEventForm action={createMealEventAction} submitLabel="Criar" />
    </div>
  );
}

import { getNextUpcomingMealEvent } from "@/lib/mealEvent";
import { EmployeeFlow } from "./(employee)/EmployeeFlow";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const event = await getNextUpcomingMealEvent();

  if (!event) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-6">
        <div className="rounded-2xl border border-card-border bg-white p-6 shadow-[0_20px_50px_-25px_rgba(27,59,111,0.35)]">
          <h1 className="mb-2 text-xl font-semibold text-brand-700">Escolha da Refeição</h1>
          <p className="text-ink-muted">
            No momento não há nenhuma refeição especial em aberto para registro.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-6">
      <div className="rounded-2xl border border-card-border bg-white p-6 shadow-[0_20px_50px_-25px_rgba(27,59,111,0.35)]">
        <EmployeeFlow
          mealEvent={{
            id: event.id,
            mealType: event.mealType,
            deadline: event.deadline.toISOString(),
          }}
        />
      </div>
    </main>
  );
}

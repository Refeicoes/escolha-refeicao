import { getNextUpcomingMealEvent } from "@/lib/mealEvent";
import { EmployeeFlow } from "./(employee)/EmployeeFlow";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const event = await getNextUpcomingMealEvent();

  if (!event) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-6">
        <h1 className="mb-4 text-xl font-semibold">Escolha da Refeição</h1>
        <p>No momento não há nenhuma refeição especial em aberto para registro.</p>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center p-6">
      <EmployeeFlow
        mealEvent={{
          id: event.id,
          mealType: event.mealType,
          deadline: event.deadline.toISOString(),
        }}
      />
    </main>
  );
}

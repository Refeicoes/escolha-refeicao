"use client";

import { useActionState } from "react";
import type { MealEventActionResult } from "./actions";

const initialState: MealEventActionResult = { ok: false };

export function MealEventForm({
  action,
  defaultValues,
  submitLabel,
}: {
  action: (prev: MealEventActionResult, formData: FormData) => Promise<MealEventActionResult>;
  defaultValues?: { mealDate: string; mealType: "TERCA" | "QUINTA"; deadline: string };
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="max-w-sm space-y-4">
      <div>
        <label htmlFor="mealDate" className="block text-sm font-medium">
          Data da Refeição
        </label>
        <input
          id="mealDate"
          name="mealDate"
          type="date"
          defaultValue={defaultValues?.mealDate}
          required
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>
      <div>
        <label htmlFor="mealType" className="block text-sm font-medium">
          Tipo
        </label>
        <select
          id="mealType"
          name="mealType"
          defaultValue={defaultValues?.mealType ?? "TERCA"}
          className="mt-1 w-full rounded border px-3 py-2"
        >
          <option value="TERCA">Terça-feira (Massa)</option>
          <option value="QUINTA">Quinta-feira (Street Food)</option>
        </select>
      </div>
      <div>
        <label htmlFor="deadline" className="block text-sm font-medium">
          Prazo (horário de Brasília)
        </label>
        <input
          id="deadline"
          name="deadline"
          type="datetime-local"
          defaultValue={defaultValues?.deadline}
          required
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="rounded bg-blue-600 px-4 py-2 text-sm text-white disabled:opacity-50"
      >
        {isPending ? "Salvando..." : submitLabel}
      </button>
    </form>
  );
}

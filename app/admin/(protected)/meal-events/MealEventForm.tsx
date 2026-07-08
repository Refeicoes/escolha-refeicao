"use client";

import { useActionState } from "react";
import type { MealEventActionResult } from "./actions";

const initialState: MealEventActionResult = { ok: false };

const inputClass =
  "mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";
const labelClass = "block text-sm font-medium text-brand-700";

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
    <div className="max-w-sm rounded-2xl border border-card-border bg-white p-6 shadow-[0_20px_50px_-25px_rgba(27,59,111,0.25)]">
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="mealDate" className={labelClass}>
            Data da Refeição
          </label>
          <input
            id="mealDate"
            name="mealDate"
            type="date"
            defaultValue={defaultValues?.mealDate}
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="mealType" className={labelClass}>
            Tipo
          </label>
          <select
            id="mealType"
            name="mealType"
            defaultValue={defaultValues?.mealType ?? "TERCA"}
            className={inputClass}
          >
            <option value="TERCA">Terça-feira (Massa)</option>
            <option value="QUINTA">Quinta-feira (Street Food)</option>
          </select>
        </div>
        <div>
          <label htmlFor="deadline" className={labelClass}>
            Prazo (horário de Brasília)
          </label>
          <input
            id="deadline"
            name="deadline"
            type="datetime-local"
            defaultValue={defaultValues?.deadline}
            required
            className={inputClass}
          />
        </div>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-600 disabled:opacity-50"
        >
          {isPending ? "Salvando..." : submitLabel}
        </button>
      </form>
    </div>
  );
}

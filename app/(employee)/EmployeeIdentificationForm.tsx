"use client";

import { useActionState } from "react";
import { identifyEmployeeAction, type IdentifyResult } from "./actions";

interface Identification {
  registrationNumber: string;
  fullName: string;
  companyName: string;
}

const initialState: IdentifyResult = { ok: false };

const inputClass =
  "mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-ink placeholder:text-ink-muted/60 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";
const labelClass = "block text-sm font-medium text-brand-700";

export function EmployeeIdentificationForm({
  mealEventId,
  onIdentified,
}: {
  mealEventId: number;
  onIdentified: (data: Identification) => void;
}) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: IdentifyResult, formData: FormData) => {
      const result = await identifyEmployeeAction(mealEventId, formData);
      if (result.ok) {
        onIdentified({
          registrationNumber: String(formData.get("registrationNumber") ?? "").trim(),
          fullName: String(formData.get("fullName") ?? "").trim(),
          companyName: String(formData.get("companyName") ?? "").trim(),
        });
      }
      return result;
    },
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-xl font-semibold text-brand-700">Escolha da Refeição</h1>

      <div>
        <label htmlFor="registrationNumber" className={labelClass}>
          Matrícula
        </label>
        <input id="registrationNumber" name="registrationNumber" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="fullName" className={labelClass}>
          Nome Completo
        </label>
        <input id="fullName" name="fullName" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="companyName" className={labelClass}>
          Empresa
        </label>
        <input
          id="companyName"
          name="companyName"
          required
          placeholder="Digite o nome da sua empresa"
          className={inputClass}
        />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-lg bg-brand-500 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-brand-600 disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Continuar"}
      </button>
    </form>
  );
}

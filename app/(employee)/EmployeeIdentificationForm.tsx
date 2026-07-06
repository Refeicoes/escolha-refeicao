"use client";

import { useActionState } from "react";
import { identifyEmployeeAction, type IdentifyResult } from "./actions";
import { CompanySelect } from "./CompanySelect";

interface Company {
  id: number;
  name: string;
}

interface Identification {
  registrationNumber: string;
  fullName: string;
  companyId: number;
}

const initialState: IdentifyResult = { ok: false };

export function EmployeeIdentificationForm({
  mealEventId,
  companies,
  onIdentified,
}: {
  mealEventId: number;
  companies: Company[];
  onIdentified: (data: Identification) => void;
}) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: IdentifyResult, formData: FormData) => {
      const result = await identifyEmployeeAction(mealEventId, formData);
      if (result.ok) {
        onIdentified({
          registrationNumber: String(formData.get("registrationNumber") ?? "").trim(),
          fullName: String(formData.get("fullName") ?? "").trim(),
          companyId: Number(formData.get("companyId")),
        });
      }
      return result;
    },
    initialState
  );

  return (
    <form action={formAction} className="space-y-4">
      <h1 className="text-xl font-semibold">Escolha da Refeição</h1>

      <div>
        <label htmlFor="registrationNumber" className="block text-sm font-medium">
          Matrícula
        </label>
        <input
          id="registrationNumber"
          name="registrationNumber"
          required
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="fullName" className="block text-sm font-medium">
          Nome Completo
        </label>
        <input
          id="fullName"
          name="fullName"
          required
          className="mt-1 w-full rounded border px-3 py-2"
        />
      </div>

      <div>
        <label htmlFor="companyId" className="block text-sm font-medium">
          Empresa
        </label>
        <CompanySelect companies={companies} />
      </div>

      {state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Continuar"}
      </button>
    </form>
  );
}

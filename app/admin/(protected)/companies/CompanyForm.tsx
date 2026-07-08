"use client";

import { useActionState } from "react";
import type { CompanyActionResult } from "./actions";

const initialState: CompanyActionResult = { ok: false };

export function CompanyForm({
  action,
  defaultName,
  submitLabel,
}: {
  action: (prevState: CompanyActionResult, formData: FormData) => Promise<CompanyActionResult>;
  defaultName?: string;
  submitLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  return (
    <div className="max-w-sm rounded-2xl border border-card-border bg-white p-6 shadow-[0_20px_50px_-25px_rgba(27,59,111,0.25)]">
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-brand-700">
            Nome
          </label>
          <input
            id="name"
            name="name"
            defaultValue={defaultName}
            required
            className="mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
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

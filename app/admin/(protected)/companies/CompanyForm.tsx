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
    <form action={formAction} className="max-w-sm space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Nome
        </label>
        <input
          id="name"
          name="name"
          defaultValue={defaultName}
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

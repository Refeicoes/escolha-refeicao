"use client";

import { useActionState, useEffect, useState } from "react";
import { submitResponseAction, type SubmitResult } from "./actions";

interface Identification {
  registrationNumber: string;
  fullName: string;
  companyName: string;
}

interface MealEventInfo {
  id: number;
  mealType: "TERCA" | "QUINTA";
  deadline: string;
}

const initialState: SubmitResult = { ok: false };

const optionClass =
  "flex cursor-pointer items-center gap-3 rounded-lg border border-card-border bg-white px-4 py-3 text-ink transition-colors has-[:checked]:border-brand-500 has-[:checked]:bg-brand-50 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50";

export function MealSelectionForm({
  mealEvent,
  identification,
}: {
  mealEvent: MealEventInfo;
  identification: Identification;
}) {
  const [state, formAction, isPending] = useActionState(submitResponseAction, initialState);
  const [expired, setExpired] = useState(
    () => Date.now() > new Date(mealEvent.deadline).getTime()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setExpired(Date.now() > new Date(mealEvent.deadline).getTime());
    }, 15000);
    return () => clearInterval(interval);
  }, [mealEvent.deadline]);

  if (state.ok) {
    return (
      <div className="flex flex-col items-center gap-2 py-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-2xl text-brand-600">
          ✓
        </div>
        <p className="font-medium text-brand-700">Sua escolha foi registrada com sucesso.</p>
      </div>
    );
  }

  const isTerca = mealEvent.mealType === "TERCA";
  const question = isTerca
    ? "Você deseja a opção especial de terça-feira?"
    : "Você deseja a opção especial de quinta-feira?";
  const specialLabel = isTerca ? "Sim, quero Massa" : "Sim, quero Street Food";
  const specialValue = isTerca ? "MASSA" : "STREET_FOOD";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="registrationNumber" value={identification.registrationNumber} />
      <input type="hidden" name="fullName" value={identification.fullName} />
      <input type="hidden" name="companyName" value={identification.companyName} />
      <input type="hidden" name="mealEventId" value={mealEvent.id} />

      <p className="font-medium text-brand-700">{question}</p>

      <div className="space-y-2">
        <label className={optionClass}>
          <input
            type="radio"
            name="selection"
            value={specialValue}
            required
            disabled={expired}
            className="accent-brand-500"
          />
          {specialLabel}
        </label>
        <label className={optionClass}>
          <input
            type="radio"
            name="selection"
            value="TRADICIONAL"
            required
            disabled={expired}
            className="accent-brand-500"
          />
          Não, vou utilizar a rampa de comida tradicional.
        </label>
      </div>

      {expired && (
        <p className="text-sm text-red-600">O prazo para esta refeição foi encerrado.</p>
      )}
      {!expired && state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending || expired}
        className="w-full rounded-lg bg-brand-500 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-brand-600 disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Confirmar Escolha"}
      </button>
    </form>
  );
}

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
    return <p className="font-medium text-green-700">Sua escolha foi registrada com sucesso.</p>;
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

      <p className="font-medium">{question}</p>

      <label className="flex items-center gap-2">
        <input type="radio" name="selection" value={specialValue} required disabled={expired} />
        {specialLabel}
      </label>
      <label className="flex items-center gap-2">
        <input type="radio" name="selection" value="TRADICIONAL" required disabled={expired} />
        Não, vou utilizar a rampa de comida tradicional.
      </label>

      {expired && (
        <p className="text-sm text-red-600">O prazo para esta refeição foi encerrado.</p>
      )}
      {!expired && state.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={isPending || expired}
        className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Confirmar Escolha"}
      </button>
    </form>
  );
}

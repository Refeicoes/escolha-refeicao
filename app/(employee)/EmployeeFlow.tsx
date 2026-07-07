"use client";

import { useState } from "react";
import { EmployeeIdentificationForm } from "./EmployeeIdentificationForm";
import { MealSelectionForm } from "./MealSelectionForm";

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

export function EmployeeFlow({ mealEvent }: { mealEvent: MealEventInfo }) {
  const [identification, setIdentification] = useState<Identification | null>(null);

  if (!identification) {
    return (
      <EmployeeIdentificationForm mealEventId={mealEvent.id} onIdentified={setIdentification} />
    );
  }

  return <MealSelectionForm mealEvent={mealEvent} identification={identification} />;
}

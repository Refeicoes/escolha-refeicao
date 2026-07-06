"use client";

import { useState } from "react";
import { EmployeeIdentificationForm } from "./EmployeeIdentificationForm";
import { MealSelectionForm } from "./MealSelectionForm";

interface Company {
  id: number;
  name: string;
}

interface Identification {
  registrationNumber: string;
  fullName: string;
  companyId: number;
}

interface MealEventInfo {
  id: number;
  mealType: "TERCA" | "QUINTA";
  deadline: string;
}

export function EmployeeFlow({
  mealEvent,
  companies,
}: {
  mealEvent: MealEventInfo;
  companies: Company[];
}) {
  const [identification, setIdentification] = useState<Identification | null>(null);

  if (!identification) {
    return (
      <EmployeeIdentificationForm
        mealEventId={mealEvent.id}
        companies={companies}
        onIdentified={setIdentification}
      />
    );
  }

  return <MealSelectionForm mealEvent={mealEvent} identification={identification} />;
}

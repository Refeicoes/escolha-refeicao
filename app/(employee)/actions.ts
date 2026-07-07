"use server";

import { prisma } from "@/lib/prisma";
import { isMealEventOpen } from "@/lib/mealEvent";
import { employeeIdentificationSchema, responseSubmissionSchema } from "@/lib/validation";
import { Prisma } from "@/app/generated/prisma/client";

export interface IdentifyResult {
  ok: boolean;
  error?: string;
  alreadyResponded?: boolean;
}

export async function identifyEmployeeAction(
  mealEventId: number,
  formData: FormData
): Promise<IdentifyResult> {
  const parsed = employeeIdentificationSchema.safeParse({
    registrationNumber: formData.get("registrationNumber"),
    fullName: formData.get("fullName"),
    companyName: formData.get("companyName"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const event = await prisma.mealEvent.findUnique({ where: { id: mealEventId } });
  if (!event || !isMealEventOpen(event)) {
    return { ok: false, error: "O prazo para esta refeição foi encerrado." };
  }

  // Matrícula is only unique within a company (each company numbers its own
  // employees independently), so the duplicate check must be scoped by
  // company too — otherwise two different people at two different companies
  // who happen to share a number would collide.
  const company = await prisma.company.findFirst({
    where: { name: { equals: parsed.data.companyName, mode: "insensitive" } },
  });

  if (company) {
    const employee = await prisma.employee.findUnique({
      where: {
        registrationNumber_companyId: {
          registrationNumber: parsed.data.registrationNumber,
          companyId: company.id,
        },
      },
    });

    if (employee) {
      const existingResponse = await prisma.response.findUnique({
        where: { employeeId_mealEventId: { employeeId: employee.id, mealEventId } },
      });
      if (existingResponse) {
        return {
          ok: false,
          alreadyResponded: true,
          error: "Você já registrou sua escolha para esta refeição.",
        };
      }
    }
  }

  return { ok: true };
}

export interface SubmitResult {
  ok: boolean;
  error?: string;
}

export async function submitResponseAction(
  _prevState: SubmitResult,
  formData: FormData
): Promise<SubmitResult> {
  const parsed = responseSubmissionSchema.safeParse({
    registrationNumber: formData.get("registrationNumber"),
    fullName: formData.get("fullName"),
    companyName: formData.get("companyName"),
    mealEventId: formData.get("mealEventId"),
    selection: formData.get("selection"),
  });

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { registrationNumber, fullName, companyName, mealEventId, selection } = parsed.data;

  const event = await prisma.mealEvent.findUnique({ where: { id: mealEventId } });
  if (!event || !isMealEventOpen(event)) {
    return { ok: false, error: "O prazo para esta refeição foi encerrado." };
  }

  const validSelection =
    selection === "TRADICIONAL" ||
    (event.mealType === "TERCA" && selection === "MASSA") ||
    (event.mealType === "QUINTA" && selection === "STREET_FOOD");
  if (!validSelection) {
    return { ok: false, error: "Opção inválida para esta refeição." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const existingCompany = await tx.company.findFirst({
        where: { name: { equals: companyName, mode: "insensitive" } },
      });
      const company =
        existingCompany ?? (await tx.company.create({ data: { name: companyName } }));
      const companyId = company.id;

      const employee = await tx.employee.upsert({
        where: { registrationNumber_companyId: { registrationNumber, companyId } },
        update: { fullName },
        create: { registrationNumber, fullName, companyId },
      });

      await tx.response.create({
        data: {
          employeeId: employee.id,
          mealEventId,
          selection,
          companyIdAtResponse: companyId,
          fullNameAtResponse: fullName,
        },
      });
    });
  } catch (err) {
    if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
      return { ok: false, error: "Você já registrou sua escolha para esta refeição." };
    }
    throw err;
  }

  return { ok: true };
}

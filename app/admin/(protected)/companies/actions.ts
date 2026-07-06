"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { companySchema } from "@/lib/validation";

export interface CompanyActionResult {
  ok: boolean;
  error?: string;
}

export async function createCompanyAction(
  _prev: CompanyActionResult,
  formData: FormData
): Promise<CompanyActionResult> {
  const parsed = companySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const existing = await prisma.company.findFirst({
    where: { name: { equals: parsed.data.name, mode: "insensitive" } },
  });
  if (existing) {
    return { ok: false, error: "Já existe uma empresa com esse nome." };
  }

  await prisma.company.create({ data: { name: parsed.data.name } });
  revalidatePath("/admin/companies");
  redirect("/admin/companies");
}

export async function updateCompanyAction(
  id: number,
  _prev: CompanyActionResult,
  formData: FormData
): Promise<CompanyActionResult> {
  const parsed = companySchema.safeParse({ name: formData.get("name") });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const existing = await prisma.company.findFirst({
    where: { name: { equals: parsed.data.name, mode: "insensitive" }, NOT: { id } },
  });
  if (existing) {
    return { ok: false, error: "Já existe uma empresa com esse nome." };
  }

  await prisma.company.update({ where: { id }, data: { name: parsed.data.name } });
  revalidatePath("/admin/companies");
  redirect("/admin/companies");
}

export async function toggleCompanyActiveAction(id: number) {
  const company = await prisma.company.findUniqueOrThrow({ where: { id } });
  await prisma.company.update({ where: { id }, data: { active: !company.active } });
  revalidatePath("/admin/companies");
}

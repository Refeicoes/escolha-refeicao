import { z } from "zod";

export const employeeIdentificationSchema = z.object({
  registrationNumber: z.string().trim().min(1, "Matrícula é obrigatória"),
  fullName: z.string().trim().min(1, "Nome completo é obrigatório"),
  companyId: z.coerce.number().int().positive("Selecione uma empresa"),
});

export const responseSubmissionSchema = employeeIdentificationSchema.extend({
  mealEventId: z.coerce.number().int().positive(),
  selection: z.enum(["MASSA", "STREET_FOOD", "TRADICIONAL"]),
});

export const companySchema = z.object({
  name: z.string().trim().min(1, "Nome da empresa é obrigatório"),
});

export const mealEventSchema = z.object({
  mealDate: z.string().min(1, "Data é obrigatória"),
  mealType: z.enum(["TERCA", "QUINTA"]),
  deadline: z.string().min(1, "Prazo é obrigatório"),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1, "Usuário é obrigatório"),
  password: z.string().min(1, "Senha é obrigatória"),
});

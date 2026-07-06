"use server";

import { redirect } from "next/navigation";
import { loginSchema } from "@/lib/validation";
import {
  verifyPassword,
  createSessionToken,
  setSessionCookie,
  clearSessionCookie,
} from "@/lib/auth";

export interface LoginResult {
  ok: boolean;
  error?: string;
}

export async function loginAction(
  _prev: LoginResult,
  formData: FormData
): Promise<LoginResult> {
  const parsed = loginSchema.safeParse({
    username: formData.get("username"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  if (!adminUsername || !adminPasswordHash) {
    return { ok: false, error: "Configuração de administrador ausente." };
  }

  if (parsed.data.username !== adminUsername) {
    return { ok: false, error: "Usuário ou senha inválidos." };
  }

  const valid = await verifyPassword(parsed.data.password, adminPasswordHash);
  if (!valid) {
    return { ok: false, error: "Usuário ou senha inválidos." };
  }

  const token = await createSessionToken(parsed.data.username);
  await setSessionCookie(token);
  redirect("/admin/reports");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}

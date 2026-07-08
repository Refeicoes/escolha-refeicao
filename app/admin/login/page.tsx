"use client";

import { useActionState } from "react";
import { loginAction, type LoginResult } from "./actions";

const initialState: LoginResult = { ok: false };

const inputClass =
  "mt-1 w-full rounded-lg border border-card-border bg-white px-3 py-2 text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center p-6">
      <div className="rounded-2xl border border-card-border bg-white p-6 shadow-[0_20px_50px_-25px_rgba(27,59,111,0.35)]">
        <h1 className="mb-6 text-xl font-semibold text-brand-700">Login Administrativo</h1>
        <form action={formAction} className="space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-brand-700">
              Usuário
            </label>
            <input id="username" name="username" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-brand-700">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={inputClass}
            />
          </div>
          {state.error && <p className="text-sm text-red-600">{state.error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="w-full rounded-lg bg-brand-500 px-4 py-2 font-medium text-white shadow-sm transition-colors hover:bg-brand-600 disabled:opacity-50"
          >
            {isPending ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </main>
  );
}

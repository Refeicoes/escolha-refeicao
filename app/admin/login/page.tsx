"use client";

import { useActionState } from "react";
import { loginAction, type LoginResult } from "./actions";

const initialState: LoginResult = { ok: false };

export default function AdminLoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col justify-center p-6">
      <h1 className="mb-6 text-xl font-semibold">Login Administrativo</h1>
      <form action={formAction} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium">
            Usuário
          </label>
          <input
            id="username"
            name="username"
            required
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Senha
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="mt-1 w-full rounded border px-3 py-2"
          />
        </div>
        {state.error && <p className="text-sm text-red-600">{state.error}</p>}
        <button
          type="submit"
          disabled={isPending}
          className="w-full rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          {isPending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}

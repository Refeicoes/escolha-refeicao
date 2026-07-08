import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { logoutAction } from "../login/actions";

export default async function AdminProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between bg-brand-700 px-6 py-4 shadow-md">
        <nav className="flex gap-5 text-sm font-medium text-brand-100">
          <Link href="/admin/reports" className="transition-colors hover:text-white">
            Relatórios
          </Link>
          <Link href="/admin/companies" className="transition-colors hover:text-white">
            Empresas
          </Link>
          <Link href="/admin/meal-events" className="transition-colors hover:text-white">
            Refeições
          </Link>
        </nav>
        <form action={logoutAction}>
          <button
            type="submit"
            className="rounded-lg border border-brand-400/40 px-3 py-1.5 text-sm font-medium text-brand-100 transition-colors hover:border-white/60 hover:text-white"
          >
            Sair
          </button>
        </form>
      </header>
      <main className="mx-auto w-full max-w-5xl flex-1 p-6">{children}</main>
    </div>
  );
}

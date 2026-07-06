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
      <header className="flex items-center justify-between border-b px-6 py-4">
        <nav className="flex gap-4 text-sm font-medium">
          <Link href="/admin/reports">Relatórios</Link>
          <Link href="/admin/companies">Empresas</Link>
          <Link href="/admin/meal-events">Refeições</Link>
        </nav>
        <form action={logoutAction}>
          <button type="submit" className="text-sm text-red-600">
            Sair
          </button>
        </form>
      </header>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}

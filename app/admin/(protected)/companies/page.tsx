import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { toggleCompanyActiveAction } from "./actions";

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Empresas</h1>
        <Link
          href="/admin/companies/new"
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
        >
          Nova Empresa
        </Link>
      </div>

      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2">Nome</th>
            <th className="py-2">Status</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {companies.map((c) => (
            <tr key={c.id} className="border-b">
              <td className="py-2">{c.name}</td>
              <td className="py-2">
                <span className={c.active ? "text-green-700" : "text-gray-400"}>
                  {c.active ? "Ativa" : "Inativa"}
                </span>
              </td>
              <td className="flex gap-3 py-2">
                <Link href={`/admin/companies/${c.id}/edit`} className="text-blue-600">
                  Editar
                </Link>
                <form
                  action={async () => {
                    "use server";
                    await toggleCompanyActiveAction(c.id);
                  }}
                >
                  <button type="submit" className="text-gray-600">
                    {c.active ? "Desativar" : "Ativar"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

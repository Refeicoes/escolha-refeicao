import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CompanyForm } from "../../CompanyForm";
import { updateCompanyAction } from "../../actions";

export default async function EditCompanyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const company = await prisma.company.findUnique({ where: { id: Number(id) } });
  if (!company) notFound();

  const boundAction = updateCompanyAction.bind(null, company.id);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Editar Empresa</h1>
      <CompanyForm action={boundAction} defaultName={company.name} submitLabel="Salvar" />
    </div>
  );
}

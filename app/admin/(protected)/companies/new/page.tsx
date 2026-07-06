import { CompanyForm } from "../CompanyForm";
import { createCompanyAction } from "../actions";

export default function NewCompanyPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Nova Empresa</h1>
      <CompanyForm action={createCompanyAction} submitLabel="Criar" />
    </div>
  );
}

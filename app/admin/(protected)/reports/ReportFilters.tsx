interface Company {
  id: number;
  name: string;
}

interface MealEventOption {
  id: number;
  label: string;
}

export function ReportFilters({
  companies,
  mealEvents,
  selectedCompanyId,
  selectedMealEventId,
}: {
  companies: Company[];
  mealEvents: MealEventOption[];
  selectedCompanyId?: number;
  selectedMealEventId?: number;
}) {
  return (
    <form className="flex flex-wrap items-end gap-4">
      <div>
        <label htmlFor="companyId" className="block text-sm font-medium">
          Empresa
        </label>
        <select
          id="companyId"
          name="companyId"
          defaultValue={selectedCompanyId ?? ""}
          className="mt-1 rounded border px-3 py-2"
        >
          <option value="">Todas</option>
          {companies.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="mealEventId" className="block text-sm font-medium">
          Evento
        </label>
        <select
          id="mealEventId"
          name="mealEventId"
          defaultValue={selectedMealEventId ?? ""}
          className="mt-1 rounded border px-3 py-2"
        >
          <option value="">Todos</option>
          {mealEvents.map((e) => (
            <option key={e.id} value={e.id}>
              {e.label}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="rounded bg-gray-800 px-4 py-2 text-sm text-white">
        Filtrar
      </button>
      <a href="/admin/reports" className="text-sm text-gray-600">
        Limpar
      </a>
    </form>
  );
}

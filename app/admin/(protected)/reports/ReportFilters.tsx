interface Company {
  id: number;
  name: string;
}

interface MealEventOption {
  id: number;
  label: string;
}

const selectClass =
  "mt-1 rounded-lg border border-card-border bg-white px-3 py-2 text-ink focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200";

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
        <label htmlFor="companyId" className="block text-sm font-medium text-brand-700">
          Empresa
        </label>
        <select
          id="companyId"
          name="companyId"
          defaultValue={selectedCompanyId ?? ""}
          className={selectClass}
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
        <label htmlFor="mealEventId" className="block text-sm font-medium text-brand-700">
          Evento
        </label>
        <select
          id="mealEventId"
          name="mealEventId"
          defaultValue={selectedMealEventId ?? ""}
          className={selectClass}
        >
          <option value="">Todos</option>
          {mealEvents.map((e) => (
            <option key={e.id} value={e.id}>
              {e.label}
            </option>
          ))}
        </select>
      </div>
      <button
        type="submit"
        className="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-800"
      >
        Filtrar
      </button>
      <a href="/admin/reports" className="text-sm text-ink-muted hover:text-brand-600">
        Limpar
      </a>
    </form>
  );
}

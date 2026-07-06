interface Company {
  id: number;
  name: string;
}

export function CompanySelect({
  companies,
  defaultValue,
}: {
  companies: Company[];
  defaultValue?: number;
}) {
  return (
    <select
      id="companyId"
      name="companyId"
      required
      defaultValue={defaultValue ?? ""}
      className="mt-1 w-full rounded border px-3 py-2"
    >
      <option value="" disabled>
        Selecione...
      </option>
      {companies.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name}
        </option>
      ))}
    </select>
  );
}

import type { ReportRow } from "@/lib/reportQueries";

export function ReportTable({ rows }: { rows: ReportRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-ink-muted">Nenhuma resposta encontrada.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-card-border text-left text-brand-700">
            <th className="py-2 pr-4 font-semibold">Matrícula</th>
            <th className="py-2 pr-4 font-semibold">Nome</th>
            <th className="py-2 pr-4 font-semibold">Empresa</th>
            <th className="py-2 pr-4 font-semibold">Data da Refeição</th>
            <th className="py-2 pr-4 font-semibold">Tipo da Refeição</th>
            <th className="py-2 pr-4 font-semibold">Escolha</th>
            <th className="py-2 pr-4 font-semibold">Data da Resposta</th>
            <th className="py-2 pr-4 font-semibold">Hora da Resposta</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-card-border/70 hover:bg-brand-50">
              <td className="py-2 pr-4">{r.matricula}</td>
              <td className="py-2 pr-4">{r.nome}</td>
              <td className="py-2 pr-4">{r.empresa}</td>
              <td className="py-2 pr-4">{r.dataRefeicao}</td>
              <td className="py-2 pr-4">{r.tipoRefeicao}</td>
              <td className="py-2 pr-4">{r.escolha}</td>
              <td className="py-2 pr-4">{r.dataResposta}</td>
              <td className="py-2 pr-4">{r.horaResposta}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

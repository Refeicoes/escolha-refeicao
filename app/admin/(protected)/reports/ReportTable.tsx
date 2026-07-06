import type { ReportRow } from "@/lib/reportQueries";

export function ReportTable({ rows }: { rows: ReportRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-gray-500">Nenhuma resposta encontrada.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="py-2 pr-4">Matrícula</th>
            <th className="py-2 pr-4">Nome</th>
            <th className="py-2 pr-4">Empresa</th>
            <th className="py-2 pr-4">Data da Refeição</th>
            <th className="py-2 pr-4">Tipo da Refeição</th>
            <th className="py-2 pr-4">Escolha</th>
            <th className="py-2 pr-4">Data da Resposta</th>
            <th className="py-2 pr-4">Hora da Resposta</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b">
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

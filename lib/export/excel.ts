import ExcelJS from "exceljs";
import type { ReportRow } from "@/lib/reportQueries";

const COLUMNS: { header: string; key: keyof ReportRow; width: number }[] = [
  { header: "Matrícula", key: "matricula", width: 16 },
  { header: "Nome", key: "nome", width: 28 },
  { header: "Empresa", key: "empresa", width: 24 },
  { header: "Data da Refeição", key: "dataRefeicao", width: 18 },
  { header: "Tipo da Refeição", key: "tipoRefeicao", width: 18 },
  { header: "Escolha", key: "escolha", width: 18 },
  { header: "Data da Resposta", key: "dataResposta", width: 18 },
  { header: "Hora da Resposta", key: "horaResposta", width: 18 },
];

export async function buildResponsesWorkbook(rows: ReportRow[]): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Relatório");

  sheet.columns = COLUMNS.map((c) => ({ header: c.header, key: c.key, width: c.width }));
  sheet.getRow(1).font = { bold: true };

  for (const row of rows) {
    sheet.addRow(row);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}

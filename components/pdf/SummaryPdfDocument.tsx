import { Document, Page, View, Text, StyleSheet } from "@react-pdf/renderer";
import { SELECTION_LABELS } from "@/lib/format";
import type { SelectionOption } from "@/app/generated/prisma/client";
import type { MealEventTotals } from "@/lib/reportQueries";

const styles = StyleSheet.create({
  page: { padding: 24, fontSize: 10 },
  title: { fontSize: 14, marginBottom: 4, fontWeight: 700 },
  subtitle: { fontSize: 10, marginBottom: 16, color: "#555" },
  table: { display: "flex", width: "auto", marginBottom: 20 },
  row: { flexDirection: "row", borderBottom: "1pt solid #ddd" },
  headerRow: { flexDirection: "row", backgroundColor: "#eee", fontWeight: 700 },
  cellMatricula: { width: "15%", padding: 4 },
  cellNome: { width: "30%", padding: 4 },
  cellEmpresa: { width: "25%", padding: 4 },
  cellEscolha: { width: "15%", padding: 4 },
  cellData: { width: "15%", padding: 4 },
  totalsTitle: { fontSize: 12, marginBottom: 8, fontWeight: 700 },
  totalsRow: { flexDirection: "row", marginBottom: 4 },
  totalsLabel: { width: "35%" },
  totalsCount: { width: "20%" },
  totalsPercent: { width: "20%" },
});

export interface SummaryPdfData {
  mealDateLabel: string;
  mealTypeLabel: string;
  totals: MealEventTotals;
  rows: {
    matricula: string;
    nome: string;
    empresa: string;
    escolha: string;
    dataRefeicao: string;
  }[];
}

export function SummaryPdfDocument({ data }: { data: SummaryPdfData }) {
  const selectionOrder: SelectionOption[] = ["MASSA", "STREET_FOOD", "TRADICIONAL"];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Resumo de Escolha de Refeição</Text>
        <Text style={styles.subtitle}>
          {data.mealTypeLabel} — {data.mealDateLabel}
        </Text>

        <View style={styles.table}>
          <View style={styles.headerRow}>
            <Text style={styles.cellMatricula}>Matrícula</Text>
            <Text style={styles.cellNome}>Nome</Text>
            <Text style={styles.cellEmpresa}>Empresa</Text>
            <Text style={styles.cellEscolha}>Escolha</Text>
            <Text style={styles.cellData}>Data da Refeição</Text>
          </View>
          {data.rows.map((row, i) => (
            <View style={styles.row} key={i}>
              <Text style={styles.cellMatricula}>{row.matricula}</Text>
              <Text style={styles.cellNome}>{row.nome}</Text>
              <Text style={styles.cellEmpresa}>{row.empresa}</Text>
              <Text style={styles.cellEscolha}>{row.escolha}</Text>
              <Text style={styles.cellData}>{row.dataRefeicao}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.totalsTitle}>Totais</Text>
        {selectionOrder.map((key) => (
          <View style={styles.totalsRow} key={key}>
            <Text style={styles.totalsLabel}>{SELECTION_LABELS[key]}</Text>
            <Text style={styles.totalsCount}>{data.totals.totals[key]}</Text>
            <Text style={styles.totalsPercent}>{data.totals.percentuais[key].toFixed(1)}%</Text>
          </View>
        ))}
        <View style={styles.totalsRow}>
          <Text style={styles.totalsLabel}>Total Geral</Text>
          <Text style={styles.totalsCount}>{data.totals.totalGeral}</Text>
          <Text style={styles.totalsPercent}>100.0%</Text>
        </View>
      </Page>
    </Document>
  );
}

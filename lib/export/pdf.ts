import { renderToBuffer } from "@react-pdf/renderer";
import { SummaryPdfDocument, type SummaryPdfData } from "@/components/pdf/SummaryPdfDocument";

export async function buildSummaryPdf(data: SummaryPdfData): Promise<Buffer> {
  return renderToBuffer(SummaryPdfDocument({ data }));
}

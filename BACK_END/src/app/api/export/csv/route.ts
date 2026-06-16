import { requireUser } from "@/lib/auth";
import { dateFormatter } from "@/lib/format";
import { getReportData } from "@/lib/report";

function csv(value: string) {
  return `"${value.replace(/"/g, '""')}"`;
}

export async function GET(request: Request) {
  const user = await requireUser();
  const params = new URL(request.url).searchParams;
  const report = await getReportData(user.id, {
    from: params.get("from"),
    to: params.get("to"),
    categoryId: params.get("categoryId"),
  });

  const rows = [
    ["Data", "Descricao", "Categoria", "Tipo", "Valor"],
    ...report.transactions.map((item) => [
      dateFormatter.format(item.date),
      item.description,
      item.category.name,
      item.type === "INCOME" ? "Receita" : "Despesa",
      Number(item.amount).toFixed(2).replace(".", ","),
    ]),
  ];

  const body = rows.map((row) => row.map(csv).join(";")).join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="relatorio-financeiro.csv"',
    },
  });
}

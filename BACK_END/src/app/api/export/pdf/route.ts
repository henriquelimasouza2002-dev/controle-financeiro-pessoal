import { requireUser } from "@/lib/auth";
import { createSimplePdf } from "@/lib/pdf";
import { dateFormatter, formatMoney } from "@/lib/format";
import { getReportData } from "@/lib/report";

export async function GET(request: Request) {
  const user = await requireUser();
  const params = new URL(request.url).searchParams;
  const report = await getReportData(user.id, {
    from: params.get("from"),
    to: params.get("to"),
    categoryId: params.get("categoryId"),
  });

  const lines = [
    `Usuario: ${user.name}`,
    `Receitas: ${formatMoney(report.summary.income)}`,
    `Despesas: ${formatMoney(report.summary.expense)}`,
    `Saldo: ${formatMoney(report.summary.balance)}`,
    `Transacoes: ${report.summary.count}`,
    "",
    ...report.transactions.map(
      (item) =>
        `${dateFormatter.format(item.date)} | ${item.type === "INCOME" ? "Receita" : "Despesa"} | ${
          item.category.name
        } | ${formatMoney(Number(item.amount))} | ${item.description}`,
    ),
  ];

  return new Response(createSimplePdf("Relatorio Financeiro", lines), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="relatorio-financeiro.pdf"',
    },
  });
}

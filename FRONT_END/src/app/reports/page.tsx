import { redirect } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { ReportPanel } from "@/components/ReportPanel";
import { Stats } from "@/components/Stats";
import { TransactionTable } from "@/components/TransactionTable";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getReportData } from "@/lib/report";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; categoryId?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const filters = await searchParams;
  const [categories, report] = await Promise.all([
    prisma.category.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } }),
    getReportData(user.id, filters),
  ]);

  return (
    <>
      <AppNav userName={user.name} />
      <main className="main">
        <div className="page-title">
          <div>
            <h1>Relatorios</h1>
            <p>Analise por periodo ou categoria e exporte os dados.</p>
          </div>
        </div>
        <Stats {...report.summary} />
        <ReportPanel categories={categories} chartItems={report.byCategory} months={report.byMonth} />
        <div className="panel" style={{ marginTop: 18 }}>
          <h2>Dados do relatorio</h2>
          <TransactionTable transactions={report.transactions} />
        </div>
      </main>
    </>
  );
}

import { redirect } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { CategoryChart } from "@/components/CategoryChart";
import { Stats } from "@/components/Stats";
import { TransactionTable } from "@/components/TransactionTable";
import { getCurrentUser } from "@/lib/auth";
import { getReportData } from "@/lib/report";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const report = await getReportData(user.id);
  const recent = report.transactions.slice(0, 6);

  return (
    <>
      <AppNav userName={user.name} />
      <main className="main">
        <div className="page-title">
          <div>
            <h1>Dashboard</h1>
            <p>Visao geral das suas financas.</p>
          </div>
        </div>
        <Stats {...report.summary} />
        <section className="dashboard-grid">
          <div className="panel">
            <h2>Transacoes recentes</h2>
            <TransactionTable transactions={recent} />
          </div>
          <div className="panel">
            <h2>Gastos por categoria</h2>
            <CategoryChart items={report.byCategory} />
          </div>
        </section>
      </main>
    </>
  );
}

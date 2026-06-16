"use client";

import { useSearchParams } from "next/navigation";
import { CategoryChart } from "./CategoryChart";

type Category = { id: string; name: string };
type ChartItem = { name: string; color: string; total: number };
type MonthItem = { month: string; income: number; expense: number };

export function ReportPanel({
  categories,
  chartItems,
  months,
}: {
  categories: Category[];
  chartItems: ChartItem[];
  months: MonthItem[];
}) {
  const searchParams = useSearchParams();
  const query = searchParams.toString();
  const suffix = query ? `?${query}` : "";
  const max = Math.max(...months.flatMap((item) => [item.income, item.expense]), 1);

  return (
    <section className="stack">
      <div className="panel">
        <h2>Filtros do relatorio</h2>
        <form action="/reports" className="filters">
          <label>
            De
            <input defaultValue={searchParams.get("from") ?? ""} name="from" type="date" />
          </label>
          <label>
            Ate
            <input defaultValue={searchParams.get("to") ?? ""} name="to" type="date" />
          </label>
          <label>
            Categoria
            <select defaultValue={searchParams.get("categoryId") ?? ""} name="categoryId">
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <button className="primary-button" type="submit">
            Gerar
          </button>
        </form>
        <div className="row-actions">
          <a className="ghost-button" href={`/api/export/csv${suffix}`}>
            Exportar CSV
          </a>
          <a className="ghost-button" href={`/api/export/pdf${suffix}`}>
            Exportar PDF
          </a>
        </div>
      </div>

      <section className="dashboard-grid">
        <div className="panel">
          <h2>Grafico de barras por mes</h2>
          <div className="bars">
            {months.map((item) => (
              <div className="bar-line" key={item.month}>
                <div className="bar-label">
                  <strong>{item.month}</strong>
                  <span>Receitas e despesas</span>
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ background: "#15803d", width: `${(item.income / max) * 100}%` }} />
                </div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ background: "#b91c1c", width: `${(item.expense / max) * 100}%` }} />
                </div>
              </div>
            ))}
            {months.length === 0 && <p className="notice">Nenhum dado no periodo.</p>}
          </div>
        </div>
        <div className="panel">
          <h2>Grafico pizza por categoria</h2>
          <CategoryChart items={chartItems} />
        </div>
      </section>
    </section>
  );
}

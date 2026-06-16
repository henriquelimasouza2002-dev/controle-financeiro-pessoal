import { formatMoney } from "@/lib/format";

export function Stats({
  income,
  expense,
  balance,
  count,
}: {
  income: number;
  expense: number;
  balance: number;
  count: number;
}) {
  return (
    <section className="stats">
      <div className="stat">
        <span>Receitas</span>
        <strong>{formatMoney(income)}</strong>
      </div>
      <div className="stat">
        <span>Despesas</span>
        <strong>{formatMoney(expense)}</strong>
      </div>
      <div className="stat">
        <span>Saldo</span>
        <strong>{formatMoney(balance)}</strong>
      </div>
      <div className="stat">
        <span>Transacoes</span>
        <strong>{count}</strong>
      </div>
    </section>
  );
}

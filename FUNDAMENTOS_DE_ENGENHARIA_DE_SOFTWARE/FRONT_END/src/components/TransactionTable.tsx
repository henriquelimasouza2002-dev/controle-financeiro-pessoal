import { TransactionType } from "@prisma/client";
import { dateFormatter, formatMoney } from "@/lib/format";

type Row = {
  id: string;
  type: TransactionType;
  amount: unknown;
  date: Date;
  description: string;
  category: { name: string; color: string };
};

export function TransactionTable({ transactions }: { transactions: Row[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Descricao</th>
            <th>Categoria</th>
            <th>Tipo</th>
            <th>Valor</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((item) => (
            <tr key={item.id}>
              <td>{dateFormatter.format(item.date)}</td>
              <td>{item.description}</td>
              <td>
                <i className="color-dot" style={{ background: item.category.color }} />
                {item.category.name}
              </td>
              <td>
                <span className={`pill ${item.type === "INCOME" ? "income" : "expense"}`}>
                  {item.type === "INCOME" ? "Receita" : "Despesa"}
                </span>
              </td>
              <td>{formatMoney(Number(item.amount))}</td>
            </tr>
          ))}
          {transactions.length === 0 && (
            <tr>
              <td colSpan={5}>Nenhuma transacao cadastrada.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { TransactionType } from "@prisma/client";
import { TransactionTable } from "./TransactionTable";

type Category = { id: string; name: string; type: TransactionType | null };
type Transaction = {
  id: string;
  type: TransactionType;
  amount: unknown;
  date: Date;
  description: string;
  category: { name: string; color: string };
};

export function TransactionManager({
  categories,
  transactions,
}: {
  categories: Category[];
  transactions: Transaction[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const formData = new FormData(event.currentTarget);
    const response = await fetch("/api/transactions", {
      method: "POST",
      body: JSON.stringify(Object.fromEntries(formData.entries())),
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ message: "Erro ao salvar transacao." }));
      setError(data.message);
      return;
    }

    event.currentTarget.reset();
    router.refresh();
  }

  async function clearAllFilters(form: HTMLFormElement) {
    form.reset();
    router.push("/transactions");
  }

  return (
    <section className="stack">
      <div className="panel">
        <h2>Nova transacao</h2>
        <form className="form-grid" onSubmit={submit}>
          <div className="grid-2">
            <label>
              Tipo
              <select name="type" required>
                <option value="EXPENSE">Despesa</option>
                <option value="INCOME">Receita</option>
              </select>
            </label>
            <label>
              Valor
              <input min="0.01" name="amount" placeholder="120,00" required step="0.01" />
            </label>
          </div>
          <div className="grid-2">
            <label>
              Data
              <input name="date" required type="date" />
            </label>
            <label>
              Categoria
              <select name="categoryId" required>
                <option value="">Selecione</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Descricao
            <input name="description" placeholder="Ex.: mercado, salario, aluguel" required />
          </label>
          {error && <div className="error">{error}</div>}
          <button className="primary-button" type="submit">
            Registrar transacao
          </button>
        </form>
      </div>

      <div className="panel">
        <h2>Filtros</h2>
        <form action="/transactions" className="filters">
          <label>
            De
            <input name="from" type="date" />
          </label>
          <label>
            Ate
            <input name="to" type="date" />
          </label>
          <label>
            Categoria
            <select name="categoryId">
              <option value="">Todas</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>
          <div className="row-actions">
            <button className="primary-button" type="submit">
              Filtrar
            </button>
            <button className="ghost-button" onClick={(event) => clearAllFilters(event.currentTarget.form!)} type="button">
              Limpar
            </button>
          </div>
        </form>
        <TransactionTable transactions={transactions} />
      </div>
    </section>
  );
}

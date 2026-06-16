"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { TransactionType } from "@prisma/client";

type Category = {
  id: string;
  name: string;
  color: string;
  type: TransactionType | null;
  _count: { transactions: number };
};

export function CategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Category | null>(null);
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    const formData = new FormData(event.currentTarget);
    const body = JSON.stringify(Object.fromEntries(formData.entries()));
    const response = await fetch("/api/categories", {
      method: editing ? "PUT" : "POST",
      body,
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({ message: "Erro ao salvar categoria." }));
      setError(data.message);
      return;
    }

    setEditing(null);
    event.currentTarget.reset();
    router.refresh();
  }

  async function remove(id: string) {
    const response = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    if (!response.ok) {
      const data = await response.json().catch(() => ({ message: "Erro ao excluir categoria." }));
      setError(data.message);
      return;
    }
    router.refresh();
  }

  return (
    <section className="dashboard-grid">
      <div className="panel">
        <h2>{editing ? "Editar categoria" : "Nova categoria"}</h2>
        <form className="form-grid" onSubmit={submit}>
          {editing && <input name="id" type="hidden" value={editing.id} />}
          <label>
            Nome
            <input key={editing?.id ?? "new-name"} defaultValue={editing?.name} name="name" required />
          </label>
          <div className="grid-2">
            <label>
              Cor
              <input key={editing?.id ?? "new-color"} defaultValue={editing?.color ?? "#0f766e"} name="color" type="color" />
            </label>
            <label>
              Tipo
              <select key={editing?.id ?? "new-type"} defaultValue={editing?.type ?? ""} name="type">
                <option value="">Ambos</option>
                <option value="INCOME">Receita</option>
                <option value="EXPENSE">Despesa</option>
              </select>
            </label>
          </div>
          {error && <div className="error">{error}</div>}
          <button className="primary-button" type="submit">
            Salvar categoria
          </button>
          {editing && (
            <button className="ghost-button" onClick={() => setEditing(null)} type="button">
              Cancelar
            </button>
          )}
        </form>
      </div>

      <div className="panel">
        <h2>Categorias cadastradas</h2>
        <div className="table-wrap compact-table">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Tipo</th>
                <th>Uso</th>
                <th>Acoes</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>
                    <i className="color-dot" style={{ background: category.color }} />
                    {category.name}
                  </td>
                  <td>{category.type === "INCOME" ? "Receita" : category.type === "EXPENSE" ? "Despesa" : "Ambos"}</td>
                  <td>{category._count.transactions}</td>
                  <td>
                    <div className="row-actions">
                      <button className="ghost-button" onClick={() => setEditing(category)} type="button">
                        Editar
                      </button>
                      <button className="danger-button" onClick={() => remove(category.id)} type="button">
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

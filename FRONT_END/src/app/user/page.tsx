import { redirect } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { getCurrentUser } from "@/lib/auth";
import { dateFormatter } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export default async function UserPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const [categories, transactions, sessions] = await Promise.all([
    prisma.category.count({ where: { userId: user.id } }),
    prisma.transaction.count({ where: { userId: user.id } }),
    prisma.session.count({ where: { userId: user.id } }),
  ]);

  return (
    <>
      <AppNav userName={user.name} />
      <main className="main">
        <div className="page-title">
          <div>
            <h1>Usuario</h1>
            <p>Dados da conta autenticada no sistema.</p>
          </div>
        </div>

        <section className="dashboard-grid">
          <div className="panel">
            <h2>Perfil</h2>
            <div className="stack">
              <label>
                Nome
                <input readOnly value={user.name} />
              </label>
              <label>
                E-mail
                <input readOnly value={user.email} />
              </label>
              <label>
                Criado em
                <input readOnly value={dateFormatter.format(user.createdAt)} />
              </label>
            </div>
          </div>

          <div className="panel">
            <h2>Resumo da conta</h2>
            <div className="stats" style={{ gridTemplateColumns: "1fr" }}>
              <div className="stat">
                <span>Categorias</span>
                <strong>{categories}</strong>
              </div>
              <div className="stat">
                <span>Transacoes</span>
                <strong>{transactions}</strong>
              </div>
              <div className="stat">
                <span>Sessoes ativas</span>
                <strong>{sessions}</strong>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

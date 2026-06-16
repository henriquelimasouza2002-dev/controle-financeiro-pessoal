import { redirect } from "next/navigation";
import { AppNav } from "@/components/AppNav";
import { TransactionManager } from "@/components/TransactionManager";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { buildTransactionWhere } from "@/lib/report";

export default async function TransactionsPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string; to?: string; categoryId?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/");

  const filters = await searchParams;
  const [categories, transactions] = await Promise.all([
    prisma.category.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } }),
    prisma.transaction.findMany({
      where: buildTransactionWhere(user.id, filters),
      include: { category: true },
      orderBy: { date: "desc" },
    }),
  ]);

  return (
    <>
      <AppNav userName={user.name} />
      <main className="main">
        <div className="page-title">
          <div>
            <h1>Transacoes</h1>
            <p>Registre receitas e despesas com valor, data, categoria e descricao.</p>
          </div>
        </div>
        <TransactionManager categories={categories} transactions={transactions} />
      </main>
    </>
  );
}

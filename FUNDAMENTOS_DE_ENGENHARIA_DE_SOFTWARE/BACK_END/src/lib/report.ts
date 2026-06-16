import { Prisma } from "@prisma/client";
import { prisma } from "./prisma";

export type ReportFilters = {
  from?: string | null;
  to?: string | null;
  categoryId?: string | null;
};

export function buildTransactionWhere(userId: string, filters: ReportFilters) {
  const where: Prisma.TransactionWhereInput = { userId };

  if (filters.categoryId) {
    where.categoryId = filters.categoryId;
  }

  if (filters.from || filters.to) {
    where.date = {};
    if (filters.from) where.date.gte = new Date(`${filters.from}T00:00:00`);
    if (filters.to) where.date.lte = new Date(`${filters.to}T23:59:59`);
  }

  return where;
}

export async function getReportData(userId: string, filters: ReportFilters = {}) {
  const transactions = await prisma.transaction.findMany({
    where: buildTransactionWhere(userId, filters),
    include: { category: true },
    orderBy: { date: "desc" },
  });

  const income = transactions
    .filter((item) => item.type === "INCOME")
    .reduce((sum, item) => sum + Number(item.amount), 0);
  const expense = transactions
    .filter((item) => item.type === "EXPENSE")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const byCategory = transactions.reduce<Record<string, { name: string; color: string; total: number }>>(
    (acc, item) => {
      const current = acc[item.categoryId] ?? {
        name: item.category.name,
        color: item.category.color,
        total: 0,
      };
      current.total += Number(item.amount);
      acc[item.categoryId] = current;
      return acc;
    },
    {},
  );

  const byMonth = transactions.reduce<Record<string, { income: number; expense: number }>>((acc, item) => {
    const key = item.date.toISOString().slice(0, 7);
    const current = acc[key] ?? { income: 0, expense: 0 };
    if (item.type === "INCOME") current.income += Number(item.amount);
    if (item.type === "EXPENSE") current.expense += Number(item.amount);
    acc[key] = current;
    return acc;
  }, {});

  return {
    transactions,
    summary: {
      income,
      expense,
      balance: income - expense,
      count: transactions.length,
    },
    byCategory: Object.values(byCategory).sort((a, b) => b.total - a.total),
    byMonth: Object.entries(byMonth)
      .map(([month, values]) => ({ month, ...values }))
      .sort((a, b) => a.month.localeCompare(b.month)),
  };
}

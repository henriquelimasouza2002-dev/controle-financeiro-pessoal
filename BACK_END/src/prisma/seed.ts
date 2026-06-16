import { PrismaClient, TransactionType } from "@prisma/client";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "demo@financas.com" },
    update: {},
    create: {
      name: "Usuario Demo",
      email: "demo@financas.com",
      passwordHash: await hashPassword("123456"),
    },
  });

  const categories = [
    ["Salario", "#15803d", TransactionType.INCOME],
    ["Freelance", "#0f766e", TransactionType.INCOME],
    ["Alimentacao", "#dc2626", TransactionType.EXPENSE],
    ["Transporte", "#ea580c", TransactionType.EXPENSE],
    ["Moradia", "#7c3aed", TransactionType.EXPENSE],
    ["Lazer", "#0891b2", TransactionType.EXPENSE],
  ] as const;

  for (const [name, color, type] of categories) {
    await prisma.category.upsert({
      where: { name_userId: { name, userId: user.id } },
      update: { color, type },
      create: { name, color, type, userId: user.id },
    });
  }
}

main()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });

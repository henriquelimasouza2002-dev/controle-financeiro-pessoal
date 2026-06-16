import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { parseAmount } from "@/lib/format";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const data = await request.json();
    const amount = parseAmount(String(data.amount ?? ""));
    const type = data.type === "INCOME" ? "INCOME" : "EXPENSE";
    const categoryId = String(data.categoryId ?? "");
    const description = String(data.description ?? "").trim();
    const date = String(data.date ?? "");

    if (!categoryId || !description || Number.isNaN(amount) || amount <= 0 || !date) {
      return NextResponse.json({ message: "Preencha todos os dados da transacao." }, { status: 400 });
    }

    const category = await prisma.category.findFirst({ where: { id: categoryId, userId: user.id } });
    if (!category) return NextResponse.json({ message: "Categoria invalida." }, { status: 400 });

    const transaction = await prisma.transaction.create({
      data: {
        type,
        amount,
        date: new Date(`${date}T12:00:00`),
        description,
        categoryId,
        userId: user.id,
      },
    });

    return NextResponse.json(transaction, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Nao foi possivel registrar a transacao." }, { status: 400 });
  }
}

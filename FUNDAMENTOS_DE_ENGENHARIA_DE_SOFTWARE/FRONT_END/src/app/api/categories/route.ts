import { TransactionType } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function normalizeType(type: unknown) {
  return type === "INCOME" || type === "EXPENSE" ? (type as TransactionType) : null;
}

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const data = await request.json();
    const name = String(data.name ?? "").trim();
    const color = String(data.color ?? "#0f766e");

    if (!name) return NextResponse.json({ message: "Nome da categoria e obrigatorio." }, { status: 400 });

    const category = await prisma.category.create({
      data: { name, color, type: normalizeType(data.type), userId: user.id },
    });

    return NextResponse.json(category, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Nao foi possivel criar a categoria." }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireUser();
    const data = await request.json();
    const id = String(data.id ?? "");
    const name = String(data.name ?? "").trim();
    const color = String(data.color ?? "#0f766e");

    if (!id || !name) return NextResponse.json({ message: "Dados invalidos." }, { status: 400 });

    const existing = await prisma.category.findFirst({ where: { id, userId: user.id } });
    if (!existing) return NextResponse.json({ message: "Categoria nao encontrada." }, { status: 404 });

    const category = await prisma.category.update({
      where: { id },
      data: { name, color, type: normalizeType(data.type) },
    });

    return NextResponse.json(category);
  } catch {
    return NextResponse.json({ message: "Nao foi possivel editar a categoria." }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await requireUser();
    const id = new URL(request.url).searchParams.get("id") ?? "";
    const count = await prisma.transaction.count({ where: { categoryId: id, userId: user.id } });

    if (count > 0) {
      return NextResponse.json({ message: "Exclua ou mova as transacoes desta categoria primeiro." }, { status: 409 });
    }

    const existing = await prisma.category.findFirst({ where: { id, userId: user.id } });
    if (!existing) return NextResponse.json({ message: "Categoria nao encontrada." }, { status: 404 });

    await prisma.category.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: "Nao foi possivel excluir a categoria." }, { status: 400 });
  }
}

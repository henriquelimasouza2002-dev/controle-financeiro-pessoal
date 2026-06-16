import { NextResponse } from "next/server";
import { attachSessionCookie, createSession } from "@/lib/auth";
import { hashPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const data = await request.json();
  const name = String(data.name ?? "").trim();
  const email = String(data.email ?? "").trim().toLowerCase();
  const password = String(data.password ?? "");

  if (!name || !email || password.length < 6) {
    return NextResponse.json({ message: "Informe nome, e-mail e senha com no minimo 6 caracteres." }, { status: 400 });
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json({ message: "Este e-mail ja esta cadastrado." }, { status: 409 });
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await hashPassword(password),
      categories: {
        create: [
          { name: "Salario", color: "#15803d", type: "INCOME" },
          { name: "Alimentacao", color: "#dc2626", type: "EXPENSE" },
          { name: "Transporte", color: "#ea580c", type: "EXPENSE" },
          { name: "Moradia", color: "#7c3aed", type: "EXPENSE" },
        ],
      },
    },
  });

  const session = await createSession(user.id);
  const response = NextResponse.json({ ok: true });
  attachSessionCookie(response, session.token, session.expiresAt);
  return response;
}

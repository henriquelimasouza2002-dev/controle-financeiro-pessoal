import { NextResponse } from "next/server";
import { attachSessionCookie, createSession } from "@/lib/auth";
import { verifyPassword } from "@/lib/password";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const data = await request.json();
  const email = String(data.email ?? "").trim().toLowerCase();
  const password = String(data.password ?? "");

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return NextResponse.json({ message: "E-mail ou senha invalidos." }, { status: 401 });
  }

  const session = await createSession(user.id);
  const response = NextResponse.json({ ok: true });
  attachSessionCookie(response, session.token, session.expiresAt);
  return response;
}

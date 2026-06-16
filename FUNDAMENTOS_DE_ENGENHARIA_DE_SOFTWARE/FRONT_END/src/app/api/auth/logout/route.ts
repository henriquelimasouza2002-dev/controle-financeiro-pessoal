import { NextResponse } from "next/server";
import { clearSessionCookie, destroySession } from "@/lib/auth";

export async function POST() {
  await destroySession();
  const response = NextResponse.json({ ok: true });
  clearSessionCookie(response);
  return response;
}

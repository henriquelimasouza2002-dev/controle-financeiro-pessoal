import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { getReportData } from "@/lib/report";

export async function GET(request: Request) {
  const user = await requireUser();
  const params = new URL(request.url).searchParams;
  const report = await getReportData(user.id, {
    from: params.get("from"),
    to: params.get("to"),
    categoryId: params.get("categoryId"),
  });

  return NextResponse.json(report);
}

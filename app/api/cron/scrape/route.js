import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return true;
  }

  const authHeader = request.headers.get("authorization") ?? "";
  return authHeader === `Bearer ${secret}`;
}

export async function GET(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { runAllIngestion } = await import("@/lib/ingestion/run-all");
  const summary = await runAllIngestion();
  const status = summary.ok ? 200 : 500;

  return NextResponse.json(summary, { status });
}

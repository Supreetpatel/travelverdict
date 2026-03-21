import { NextResponse } from "next/server";
import { getHomeFeedData } from "@/lib/db-ui";

export const runtime = "nodejs";

export async function GET() {
  const data = await getHomeFeedData();
  return NextResponse.json(data);
}

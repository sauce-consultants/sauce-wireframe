import { NextRequest, NextResponse } from "next/server";
import { getJournalEntries } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const customerId = request.nextUrl.searchParams.get("customerId");

  if (!customerId) {
    return NextResponse.json({ error: "customerId is required" }, { status: 400 });
  }

  const entries = await getJournalEntries(Number(customerId));
  return NextResponse.json(entries);
}

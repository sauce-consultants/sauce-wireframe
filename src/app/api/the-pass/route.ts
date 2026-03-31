import { NextResponse } from "next/server";
import { getCustomersByStage } from "@/lib/queries";

export const dynamic = "force-dynamic";

export async function GET() {
  const data = getCustomersByStage();
  return NextResponse.json(data);
}

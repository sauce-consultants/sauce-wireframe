import { NextRequest, NextResponse } from "next/server";
import { getDishesByStatus } from "@/lib/dish-queries";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const tableParams = request.nextUrl.searchParams.getAll("table");
  const customerIds = tableParams.map(Number).filter(Boolean);

  const data = getDishesByStatus(customerIds.length > 0 ? customerIds : undefined);
  return NextResponse.json(data);
}

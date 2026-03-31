import { NextResponse } from "next/server";
import { getDishComments, getDishHistory } from "@/lib/dish-queries";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const dishId = Number(id);

  if (!dishId) {
    return NextResponse.json({ error: "Invalid dish ID" }, { status: 400 });
  }

  const comments = await getDishComments(dishId);
  const history = await getDishHistory(dishId);

  return NextResponse.json({ comments, history });
}

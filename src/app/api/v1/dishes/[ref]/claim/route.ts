import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { getDishByRef, updateDish } from "@/lib/dish-queries";

export const dynamic = "force-dynamic";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  const agent = validateApiKey(request.headers.get("authorization"));
  if (!agent) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  const { ref } = await params;
  const dish = getDishByRef(ref.toUpperCase());

  if (!dish) {
    return NextResponse.json({ error: `Dish ${ref} not found` }, { status: 404 });
  }

  updateDish({
    id: dish.id,
    title: dish.title,
    body: dish.body,
    status: dish.status,
    customerId: dish.customerId,
    assignee: dish.assignee ?? undefined,
    agent: agent.agentName,
    priority: dish.priority,
    size: dish.size ?? undefined,
    labels: dish.labels.join(","),
    changedBy: agent.agentName,
    changedByType: "agent",
  });

  const updated = getDishByRef(ref.toUpperCase());
  return NextResponse.json({ message: `Claimed by ${agent.agentName}`, dish: updated });
}

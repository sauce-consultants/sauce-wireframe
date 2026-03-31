import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { getDishByRef, getDishComments, getDishHistory, updateDish } from "@/lib/dish-queries";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  const agent = await validateApiKey(request.headers.get("authorization"));
  if (!agent) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  const { ref } = await params;
  const dish = await getDishByRef(ref.toUpperCase());

  if (!dish) {
    return NextResponse.json({ error: `Dish ${ref} not found` }, { status: 404 });
  }

  return NextResponse.json({
    ...dish,
    comments: await getDishComments(dish.id),
    history: await getDishHistory(dish.id),
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ ref: string }> }
) {
  const agent = await validateApiKey(request.headers.get("authorization"));
  if (!agent) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  const { ref } = await params;
  const dish = await getDishByRef(ref.toUpperCase());

  if (!dish) {
    return NextResponse.json({ error: `Dish ${ref} not found` }, { status: 404 });
  }

  const body = await request.json();

  await updateDish({
    id: dish.id,
    title: body.title ?? dish.title,
    body: body.body ?? dish.body,
    status: body.status ?? dish.status,
    customerId: body.customerId ?? dish.customerId,
    assignee: body.assignee !== undefined ? body.assignee : dish.assignee ?? undefined,
    agent: body.agent !== undefined ? body.agent : dish.agent ?? undefined,
    priority: body.priority ?? dish.priority,
    size: body.size !== undefined ? body.size : dish.size ?? undefined,
    labels: body.labels !== undefined ? (Array.isArray(body.labels) ? body.labels.join(",") : body.labels) : dish.labels.join(","),
    changedBy: agent.agentName,
    changedByType: "agent",
  });

  const updated = await getDishByRef(ref.toUpperCase());
  return NextResponse.json(updated);
}

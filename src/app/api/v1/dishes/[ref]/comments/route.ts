import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { getDishByRef, insertDishComment, getDishComments } from "@/lib/dish-queries";

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

  const body = await request.json();

  if (!body.content?.trim()) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const id = insertDishComment({
    dishId: dish.id,
    content: body.content.trim(),
    authorName: agent.agentName,
    authorType: "agent",
  });

  return NextResponse.json({ id, message: "Comment added" }, { status: 201 });
}

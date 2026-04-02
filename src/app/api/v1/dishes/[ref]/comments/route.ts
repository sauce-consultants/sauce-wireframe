import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { getDishByRef, insertDishComment, getDishComments, getDishComment, updateDishComment } from "@/lib/dish-queries";

export const dynamic = "force-dynamic";

export async function POST(
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

  if (!body.content?.trim()) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const id = await insertDishComment({
    dishId: dish.id,
    content: body.content.trim(),
    authorName: agent.agentName,
    authorType: "agent",
  });

  return NextResponse.json({ id, message: "Comment added" }, { status: 201 });
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
  if (!body.commentId) {
    return NextResponse.json({ error: "commentId is required" }, { status: 400 });
  }
  if (!body.content?.trim()) {
    return NextResponse.json({ error: "content is required" }, { status: 400 });
  }

  const comment = await getDishComment(body.commentId);
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }
  if (comment.author_name !== agent.agentName) {
    return NextResponse.json({ error: "You can only edit your own comments" }, { status: 403 });
  }

  await updateDishComment(body.commentId, body.content.trim());
  return NextResponse.json({ message: "Comment updated" });
}

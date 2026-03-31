import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { getDishesByStatus, getDishComments, getDishHistory } from "@/lib/dish-queries";
import { getDb } from "@/lib/db";
import type { Dish } from "@/components/the-kitchen/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const agent = validateApiKey(request.headers.get("authorization"));
  if (!agent) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const projectCode = params.get("project");
  const statusFilter = params.get("status");
  const assigneeFilter = params.get("assignee");
  const agentFilter = params.get("agent");

  // Resolve project short code to customer IDs
  let customerIds: number[] | undefined;
  if (projectCode) {
    const db = getDb();
    const codes = projectCode.split(",").map((c) => c.trim().toUpperCase());
    const placeholders = codes.map(() => "?").join(",");
    const rows = db.prepare(`SELECT id FROM customers WHERE short_code IN (${placeholders})`).all(...codes) as { id: number }[];
    customerIds = rows.map((r) => r.id);
    if (customerIds.length === 0) {
      return NextResponse.json({ error: `No projects found for code(s): ${projectCode}` }, { status: 404 });
    }
  }

  const board = getDishesByStatus(customerIds);

  // Flatten all dishes
  let allDishes: Dish[] = [
    ...board.backlog,
    ...board.todo,
    ...board.in_progress,
    ...board.review,
    ...board.done,
  ];

  // Apply filters
  if (statusFilter) {
    const statuses = statusFilter.split(",").map((s) => s.trim());
    allDishes = allDishes.filter((d) => statuses.includes(d.status));
  }
  if (assigneeFilter) {
    allDishes = allDishes.filter((d) => d.assignee === assigneeFilter);
  }
  if (agentFilter) {
    allDishes = allDishes.filter((d) => d.agent === agentFilter);
  }

  // Enrich with comments and history
  const enriched = allDishes.map((dish) => ({
    ...dish,
    comments: getDishComments(dish.id),
    history: getDishHistory(dish.id),
  }));

  return NextResponse.json({ dishes: enriched, count: enriched.length });
}

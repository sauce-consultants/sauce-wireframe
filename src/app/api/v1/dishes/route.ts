import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { getDishesByStatus, getDishComments, getDishHistory } from "@/lib/dish-queries";
import { initDb } from "@/lib/db";
import type { Dish } from "@/components/the-kitchen/types";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const agent = await validateApiKey(request.headers.get("authorization"));
  if (!agent) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  const params = request.nextUrl.searchParams;
  const projectCode = params.get("project");
  const statusFilter = params.get("status");
  const assigneeFilter = params.get("assignee");
  const agentFilter = params.get("agent");

  let customerIds: number[] | undefined;
  if (projectCode) {
    const db = await initDb();
    const codes = projectCode.split(",").map((c) => c.trim().toUpperCase());
    const placeholders = codes.map(() => "?").join(",");
    const result = await db.execute({ sql: `SELECT id FROM customers WHERE short_code IN (${placeholders})`, args: codes });
    customerIds = result.rows.map((r) => Number(r.id));
    if (customerIds.length === 0) {
      return NextResponse.json({ error: `No projects found for code(s): ${projectCode}` }, { status: 404 });
    }
  }

  const board = await getDishesByStatus(customerIds);

  let allDishes: Dish[] = [
    ...board.backlog,
    ...board.todo,
    ...board.in_progress,
    ...board.review,
    ...board.done,
  ];

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

  const enriched = await Promise.all(
    allDishes.map(async (dish) => ({
      ...dish,
      comments: await getDishComments(dish.id),
      history: await getDishHistory(dish.id),
    }))
  );

  return NextResponse.json({ dishes: enriched, count: enriched.length });
}

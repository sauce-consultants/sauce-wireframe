import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { getDishesByStatus, getDishComments, getDishHistory, insertDish, getDishById } from "@/lib/dish-queries";
import { initDb } from "@/lib/db";
import type { Dish, DishStatus, Priority } from "@/components/the-kitchen/types";

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

const VALID_STATUSES: DishStatus[] = ["backlog", "todo", "in_progress", "review", "done"];
const VALID_PRIORITIES: Priority[] = ["high", "med", "low"];

export async function POST(request: NextRequest) {
  const agent = await validateApiKey(request.headers.get("authorization"));
  if (!agent) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  const body = await request.json();
  const { title, project, body: ticketBody, status, assignee, agent: agentName, priority, size, labels } = body;

  if (!title?.trim()) {
    return NextResponse.json({ error: "title is required" }, { status: 400 });
  }
  if (!project) {
    return NextResponse.json({ error: "project (short code) is required" }, { status: 400 });
  }

  // Resolve project short code to customer ID
  const db = await initDb();
  const result = await db.execute({
    sql: "SELECT id FROM customers WHERE short_code = ?",
    args: [String(project).toUpperCase()],
  });
  if (result.rows.length === 0) {
    return NextResponse.json({ error: `No project found for code: ${project}` }, { status: 404 });
  }
  const customerId = Number(result.rows[0].id);

  const dishId = await insertDish({
    title: title.trim(),
    body: ticketBody?.trim() || "",
    status: VALID_STATUSES.includes(status) ? status : "backlog",
    customerId,
    assignee: assignee?.trim() || undefined,
    agent: agentName?.trim() || undefined,
    priority: VALID_PRIORITIES.includes(priority) ? priority : "med",
    size: size?.trim() || undefined,
    labels: labels?.trim() || "",
  });

  const dish = await getDishById(dishId);
  const comments = await getDishComments(dishId);
  const history = await getDishHistory(dishId);

  return NextResponse.json({ ...dish, comments, history }, { status: 201 });
}

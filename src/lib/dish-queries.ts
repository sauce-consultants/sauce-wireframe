import { initDb } from "./db";
import type { Dish, KitchenBoard, DishStatus, Priority, ProjectOption, DishComment, DishHistoryEntry, AuthorType } from "@/components/the-kitchen/types";

interface DishRow {
  id: number;
  title: string;
  body: string;
  status: DishStatus;
  customer_id: number;
  company_name: string;
  subtitle: string | null;
  short_code: string | null;
  dish_number: number;
  assignee: string | null;
  agent: string | null;
  priority: string;
  size: string | null;
  labels: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function makeRef(shortCode: string | null, dishNumber: number): string {
  const code = shortCode || "???";
  return `${code}-${String(dishNumber).padStart(4, "0")}`;
}

function rowToDish(row: DishRow): Dish {
  return {
    id: row.id,
    title: row.title,
    body: row.body,
    status: row.status,
    customerId: row.customer_id,
    customerName: row.company_name,
    customerSubtitle: row.subtitle,
    customerShortCode: row.short_code,
    dishNumber: row.dish_number,
    ref: makeRef(row.short_code, row.dish_number),
    assignee: row.assignee,
    agent: row.agent,
    priority: (row.priority || "med") as Priority,
    size: row.size,
    labels: row.labels ? row.labels.split(",").map((l) => l.trim()).filter(Boolean) : [],
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function getDishesByStatus(customerIds?: number[]): Promise<KitchenBoard> {
  const db = await initDb();

  let query = `
    SELECT d.*, c.company_name, c.subtitle, c.short_code
    FROM dishes d
    JOIN customers c ON d.customer_id = c.id
  `;
  const params: (number | string)[] = [];

  const conditions: string[] = [];

  if (customerIds && customerIds.length > 0) {
    const placeholders = customerIds.map(() => "?").join(",");
    conditions.push(`d.customer_id IN (${placeholders})`);
    params.push(...customerIds);
  }

  // Exclude done dishes older than 14 days to keep the board lean
  const cutoff = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString();
  conditions.push(`(d.status != 'done' OR d.updated_at > ?)`);
  params.push(cutoff);

  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(" AND ")}`;
  }

  query += " ORDER BY d.sort_order ASC, d.id ASC";

  const result = await db.execute({ sql: query, args: params });
  const rows = result.rows as unknown as DishRow[];

  const board: KitchenBoard = {
    backlog: [],
    todo: [],
    in_progress: [],
    review: [],
    done: [],
  };

  for (const row of rows) {
    const dish = rowToDish(row);
    board[dish.status].push(dish);
  }

  return board;
}

export async function getDishById(id: number): Promise<Dish | null> {
  const db = await initDb();
  const result = await db.execute({
    sql: `
      SELECT d.*, c.company_name, c.subtitle, c.short_code
      FROM dishes d
      JOIN customers c ON d.customer_id = c.id
      WHERE d.id = ?
    `,
    args: [id],
  });

  const row = result.rows[0] as unknown as DishRow | undefined;
  return row ? rowToDish(row) : null;
}

export interface NewDish {
  title: string;
  body?: string;
  status?: DishStatus;
  customerId: number;
  assignee?: string;
  agent?: string;
  priority?: Priority;
  size?: string;
  labels?: string;
}

export async function insertDish(data: NewDish): Promise<number> {
  const db = await initDb();
  const now = new Date().toISOString();

  // Auto-increment dish_number per project
  const maxResult = await db.execute({
    sql: "SELECT COALESCE(MAX(dish_number), 0) as max_num FROM dishes WHERE customer_id = ?",
    args: [data.customerId],
  });
  const maxRow = maxResult.rows[0] as unknown as { max_num: number };
  const dishNumber = maxRow.max_num + 1;

  const result = await db.execute({
    sql: `
      INSERT INTO dishes (title, body, status, customer_id, dish_number, assignee, agent, priority, size, labels, sort_order, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?, ?)
    `,
    args: [
      data.title,
      data.body || "",
      data.status || "backlog",
      data.customerId,
      dishNumber,
      data.assignee || null,
      data.agent || null,
      data.priority || "med",
      data.size || null,
      data.labels || "",
      now,
      now,
    ],
  });

  return Number(result.lastInsertRowid);
}

export interface UpdateDish {
  id: number;
  title: string;
  body?: string;
  status: DishStatus;
  customerId: number;
  assignee?: string;
  agent?: string;
  priority?: Priority;
  size?: string;
  labels?: string;
  changedBy: string;
  changedByType: AuthorType;
}

export async function updateDish(data: UpdateDish): Promise<void> {
  const db = await initDb();
  const now = new Date().toISOString();

  // Fetch current state for diff
  const currentResult = await db.execute({
    sql: "SELECT * FROM dishes WHERE id = ?",
    args: [data.id],
  });
  const current = currentResult.rows[0] as unknown as {
    title: string; body: string; status: string; customer_id: number;
    assignee: string | null; agent: string | null; priority: string;
    size: string | null; labels: string;
  } | undefined;

  // Perform update
  await db.execute({
    sql: `
      UPDATE dishes
      SET title = ?,
          body = ?,
          status = ?,
          customer_id = ?,
          assignee = ?,
          agent = ?,
          priority = ?,
          size = ?,
          labels = ?,
          updated_at = ?
      WHERE id = ?
    `,
    args: [
      data.title,
      data.body || "",
      data.status,
      data.customerId,
      data.assignee || null,
      data.agent || null,
      data.priority || "med",
      data.size || null,
      data.labels || "",
      now,
      data.id,
    ],
  });

  // Record field-level history
  if (current) {
    const diffs: [string, string | null, string | null][] = [];
    if (current.title !== data.title) diffs.push(["title", current.title, data.title]);
    if (current.body !== (data.body || "")) diffs.push(["body", current.body, data.body || ""]);
    if (current.status !== data.status) diffs.push(["status", current.status, data.status]);
    if (current.customer_id !== data.customerId) diffs.push(["project", String(current.customer_id), String(data.customerId)]);
    if ((current.assignee || "") !== (data.assignee || "")) diffs.push(["assignee", current.assignee, data.assignee || null]);
    if ((current.agent || "") !== (data.agent || "")) diffs.push(["agent", current.agent, data.agent || null]);
    if ((current.priority || "med") !== (data.priority || "med")) diffs.push(["priority", current.priority, data.priority || "med"]);
    if ((current.size || "") !== (data.size || "")) diffs.push(["size", current.size, data.size || null]);
    if ((current.labels || "") !== (data.labels || "")) diffs.push(["labels", current.labels, data.labels || ""]);

    for (const [field, oldVal, newVal] of diffs) {
      await db.execute({
        sql: `
          INSERT INTO dish_history (dish_id, field, old_value, new_value, changed_by, changed_by_type, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        args: [data.id, field, oldVal, newVal, data.changedBy, data.changedByType, now],
      });
    }
  }
}

export async function getAllCustomersSimple(): Promise<ProjectOption[]> {
  const db = await initDb();
  const result = await db.execute("SELECT id, company_name, subtitle, short_code FROM customers ORDER BY company_name ASC");
  return result.rows.map((r) => ({
    id: Number(r.id),
    name: String(r.company_name),
    subtitle: r.subtitle ? String(r.subtitle) : null,
    shortCode: r.short_code ? String(r.short_code) : null,
  }));
}

// --- Users ---

export interface UserOption {
  id: number;
  name: string;
  email: string;
}

export async function getAllUsers(): Promise<UserOption[]> {
  const db = await initDb();
  const result = await db.execute("SELECT id, name, email FROM users ORDER BY name ASC");
  return result.rows.map((r) => ({ id: Number(r.id), name: String(r.name), email: String(r.email) }));
}

// --- Ref-based lookup ---

export async function getDishByRef(ref: string): Promise<Dish | null> {
  const match = ref.match(/^([A-Z0-9]+)-(\d+)$/);
  if (!match) return null;

  const [, shortCode, numStr] = match;
  const dishNumber = parseInt(numStr, 10);

  const db = await initDb();
  const result = await db.execute({
    sql: `
      SELECT d.*, c.company_name, c.subtitle, c.short_code
      FROM dishes d
      JOIN customers c ON d.customer_id = c.id
      WHERE c.short_code = ? AND d.dish_number = ?
    `,
    args: [shortCode, dishNumber],
  });

  const row = result.rows[0] as unknown as DishRow | undefined;
  return row ? rowToDish(row) : null;
}

// --- Full detail for agent API ---

export async function getDishFullDetail(dishId: number): Promise<{ dish: Dish; comments: DishComment[]; history: DishHistoryEntry[] } | null> {
  const dish = await getDishById(dishId);
  if (!dish) return null;

  return {
    dish,
    comments: await getDishComments(dishId),
    history: await getDishHistory(dishId),
  };
}

// --- Comments ---

export async function getDishComments(dishId: number): Promise<DishComment[]> {
  const db = await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM dish_comments WHERE dish_id = ? ORDER BY created_at DESC",
    args: [dishId],
  });
  const rows = result.rows as unknown as {
    id: number; dish_id: number; content: string; author_name: string; author_type: string; created_at: string; updated_at: string | null;
  }[];
  return rows.map((r) => ({
    id: r.id,
    dishId: r.dish_id,
    content: r.content,
    authorName: r.author_name,
    authorType: r.author_type as AuthorType,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));
}

export interface NewDishComment {
  dishId: number;
  content: string;
  authorName: string;
  authorType: AuthorType;
}

export async function insertDishComment(data: NewDishComment): Promise<number> {
  const db = await initDb();
  const now = new Date().toISOString();
  const result = await db.execute({
    sql: `
      INSERT INTO dish_comments (dish_id, content, author_name, author_type, created_at)
      VALUES (?, ?, ?, ?, ?)
    `,
    args: [data.dishId, data.content, data.authorName, data.authorType, now],
  });
  return Number(result.lastInsertRowid);
}

export async function updateDishComment(commentId: number, content: string): Promise<void> {
  const db = await initDb();
  const now = new Date().toISOString();
  await db.execute({
    sql: "UPDATE dish_comments SET content = ?, updated_at = ? WHERE id = ?",
    args: [content, now, commentId],
  });
}

export async function getDishComment(commentId: number): Promise<{ author_name: string } | null> {
  const db = await initDb();
  const result = await db.execute({
    sql: "SELECT author_name FROM dish_comments WHERE id = ?",
    args: [commentId],
  });
  if (result.rows.length === 0) return null;
  return { author_name: String(result.rows[0].author_name) };
}

// --- History ---

export async function getDishHistory(dishId: number): Promise<DishHistoryEntry[]> {
  const db = await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM dish_history WHERE dish_id = ? ORDER BY created_at DESC",
    args: [dishId],
  });
  const rows = result.rows as unknown as {
    id: number; dish_id: number; field: string; old_value: string | null; new_value: string | null;
    changed_by: string; changed_by_type: string; created_at: string;
  }[];
  return rows.map((r) => ({
    id: r.id,
    dishId: r.dish_id,
    field: r.field,
    oldValue: r.old_value,
    newValue: r.new_value,
    changedBy: r.changed_by,
    changedByType: r.changed_by_type as AuthorType,
    createdAt: r.created_at,
  }));
}

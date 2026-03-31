import { getDb } from "./db";
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

export function getDishesByStatus(customerIds?: number[]): KitchenBoard {
  const db = getDb();

  let query = `
    SELECT d.*, c.company_name, c.subtitle, c.short_code
    FROM dishes d
    JOIN customers c ON d.customer_id = c.id
  `;
  const params: number[] = [];

  if (customerIds && customerIds.length > 0) {
    const placeholders = customerIds.map(() => "?").join(",");
    query += ` WHERE d.customer_id IN (${placeholders})`;
    params.push(...customerIds);
  }

  query += " ORDER BY d.sort_order ASC, d.id ASC";

  const rows = db.prepare(query).all(...params) as DishRow[];

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

export function getDishById(id: number): Dish | null {
  const db = getDb();
  const row = db.prepare(`
    SELECT d.*, c.company_name, c.subtitle, c.short_code
    FROM dishes d
    JOIN customers c ON d.customer_id = c.id
    WHERE d.id = ?
  `).get(id) as DishRow | undefined;

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

export function insertDish(data: NewDish): number {
  const db = getDb();
  const now = new Date().toISOString();

  // Auto-increment dish_number per project
  const maxRow = db.prepare("SELECT COALESCE(MAX(dish_number), 0) as max_num FROM dishes WHERE customer_id = ?").get(data.customerId) as { max_num: number };
  const dishNumber = maxRow.max_num + 1;

  const result = db.prepare(`
    INSERT INTO dishes (title, body, status, customer_id, dish_number, assignee, agent, priority, size, labels, sort_order, created_at, updated_at)
    VALUES (@title, @body, @status, @customer_id, @dish_number, @assignee, @agent, @priority, @size, @labels, 0, @created_at, @updated_at)
  `).run({
    title: data.title,
    body: data.body || "",
    status: data.status || "backlog",
    customer_id: data.customerId,
    dish_number: dishNumber,
    assignee: data.assignee || null,
    agent: data.agent || null,
    priority: data.priority || "med",
    size: data.size || null,
    labels: data.labels || "",
    created_at: now,
    updated_at: now,
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

export function updateDish(data: UpdateDish): void {
  const db = getDb();
  const now = new Date().toISOString();

  // Fetch current state for diff
  const current = db.prepare("SELECT * FROM dishes WHERE id = ?").get(data.id) as {
    title: string; body: string; status: string; customer_id: number;
    assignee: string | null; agent: string | null; priority: string;
    size: string | null; labels: string;
  } | undefined;

  // Perform update
  db.prepare(`
    UPDATE dishes
    SET title = @title,
        body = @body,
        status = @status,
        customer_id = @customer_id,
        assignee = @assignee,
        agent = @agent,
        priority = @priority,
        size = @size,
        labels = @labels,
        updated_at = @updated_at
    WHERE id = @id
  `).run({
    id: data.id,
    title: data.title,
    body: data.body || "",
    status: data.status,
    customer_id: data.customerId,
    assignee: data.assignee || null,
    agent: data.agent || null,
    priority: data.priority || "med",
    size: data.size || null,
    labels: data.labels || "",
    updated_at: now,
  });

  // Record field-level history
  if (current) {
    const insertHistory = db.prepare(`
      INSERT INTO dish_history (dish_id, field, old_value, new_value, changed_by, changed_by_type, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

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
      insertHistory.run(data.id, field, oldVal, newVal, data.changedBy, data.changedByType, now);
    }
  }
}

export function getAllCustomersSimple(): ProjectOption[] {
  const db = getDb();
  const rows = db.prepare("SELECT id, company_name, subtitle, short_code FROM customers ORDER BY company_name ASC").all() as { id: number; company_name: string; subtitle: string | null; short_code: string | null }[];
  return rows.map((r) => ({ id: r.id, name: r.company_name, subtitle: r.subtitle, shortCode: r.short_code }));
}

// --- Users ---

export interface UserOption {
  id: number;
  name: string;
  email: string;
}

export function getAllUsers(): UserOption[] {
  const db = getDb();
  const rows = db.prepare("SELECT id, name, email FROM users ORDER BY name ASC").all() as { id: number; name: string; email: string }[];
  return rows;
}

// --- Ref-based lookup ---

export function getDishByRef(ref: string): Dish | null {
  const match = ref.match(/^([A-Z0-9]+)-(\d+)$/);
  if (!match) return null;

  const [, shortCode, numStr] = match;
  const dishNumber = parseInt(numStr, 10);

  const db = getDb();
  const row = db.prepare(`
    SELECT d.*, c.company_name, c.subtitle, c.short_code
    FROM dishes d
    JOIN customers c ON d.customer_id = c.id
    WHERE c.short_code = ? AND d.dish_number = ?
  `).get(shortCode, dishNumber) as DishRow | undefined;

  return row ? rowToDish(row) : null;
}

// --- Full detail for agent API ---

export function getDishFullDetail(dishId: number): { dish: Dish; comments: DishComment[]; history: DishHistoryEntry[] } | null {
  const dish = getDishById(dishId);
  if (!dish) return null;

  return {
    dish,
    comments: getDishComments(dishId),
    history: getDishHistory(dishId),
  };
}

// --- Comments ---

export function getDishComments(dishId: number): DishComment[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM dish_comments WHERE dish_id = ? ORDER BY created_at DESC").all(dishId) as {
    id: number; dish_id: number; content: string; author_name: string; author_type: string; created_at: string;
  }[];
  return rows.map((r) => ({
    id: r.id,
    dishId: r.dish_id,
    content: r.content,
    authorName: r.author_name,
    authorType: r.author_type as AuthorType,
    createdAt: r.created_at,
  }));
}

export interface NewDishComment {
  dishId: number;
  content: string;
  authorName: string;
  authorType: AuthorType;
}

export function insertDishComment(data: NewDishComment): number {
  const db = getDb();
  const now = new Date().toISOString();
  const result = db.prepare(`
    INSERT INTO dish_comments (dish_id, content, author_name, author_type, created_at)
    VALUES (@dish_id, @content, @author_name, @author_type, @created_at)
  `).run({
    dish_id: data.dishId,
    content: data.content,
    author_name: data.authorName,
    author_type: data.authorType,
    created_at: now,
  });
  return Number(result.lastInsertRowid);
}

// --- History ---

export function getDishHistory(dishId: number): DishHistoryEntry[] {
  const db = getDb();
  const rows = db.prepare("SELECT * FROM dish_history WHERE dish_id = ? ORDER BY created_at DESC").all(dishId) as {
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

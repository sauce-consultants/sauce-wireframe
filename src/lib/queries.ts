import { initDb } from "./db";
import { computeHeat } from "./heat";
import type { Customer, BoardData, Stage, TShirtSize, JournalEntry, EntryType } from "@/components/the-pass/types";

interface CustomerRow {
  id: number;
  company_name: string;
  subtitle: string | null;
  stage: Stage;
  owner: string;
  size: string | null;
  last_activity: string;
  next_action: string | null;
  due_date: string | null;
  created_at: string;
  sort_order: number;
}

function rowToCustomer(row: CustomerRow): Customer {
  return {
    id: row.id,
    companyName: row.company_name,
    subtitle: row.subtitle,
    stage: row.stage,
    owner: row.owner,
    size: row.size as TShirtSize | null,
    lastActivity: row.last_activity,
    nextAction: row.next_action,
    dueDate: row.due_date,
    heat: computeHeat(row.last_activity),
    sortOrder: row.sort_order,
  };
}

export async function getCustomersByStage(): Promise<BoardData> {
  const db = await initDb();
  const result = await db.execute("SELECT * FROM customers ORDER BY sort_order ASC, id ASC");
  const rows = result.rows as unknown as CustomerRow[];

  const board: BoardData = {
    enquiry: [],
    reservation: [],
    seated: [],
    cleared: [],
    archived: [],
  };

  for (const row of rows) {
    const customer = rowToCustomer(row);
    board[customer.stage].push(customer);
  }

  return board;
}

export interface NewCustomer {
  companyName: string;
  subtitle?: string;
  stage: Stage;
  owner: string;
  size?: TShirtSize;
  nextAction?: string;
  dueDate?: string;
}

export async function insertCustomer(data: NewCustomer): Promise<number> {
  const db = await initDb();
  const now = new Date().toISOString();

  const result = await db.execute({
    sql: `
      INSERT INTO customers (company_name, subtitle, stage, owner, size, last_activity, next_action, due_date, created_at, sort_order)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
    `,
    args: [
      data.companyName,
      data.subtitle || null,
      data.stage,
      data.owner,
      data.size || null,
      now,
      data.nextAction || null,
      data.dueDate || null,
      now,
    ],
  });

  return Number(result.lastInsertRowid);
}

export interface UpdateCustomer {
  id: number;
  companyName: string;
  subtitle?: string;
  stage: Stage;
  owner: string;
  size?: TShirtSize;
  nextAction?: string;
  dueDate?: string;
}

export async function updateCustomer(data: UpdateCustomer): Promise<void> {
  const db = await initDb();
  const now = new Date().toISOString();

  await db.execute({
    sql: `
      UPDATE customers
      SET company_name = ?,
          subtitle = ?,
          stage = ?,
          owner = ?,
          size = ?,
          next_action = ?,
          due_date = ?,
          last_activity = ?
      WHERE id = ?
    `,
    args: [
      data.companyName,
      data.subtitle || null,
      data.stage,
      data.owner,
      data.size || null,
      data.nextAction || null,
      data.dueDate || null,
      now,
      data.id,
    ],
  });
}

// --- Journal Entries ---

interface JournalRow {
  id: number;
  customer_id: number;
  content: string;
  author: string;
  entry_type: string | null;
  created_at: string;
}

function rowToJournalEntry(row: JournalRow): JournalEntry {
  return {
    id: row.id,
    customerId: row.customer_id,
    content: row.content,
    author: row.author,
    entryType: row.entry_type as EntryType | null,
    createdAt: row.created_at,
  };
}

export async function getJournalEntries(customerId: number): Promise<JournalEntry[]> {
  const db = await initDb();
  const result = await db.execute({
    sql: "SELECT * FROM journal_entries WHERE customer_id = ? ORDER BY created_at DESC",
    args: [customerId],
  });
  const rows = result.rows as unknown as JournalRow[];
  return rows.map(rowToJournalEntry);
}

export interface NewJournalEntry {
  customerId: number;
  content: string;
  author: string;
  entryType?: EntryType;
}

export async function insertJournalEntry(data: NewJournalEntry): Promise<number> {
  const db = await initDb();
  const now = new Date().toISOString();

  const result = await db.execute({
    sql: `
      INSERT INTO journal_entries (customer_id, content, author, entry_type, created_at)
      VALUES (?, ?, ?, ?, ?)
    `,
    args: [
      data.customerId,
      data.content,
      data.author,
      data.entryType || null,
      now,
    ],
  });

  // Bump customer last_activity
  await db.execute({
    sql: "UPDATE customers SET last_activity = ? WHERE id = ?",
    args: [now, data.customerId],
  });

  return Number(result.lastInsertRowid);
}

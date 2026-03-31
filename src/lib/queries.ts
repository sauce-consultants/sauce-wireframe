import { getDb } from "./db";
import { computeHeat } from "./heat";
import type { Customer, BoardData, Stage, Owner, TShirtSize, JournalEntry, EntryType } from "@/components/the-pass/types";

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
    owner: row.owner as Customer["owner"],
    size: row.size as TShirtSize | null,
    lastActivity: row.last_activity,
    nextAction: row.next_action,
    dueDate: row.due_date,
    heat: computeHeat(row.last_activity),
    sortOrder: row.sort_order,
  };
}

export function getCustomersByStage(): BoardData {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM customers ORDER BY sort_order ASC, id ASC")
    .all() as CustomerRow[];

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
  owner: Owner;
  size?: TShirtSize;
  nextAction?: string;
  dueDate?: string;
}

export function insertCustomer(data: NewCustomer): number {
  const db = getDb();
  const now = new Date().toISOString();

  const result = db.prepare(`
    INSERT INTO customers (company_name, subtitle, stage, owner, size, last_activity, next_action, due_date, created_at, sort_order)
    VALUES (@company_name, @subtitle, @stage, @owner, @size, @last_activity, @next_action, @due_date, @created_at, 0)
  `).run({
    company_name: data.companyName,
    subtitle: data.subtitle || null,
    stage: data.stage,
    owner: data.owner,
    size: data.size || null,
    last_activity: now,
    next_action: data.nextAction || null,
    due_date: data.dueDate || null,
    created_at: now,
  });

  return Number(result.lastInsertRowid);
}

export interface UpdateCustomer {
  id: number;
  companyName: string;
  subtitle?: string;
  stage: Stage;
  owner: Owner;
  size?: TShirtSize;
  nextAction?: string;
  dueDate?: string;
}

export function updateCustomer(data: UpdateCustomer): void {
  const db = getDb();
  const now = new Date().toISOString();

  db.prepare(`
    UPDATE customers
    SET company_name = @company_name,
        subtitle = @subtitle,
        stage = @stage,
        owner = @owner,
        size = @size,
        next_action = @next_action,
        due_date = @due_date,
        last_activity = @last_activity
    WHERE id = @id
  `).run({
    id: data.id,
    company_name: data.companyName,
    subtitle: data.subtitle || null,
    stage: data.stage,
    owner: data.owner,
    size: data.size || null,
    next_action: data.nextAction || null,
    due_date: data.dueDate || null,
    last_activity: now,
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
    author: row.author as Owner,
    entryType: row.entry_type as EntryType | null,
    createdAt: row.created_at,
  };
}

export function getJournalEntries(customerId: number): JournalEntry[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM journal_entries WHERE customer_id = ? ORDER BY created_at DESC")
    .all(customerId) as JournalRow[];
  return rows.map(rowToJournalEntry);
}

export interface NewJournalEntry {
  customerId: number;
  content: string;
  author: Owner;
  entryType?: EntryType;
}

export function insertJournalEntry(data: NewJournalEntry): number {
  const db = getDb();
  const now = new Date().toISOString();

  const result = db.prepare(`
    INSERT INTO journal_entries (customer_id, content, author, entry_type, created_at)
    VALUES (@customer_id, @content, @author, @entry_type, @created_at)
  `).run({
    customer_id: data.customerId,
    content: data.content,
    author: data.author,
    entry_type: data.entryType || null,
    created_at: now,
  });

  // Bump customer last_activity
  db.prepare("UPDATE customers SET last_activity = ? WHERE id = ?").run(now, data.customerId);

  return Number(result.lastInsertRowid);
}

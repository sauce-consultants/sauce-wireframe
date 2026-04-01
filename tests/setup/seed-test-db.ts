import { createClient } from "@libsql/client";
import crypto from "crypto";

const TEST_DB_URL = "file:./data/test.db";

export async function seedTestDb() {
  const db = createClient({ url: TEST_DB_URL });

  // Drop all
  await db.execute("DROP TABLE IF EXISTS api_keys");
  await db.execute("DROP TABLE IF EXISTS users");
  await db.execute("DROP TABLE IF EXISTS dish_history");
  await db.execute("DROP TABLE IF EXISTS dish_comments");
  await db.execute("DROP TABLE IF EXISTS dishes");
  await db.execute("DROP TABLE IF EXISTS journal_entries");
  await db.execute("DROP TABLE IF EXISTS customers");

  // Create tables
  await db.execute(`CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT, company_name TEXT NOT NULL, subtitle TEXT,
    short_code TEXT UNIQUE, stage TEXT NOT NULL, owner TEXT NOT NULL,
    size TEXT, last_activity TEXT NOT NULL, next_action TEXT, due_date TEXT,
    created_at TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0
  )`);

  await db.execute(`CREATE TABLE journal_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER NOT NULL,
    content TEXT NOT NULL, author TEXT NOT NULL, entry_type TEXT, created_at TEXT NOT NULL
  )`);

  await db.execute(`CREATE TABLE dishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, body TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'backlog', customer_id INTEGER NOT NULL, dish_number INTEGER NOT NULL,
    assignee TEXT, agent TEXT, priority TEXT DEFAULT 'med', size TEXT, labels TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  )`);

  await db.execute(`CREATE TABLE dish_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT, dish_id INTEGER NOT NULL, content TEXT NOT NULL,
    author_name TEXT NOT NULL, author_type TEXT NOT NULL, created_at TEXT NOT NULL
  )`);

  await db.execute(`CREATE TABLE dish_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT, dish_id INTEGER NOT NULL, field TEXT NOT NULL,
    old_value TEXT, new_value TEXT, changed_by TEXT NOT NULL, changed_by_type TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`);

  await db.execute(`CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
    avatar_url TEXT, created_at TEXT NOT NULL
  )`);

  await db.execute(`CREATE TABLE api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT, key_hash TEXT UNIQUE NOT NULL, agent_name TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`);

  const now = new Date().toISOString();
  const recent = new Date(Date.now() - 3600000).toISOString(); // 1 hour ago
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 3600000).toISOString(); // 30 days ago

  // 3 projects
  await db.execute({ sql: "INSERT INTO customers (company_name, subtitle, short_code, stage, owner, size, last_activity, next_action, due_date, created_at, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args: ["TestCo", "Main Project", "TEST", "seated", "Test User", "M", recent, "Next step", "2026-04-01", now, 0] });
  await db.execute({ sql: "INSERT INTO customers (company_name, subtitle, short_code, stage, owner, size, last_activity, next_action, due_date, created_at, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args: ["AcmeCorp", "Platform", "ACM", "enquiry", "Test User", "L", now, "Send proposal", "2026-04-15", now, 0] });
  await db.execute({ sql: "INSERT INTO customers (company_name, subtitle, short_code, stage, owner, size, last_activity, next_action, due_date, created_at, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", args: ["EmptyCo", null, "EMP", "reservation", "Test User", "S", now, null, null, now, 0] });

  // 5 dishes (one per status) for TestCo (id=1)
  const statuses = ["backlog", "todo", "in_progress", "review", "done"];
  for (let i = 0; i < statuses.length; i++) {
    await db.execute({
      sql: "INSERT INTO dishes (title, body, status, customer_id, dish_number, assignee, agent, priority, size, labels, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [`Test dish ${i + 1}`, `## Description\n\nThis is test dish ${i + 1} in **${statuses[i]}** status.`, statuses[i], 1, i + 1, i < 3 ? "Test User" : null, i === 2 ? "test-agent" : null, i === 0 ? "high" : "med", "M", i === 0 ? "feature,test" : "", 0, now, now],
    });
  }

  // Old done dish (30 days ago) — should be excluded from board queries
  await db.execute({
    sql: "INSERT INTO dishes (title, body, status, customer_id, dish_number, assignee, agent, priority, size, labels, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    args: ["Old done dish", "## Description\n\nThis dish was completed 30 days ago.", "done", 1, 6, "Test User", null, "med", "M", "", 0, thirtyDaysAgo, thirtyDaysAgo],
  });

  // 1 comment on dish 1
  await db.execute({ sql: "INSERT INTO dish_comments (dish_id, content, author_name, author_type, created_at) VALUES (?, ?, ?, ?, ?)", args: [1, "This is a test comment", "test-agent", "agent", now] });

  // 1 history entry on dish 1
  await db.execute({ sql: "INSERT INTO dish_history (dish_id, field, old_value, new_value, changed_by, changed_by_type, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)", args: [1, "status", "backlog", "todo", "Test User", "human", now] });

  // 2 users
  await db.execute({ sql: "INSERT INTO users (email, name, avatar_url, created_at) VALUES (?, ?, NULL, ?)", args: ["test@wearesauce.io", "Test User", now] });
  await db.execute({ sql: "INSERT INTO users (email, name, avatar_url, created_at) VALUES (?, ?, NULL, ?)", args: ["other@wearesauce.io", "Other User", now] });

  // 1 API key: test-agent / sk_test_key_001
  const hash = crypto.createHash("sha256").update("sk_test_key_001").digest("hex");
  await db.execute({ sql: "INSERT INTO api_keys (key_hash, agent_name, created_at) VALUES (?, ?, ?)", args: [hash, "test-agent", now] });

  console.log("Test DB seeded.");
}

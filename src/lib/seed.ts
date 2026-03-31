/**
 * Seed script for Kitchen Planner.
 * Usage: npx tsx src/lib/seed.ts
 *
 * Uses TURSO_DATABASE_URL from .env.local (or defaults to local file).
 */

import { createClient } from "@libsql/client";
import crypto from "crypto";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const db = createClient({
  url: process.env.TURSO_DATABASE_URL || "file:./data/the-pass.db",
  authToken: process.env.TURSO_AUTH_TOKEN,
});

function daysAgo(days: number, hours = 0): string {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(d.getHours() - hours);
  return d.toISOString();
}

function futureDate(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

async function main() {
  console.log(`Database: ${process.env.TURSO_DATABASE_URL || "file:./data/the-pass.db"}`);

  // Drop all tables
  await db.execute("DROP TABLE IF EXISTS api_keys");
  await db.execute("DROP TABLE IF EXISTS users");
  await db.execute("DROP TABLE IF EXISTS dish_history");
  await db.execute("DROP TABLE IF EXISTS dish_comments");
  await db.execute("DROP TABLE IF EXISTS dishes");
  await db.execute("DROP TABLE IF EXISTS journal_entries");
  await db.execute("DROP TABLE IF EXISTS customers");

  // Create customers
  await db.execute(`CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT, company_name TEXT NOT NULL, subtitle TEXT,
    short_code TEXT UNIQUE, stage TEXT NOT NULL, owner TEXT NOT NULL,
    size TEXT, last_activity TEXT NOT NULL, next_action TEXT, due_date TEXT,
    created_at TEXT NOT NULL, sort_order INTEGER NOT NULL DEFAULT 0
  )`);

  const customers = [
    ["HireCo", "Customer Portal", "HIR", "enquiry", "Jim Wardlaw", "M", daysAgo(3), "Schedule discovery call with product team", futureDate(4), daysAgo(10), 0],
    ["Cool Run", "Delivery Market Place", "CRN", "enquiry", "Matt Weldon", "M", daysAgo(5), "Send capabilities deck and case studies", futureDate(2), daysAgo(8), 1],
    ["Flame Pro", "Asset Tracking", "FPR", "enquiry", "Luke Savory", "L", daysAgo(12), "Follow up on initial interest", futureDate(-2), daysAgo(18), 2],
    ["Ideal", "AI Consultation", "IAI", "enquiry", "Matt Weldon", "XS", daysAgo(2), "Prep AI readiness assessment framework", futureDate(5), daysAgo(6), 3],
    ["Global View Systems", "AI Consultation", "GVS", "enquiry", "Matt Weldon", "XS", daysAgo(8), "Arrange intro meeting with CTO", futureDate(7), daysAgo(14), 4],
    ["Parallel", "AI Consultation", "PAR", "enquiry", "John Polling", "XS", daysAgo(15), "Reconnect after their board review", futureDate(10), daysAgo(22), 5],
    ["TeeFree", "Golf App", "TEE", "enquiry", "Matt Gibson", "S", daysAgo(6), "Review competitor analysis and prep proposal", futureDate(8), daysAgo(9), 6],
    ["PE Pro", "Customer Platform", "PEP", "enquiry", "John Polling", "S", daysAgo(4), "Send technical questionnaire", futureDate(3), daysAgo(7), 7],
    ["Diony", "eCommerce ChatBot", "DIO", "enquiry", "Luke Savory", "S", daysAgo(1), "Demo chatbot capabilities to their marketing team", futureDate(6), daysAgo(4), 8],
    ["Greggs", "Tray Asset Tracking", "GRG", "enquiry", "Jim Wardlaw", "XL", daysAgo(7), "Site visit to assess tracking requirements", futureDate(12), daysAgo(11), 9],
    ["GXO", "Activity Tracker", "GAT", "reservation", "John Polling", "L", daysAgo(1), "Finalise SOW and commercial terms", futureDate(5), daysAgo(30), 0],
    ["Ideal", "Evo Max", "EVO", "reservation", "Aidan Treasure", "XL", daysAgo(2), "Technical architecture review session", futureDate(3), daysAgo(20), 1],
    ["Coyle Wellbeing", "Unified Gym App", "CWB", "reservation", "Jim Wardlaw", "M", daysAgo(4), "Present wireframes to stakeholder group", futureDate(7), daysAgo(15), 2],
    ["GXO", "Driver Debrief", "GDD", "reservation", "Jim Wardlaw", "L", daysAgo(0, 5), "Sign off sprint 1 scope with ops manager", futureDate(1), daysAgo(25), 3],
    ["Ideal", "IoT Platform", "IOT", "seated", "Aidan Treasure", "XL", daysAgo(0, 4), "Sprint 3 review with platform team", futureDate(2), daysAgo(80), 0],
    ["GigLab", "Platform", "GIG", "seated", "John Polling", "L", daysAgo(0, 2), "Sprint 6 demo to product owner", futureDate(2), daysAgo(90), 1],
    ["Rix", "AI Consultation", "RIX", "seated", "John Polling", "XS", daysAgo(1), "Deliver AI strategy recommendations report", futureDate(4), daysAgo(45), 2],
    ["Punchy", "Messaging ChatBot", "PUN", "seated", "Luke Savory", "S", daysAgo(0, 6), "UAT testing with customer support team", futureDate(3), daysAgo(60), 3],
    ["Hurst", "Transport Management", "HUR", "seated", "John Polling", "L", daysAgo(2), "Integrate with their existing TMS API", futureDate(8), daysAgo(75), 4],
  ];

  for (const c of customers) {
    await db.execute({
      sql: "INSERT INTO customers (company_name, subtitle, short_code, stage, owner, size, last_activity, next_action, due_date, created_at, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: c,
    });
  }
  console.log(`Seeded ${customers.length} customers`);

  // Create empty tables
  await db.execute(`CREATE TABLE IF NOT EXISTS journal_entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT, customer_id INTEGER NOT NULL, content TEXT NOT NULL,
    author TEXT NOT NULL, entry_type TEXT, created_at TEXT NOT NULL
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS dishes (
    id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT NOT NULL, body TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'backlog', customer_id INTEGER NOT NULL, dish_number INTEGER NOT NULL,
    assignee TEXT, agent TEXT, priority TEXT DEFAULT 'med', size TEXT, labels TEXT DEFAULT '',
    sort_order INTEGER DEFAULT 0, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS dish_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT, dish_id INTEGER NOT NULL, content TEXT NOT NULL,
    author_name TEXT NOT NULL, author_type TEXT NOT NULL, created_at TEXT NOT NULL
  )`);

  await db.execute(`CREATE TABLE IF NOT EXISTS dish_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT, dish_id INTEGER NOT NULL, field TEXT NOT NULL,
    old_value TEXT, new_value TEXT, changed_by TEXT NOT NULL, changed_by_type TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`);

  // Users
  await db.execute(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT, email TEXT UNIQUE NOT NULL, name TEXT NOT NULL,
    avatar_url TEXT, created_at TEXT NOT NULL
  )`);

  const now = new Date().toISOString();
  const users = [
    ["matt.weldon@wearesauce.io", "Matt Weldon"],
    ["john.polling@wearesauce.io", "John Polling"],
    ["matt.gibson@wearesauce.io", "Matt Gibson"],
    ["jim.wardlaw@wearesauce.io", "Jim Wardlaw"],
    ["aidan.treasure@wearesauce.io", "Aidan Treasure"],
    ["rob.marsh@wearesauce.io", "Rob Marsh"],
    ["james.hay@wearesauce.io", "James Hay"],
    ["xing.xing@wearesauce.io", "Xing Xing"],
    ["sam.osborne@wearesauce.io", "Sam Osborne"],
    ["sam.mearns@wearesauce.io", "Sam Mearns"],
    ["luke.savory@wearesauce.io", "Luke Savory"],
    ["emma.elkan@wearesauce.io", "Emma Elkan"],
    ["mel.brooker@wearesauce.io", "Mel Brooker"],
  ];

  for (const [email, name] of users) {
    await db.execute({ sql: "INSERT INTO users (email, name, avatar_url, created_at) VALUES (?, ?, NULL, ?)", args: [email, name, now] });
  }
  console.log(`Seeded ${users.length} users`);

  // API Keys
  await db.execute(`CREATE TABLE IF NOT EXISTS api_keys (
    id INTEGER PRIMARY KEY AUTOINCREMENT, key_hash TEXT UNIQUE NOT NULL, agent_name TEXT NOT NULL, created_at TEXT NOT NULL
  )`);

  const devKeys = [
    { name: "ux-designer", key: "sk_ux_designer_dev_key_001" },
    { name: "backend-dev", key: "sk_backend_dev_dev_key_001" },
    { name: "frontend-dev", key: "sk_frontend_dev_dev_key_001" },
    { name: "qa-tester", key: "sk_qa_tester_dev_key_001" },
    { name: "tech-lead", key: "sk_tech_lead_dev_key_001" },
  ];

  for (const dk of devKeys) {
    const hash = crypto.createHash("sha256").update(dk.key).digest("hex");
    await db.execute({ sql: "INSERT INTO api_keys (key_hash, agent_name, created_at) VALUES (?, ?, ?)", args: [hash, dk.name, now] });
  }
  console.log(`Seeded ${devKeys.length} API keys`);
  for (const dk of devKeys) console.log(`  ${dk.name}: ${dk.key}`);

  console.log("Done.");
}

main().catch((err) => { console.error(err); process.exit(1); });

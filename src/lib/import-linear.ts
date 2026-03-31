/**
 * Import HireCo tickets from Linear into Kitchen Planner dishes.
 *
 * Usage: source .env.local && npx tsx src/lib/import-linear.ts
 */

import { createClient } from "@libsql/client";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });
const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const HIRECO_TEAM_ID = "def24f33-22bf-4271-92de-5f2a110aa084";
const HIRECO_CUSTOMER_ID = 1; // HireCo in our DB

if (!LINEAR_API_KEY) {
  console.error("LINEAR_API_KEY is required. Run: source .env.local && npx tsx src/lib/import-linear.ts");
  process.exit(1);
}

// --- Fetch from Linear ---

interface LinearIssue {
  identifier: string;
  title: string;
  description: string | null;
  state: { name: string };
  priority: number;
  priorityLabel: string;
  assignee: { name: string } | null;
  labels: { nodes: { name: string }[] };
  estimate: number | null;
  createdAt: string;
  updatedAt: string;
}

async function fetchIssues(): Promise<LinearIssue[]> {
  const res = await fetch("https://api.linear.app/graphql", {
    method: "POST",
    headers: {
      Authorization: LINEAR_API_KEY!,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query: `{
        team(id: "${HIRECO_TEAM_ID}") {
          issues(first: 200, orderBy: createdAt) {
            nodes {
              identifier title description
              state { name }
              priority priorityLabel
              assignee { name }
              labels { nodes { name } }
              estimate
              createdAt updatedAt
            }
          }
        }
      }`,
    }),
  });

  const data = await res.json();
  return data.data.team.issues.nodes;
}

// --- Map Linear state to Kitchen Planner status ---

function mapStatus(linearState: string): string {
  switch (linearState.toLowerCase()) {
    case "backlog": return "backlog";
    case "todo":
    case "ready": return "todo";
    case "in progress": return "in_progress";
    case "qa":
    case "in review": return "review";
    case "done":
    case "canceled":
    case "cancelled":
    case "duplicate": return "done";
    default: return "backlog";
  }
}

// --- Map Linear priority to Kitchen Planner priority ---

function mapPriority(linearPriority: number): string {
  // Linear: 0=none, 1=urgent, 2=high, 3=medium, 4=low
  if (linearPriority <= 1) return "high";
  if (linearPriority <= 2) return "high";
  if (linearPriority <= 3) return "med";
  return "low";
}

// --- Map Linear estimate to t-shirt size ---

function mapSize(estimate: number | null): string | null {
  if (!estimate) return null;
  if (estimate <= 1) return "XS";
  if (estimate <= 2) return "S";
  if (estimate <= 3) return "M";
  if (estimate <= 5) return "L";
  return "XL";
}

// --- Import ---

async function main() {
  console.log("Fetching HireCo issues from Linear...");
  const issues = await fetchIssues();
  console.log(`Found ${issues.length} issues`);

  const db = createClient({
    url: process.env.TURSO_DATABASE_URL || "file:./data/the-pass.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  const maxResult = await db.execute({ sql: "SELECT COALESCE(MAX(dish_number), 0) as max_num FROM dishes WHERE customer_id = ?", args: [HIRECO_CUSTOMER_ID] });
  let dishNumber = Number(maxResult.rows[0].max_num);

  let imported = 0;
  for (const issue of issues) {
    dishNumber++;

    const labels = issue.labels.nodes.map((l) => l.name).join(",");
    const status = mapStatus(issue.state.name);
    const priority = mapPriority(issue.priority);
    const size = mapSize(issue.estimate);

    const bodyHeader = `> Imported from Linear: ${issue.identifier}\n\n`;
    const body = bodyHeader + (issue.description || "");

    await db.execute({
      sql: "INSERT INTO dishes (title, body, status, customer_id, dish_number, assignee, agent, priority, size, labels, sort_order, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      args: [issue.title, body, status, HIRECO_CUSTOMER_ID, dishNumber, issue.assignee?.name || null, null, priority, size, labels, 0, issue.createdAt, issue.updatedAt],
    });

    imported++;
  }

  console.log(`Imported ${imported} dishes into HireCo (customer_id=${HIRECO_CUSTOMER_ID})`);
  console.log(`Dish numbers: HIR-${String(Number(maxResult.rows[0].max_num) + 1).padStart(4, "0")} to HIR-${String(dishNumber).padStart(4, "0")}`);

  const summary = await db.execute({ sql: "SELECT status, COUNT(*) as count FROM dishes WHERE customer_id = ? GROUP BY status ORDER BY count DESC", args: [HIRECO_CUSTOMER_ID] });
  console.log("\nBy status:");
  for (const row of summary.rows) {
    console.log(`  ${row.status}: ${row.count}`);
  }
}

main().catch((err) => {
  console.error("Import failed:", err);
  process.exit(1);
});

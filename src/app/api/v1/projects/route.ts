import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const agent = validateApiKey(request.headers.get("authorization"));
  if (!agent) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  const db = getDb();
  const rows = db.prepare(`
    SELECT id, company_name, subtitle, short_code, stage, owner, size
    FROM customers
    ORDER BY company_name ASC
  `).all() as {
    id: number; company_name: string; subtitle: string | null;
    short_code: string | null; stage: string; owner: string; size: string | null;
  }[];

  const projects = rows.map((r) => ({
    id: r.id,
    name: r.company_name,
    subtitle: r.subtitle,
    shortCode: r.short_code,
    stage: r.stage,
    owner: r.owner,
    size: r.size,
  }));

  return NextResponse.json({ projects, count: projects.length });
}

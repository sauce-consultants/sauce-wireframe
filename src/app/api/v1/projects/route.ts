import { NextRequest, NextResponse } from "next/server";
import { validateApiKey } from "@/lib/api-auth";
import { initDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const agent = await validateApiKey(request.headers.get("authorization"));
  if (!agent) {
    return NextResponse.json({ error: "Invalid or missing API key" }, { status: 401 });
  }

  const db = await initDb();
  const result = await db.execute("SELECT id, company_name, subtitle, short_code, stage, owner, size FROM customers ORDER BY company_name ASC");

  const projects = result.rows.map((r) => ({
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

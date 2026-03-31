import crypto from "crypto";
import { initDb } from "./db";

interface AgentIdentity {
  agentName: string;
}

export async function validateApiKey(authHeader: string | null): Promise<AgentIdentity | null> {
  if (!authHeader?.startsWith("Bearer ")) return null;

  const key = authHeader.slice(7);
  if (!key) return null;

  const hash = crypto.createHash("sha256").update(key).digest("hex");
  const db = await initDb();

  const result = await db.execute({ sql: "SELECT agent_name FROM api_keys WHERE key_hash = ?", args: [hash] });
  const row = result.rows[0] as unknown as { agent_name: string } | undefined;

  return row ? { agentName: row.agent_name } : null;
}

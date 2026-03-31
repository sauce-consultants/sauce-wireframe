import crypto from "crypto";
import { getDb } from "./db";

interface AgentIdentity {
  agentName: string;
}

export function validateApiKey(authHeader: string | null): AgentIdentity | null {
  if (!authHeader?.startsWith("Bearer ")) return null;

  const key = authHeader.slice(7);
  if (!key) return null;

  const hash = crypto.createHash("sha256").update(key).digest("hex");
  const db = getDb();

  const row = db.prepare("SELECT agent_name FROM api_keys WHERE key_hash = ?").get(hash) as { agent_name: string } | undefined;

  return row ? { agentName: row.agent_name } : null;
}

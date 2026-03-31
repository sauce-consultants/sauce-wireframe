import type { Heat } from "@/components/the-pass/types";

export function computeHeat(lastActivity: string): Heat {
  const now = Date.now();
  const then = new Date(lastActivity).getTime();
  const hoursAgo = (now - then) / (1000 * 60 * 60);

  if (hoursAgo < 24) return "hot";
  if (hoursAgo < 72) return "warm";
  if (hoursAgo < 168) return "cool";
  return "cold";
}

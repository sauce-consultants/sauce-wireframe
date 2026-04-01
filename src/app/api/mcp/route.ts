import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { validateApiKey } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

function createServer(apiKey: string) {
  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.KP_BASE_URL || "http://localhost:3000";

  async function api(method: string, path: string, body?: unknown): Promise<unknown> {
    const url = `${baseUrl.replace(/\/$/, "")}/api/v1${path}`;
    const res = await fetch(url, {
      method,
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `API error: ${res.status}`);
    return data;
  }

  const server = new McpServer({
    name: "kitchen-planner",
    version: "1.0.0",
  });

  server.tool(
    "list_projects",
    "List all projects (tables) with their short codes, stages, and owners",
    {},
    async () => {
      const data = await api("GET", "/projects");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "list_dishes",
    "List dishes (tickets) with optional filters. Returns full data including markdown body, comments, and history.",
    {
      project: z.string().optional().describe("Project short code to filter by (e.g. 'GIG'). Comma-separated for multiple."),
      status: z.string().optional().describe("Filter by status. Comma-separated. Values: backlog, todo, in_progress, review, done"),
      assignee: z.string().optional().describe("Filter by assignee name"),
      agent: z.string().optional().describe("Filter by agent name"),
    },
    async ({ project, status, assignee, agent }) => {
      const params = new URLSearchParams();
      if (project) params.set("project", project);
      if (status) params.set("status", status);
      if (assignee) params.set("assignee", assignee);
      if (agent) params.set("agent", agent);
      const query = params.toString();
      const data = await api("GET", `/dishes${query ? `?${query}` : ""}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "read_dish",
    "Read a single dish by reference (e.g. GIG-0001). Returns full detail including markdown body, comments, and change history.",
    {
      ref: z.string().describe("Dish reference (e.g. 'GIG-0001')"),
    },
    async ({ ref }) => {
      const data = await api("GET", `/dishes/${ref.toUpperCase()}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "update_dish",
    "Update fields on a dish. Only include the fields you want to change. Status changes, assignee changes, etc. are all tracked in history automatically.",
    {
      ref: z.string().describe("Dish reference (e.g. 'GIG-0001')"),
      title: z.string().optional().describe("New title"),
      body: z.string().optional().describe("New markdown body content"),
      status: z.enum(["backlog", "todo", "in_progress", "review", "done"]).optional().describe("New status"),
      assignee: z.string().optional().describe("Assignee name (or empty string to unassign)"),
      agent: z.string().optional().describe("Agent name (or empty string to unassign)"),
      priority: z.enum(["high", "med", "low"]).optional().describe("Priority level"),
      size: z.enum(["XS", "S", "M", "L", "XL"]).optional().describe("T-shirt size estimate"),
      labels: z.string().optional().describe("Comma-separated labels (e.g. 'bug,frontend')"),
    },
    async ({ ref, ...fields }) => {
      const body: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) body[key] = value;
      }
      const data = await api("PATCH", `/dishes/${ref.toUpperCase()}`, body);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "add_comment",
    "Add a comment to a dish. The author is automatically set from your API key identity. Supports markdown.",
    {
      ref: z.string().describe("Dish reference (e.g. 'GIG-0001')"),
      content: z.string().describe("Comment content (markdown supported)"),
    },
    async ({ ref, content }) => {
      const data = await api("POST", `/dishes/${ref.toUpperCase()}/comments`, { content });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "claim_dish",
    "Claim a dish — sets the agent field to your identity. Use this when you start working on a ticket.",
    {
      ref: z.string().describe("Dish reference (e.g. 'GIG-0001')"),
    },
    async ({ ref }) => {
      const data = await api("POST", `/dishes/${ref.toUpperCase()}/claim`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  return server;
}

async function handleRequest(req: Request): Promise<Response> {
  // Extract API key from Authorization header
  const authHeader = req.headers.get("authorization");
  const apiKey = authHeader?.replace(/^Bearer\s+/i, "");

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "Missing Authorization header. Pass your KP_API_KEY as Bearer token." }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const agent = await validateApiKey(authHeader);
  if (!agent) {
    return new Response(JSON.stringify({ error: "Invalid API key" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const server = createServer(apiKey);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
    enableJsonResponse: true,
  });

  await server.connect(transport);
  const response = await transport.handleRequest(req);
  return response;
}

export async function GET(req: Request) {
  return handleRequest(req);
}

export async function POST(req: Request) {
  return handleRequest(req);
}

export async function DELETE(req: Request) {
  return handleRequest(req);
}

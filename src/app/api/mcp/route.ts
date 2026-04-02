import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { z } from "zod";
import { validateApiKey } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

const CORS_HEADERS: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept",
};

function createServer(apiKey: string, requestUrl: string) {
  const origin = new URL(requestUrl).origin;
  const baseUrl = origin || process.env.KP_BASE_URL || "http://localhost:3000";

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
    name: "sauce-kitchen",
    version: "1.0.0",
  });

  server.tool(
    "list_projects",
    "List all projects with their short codes, stages, and owners.",
    {},
    async () => {
      const data = await api("GET", "/projects");
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "list_tickets",
    "List tickets with optional filters. Returns full data including markdown body, comments, and history.",
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
    "read_ticket",
    "Read a single ticket by reference (e.g. GIG-0001). Returns full detail including markdown body, comments, and change history.",
    {
      ref: z.string().describe("Ticket reference (e.g. 'GIG-0001')"),
    },
    async ({ ref }) => {
      const data = await api("GET", `/dishes/${ref.toUpperCase()}`);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "create_ticket",
    "Create a new ticket. Returns the created ticket with its assigned reference.",
    {
      title: z.string().describe("Ticket title"),
      project: z.string().describe("Project short code (e.g. 'GIG')"),
      body: z.string().optional().describe("Markdown body content"),
      status: z.enum(["backlog", "todo", "in_progress", "review", "done"]).optional().describe("Initial status (default: backlog)"),
      assignee: z.string().optional().describe("Assignee name"),
      agent: z.string().optional().describe("Agent name"),
      priority: z.enum(["high", "med", "low"]).optional().describe("Priority level (default: med)"),
      size: z.enum(["XS", "S", "M", "L", "XL"]).optional().describe("T-shirt size estimate"),
      labels: z.string().optional().describe("Comma-separated labels (e.g. 'bug,frontend')"),
    },
    async (fields) => {
      const data = await api("POST", "/dishes", fields);
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "update_ticket",
    "Update fields on a ticket. Only include the fields you want to change. Changes are tracked in history automatically.",
    {
      ref: z.string().describe("Ticket reference (e.g. 'GIG-0001')"),
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
    "add_ticket_comment",
    "Add a comment to a ticket. The author is automatically set from your API key identity. Supports markdown.",
    {
      ref: z.string().describe("Ticket reference (e.g. 'GIG-0001')"),
      content: z.string().describe("Comment content (markdown supported)"),
    },
    async ({ ref, content }) => {
      const data = await api("POST", `/dishes/${ref.toUpperCase()}/comments`, { content });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "edit_ticket_comment",
    "Edit one of your own comments on a ticket. You can only edit comments you authored.",
    {
      ref: z.string().describe("Ticket reference (e.g. 'GIG-0001')"),
      commentId: z.number().describe("ID of the comment to edit"),
      content: z.string().describe("New comment content (markdown supported)"),
    },
    async ({ ref, commentId, content }) => {
      const data = await api("PATCH", `/dishes/${ref.toUpperCase()}/comments`, { commentId, content });
      return { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] };
    }
  );

  server.tool(
    "claim_ticket",
    "Claim a ticket — sets the agent field to your identity. Use this when you start working on a ticket.",
    {
      ref: z.string().describe("Ticket reference (e.g. 'GIG-0001')"),
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
    return new Response(JSON.stringify({ error: "Missing Authorization header. Pass your API key as Bearer token." }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }

  const agent = await validateApiKey(authHeader);
  if (!agent) {
    return new Response(JSON.stringify({ error: "Invalid API key" }), {
      status: 401,
      headers: { "Content-Type": "application/json", ...CORS_HEADERS },
    });
  }

  const server = createServer(apiKey, req.url);
  const transport = new WebStandardStreamableHTTPServerTransport({
    sessionIdGenerator: undefined, // stateless
    enableJsonResponse: true,
  });

  await server.connect(transport);
  const response = await transport.handleRequest(req);

  // Append CORS headers to the transport response
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    headers.set(key, value);
  }
  return new Response(response.body, { status: response.status, headers });
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
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

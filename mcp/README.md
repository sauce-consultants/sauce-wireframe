# Sauce Kitchen MCP Server

MCP tool server for Claude Code agents to manage project tickets.

## Tools

| Tool | Description |
|------|-------------|
| `list_projects` | List all projects with short codes, stages, and owners |
| `list_tickets` | List tickets with optional filters (project, status, assignee, agent) |
| `read_ticket` | Read a single ticket by reference (e.g. GIG-0001) |
| `create_ticket` | Create a new ticket with title, project, body, status, priority, etc. |
| `update_ticket` | Update fields on a ticket (partial updates, changes tracked in history) |
| `add_ticket_comment` | Add a markdown comment to a ticket |
| `claim_ticket` | Claim a ticket — sets the agent field to your identity |

## Hosted (recommended)

The MCP server is hosted at `https://sauce-wireframe.vercel.app/api/mcp`. No local files needed.

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "sauce-kitchen": {
      "type": "streamable-http",
      "url": "https://sauce-wireframe.vercel.app/api/mcp",
      "headers": {
        "Authorization": "Bearer your-api-key-here"
      }
    }
  }
}
```

## Local (stdio)

If you prefer to run the MCP server locally:

```json
{
  "mcpServers": {
    "sauce-kitchen": {
      "command": "npx",
      "args": ["tsx", "mcp/kitchen-planner.ts"],
      "env": {
        "KP_API_KEY": "your-api-key-here",
        "KP_BASE_URL": "https://sauce-wireframe.vercel.app"
      }
    }
  }
}
```

For local development, set `KP_BASE_URL` to `http://localhost:3000`.

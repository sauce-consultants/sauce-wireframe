# Kitchen Planner MCP Server

MCP tool server for Claude Code agents to interact with Kitchen Planner dishes (tickets).

## Hosted (recommended)

The MCP server is hosted at `https://sauce-wireframe.vercel.app/api/mcp`. No local files needed.

Add to your project's `.mcp.json`:

```json
{
  "mcpServers": {
    "kitchen-planner": {
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
    "kitchen-planner": {
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

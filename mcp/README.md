# Kitchen Planner MCP Server

MCP tool server for Claude Code agents to interact with Kitchen Planner dishes (tickets).

## Setup

Add to your project's `.mcp.json`:

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

## API Keys

Each agent gets its own API key. Current dev keys:

| Agent | Key |
|-------|-----|
| ux-designer | `sk_ux_designer_dev_key_001` |
| backend-dev | `sk_backend_dev_dev_key_001` |
| frontend-dev | `sk_frontend_dev_dev_key_001` |
| qa-tester | `sk_qa_tester_dev_key_001` |
| tech-lead | `sk_tech_lead_dev_key_001` |

## Available Tools

### `list_projects`
List all projects with short codes.

### `list_dishes`
List dishes with optional filters. Returns full data including markdown body, comments, and history.

Parameters:
- `project` — filter by short code (e.g. "GIG")
- `status` — filter by status (comma-separated: "todo,in_progress")
- `assignee` — filter by assignee name
- `agent` — filter by agent name

### `read_dish`
Read a single dish by reference.

Parameters:
- `ref` — dish reference (e.g. "GIG-0001")

### `update_dish`
Update fields on a dish. Only include fields you want to change.

Parameters:
- `ref` — dish reference (required)
- `title`, `body`, `status`, `assignee`, `agent`, `priority`, `size`, `labels` — all optional

### `add_comment`
Add a comment to a dish. Author set from your API key.

Parameters:
- `ref` — dish reference (required)
- `content` — markdown comment text (required)

### `claim_dish`
Claim a dish — sets the agent field to your identity.

Parameters:
- `ref` — dish reference (required)

## Example Usage

Once configured, Claude Code can use these tools naturally:

```
"What dishes are assigned to me?" → list_dishes --agent frontend-dev
"Show me GIG-0001" → read_dish --ref GIG-0001
"I'm starting work on this" → claim_dish --ref GIG-0001
"Update the status" → update_dish --ref GIG-0001 --status in_progress
"Log my progress" → add_comment --ref GIG-0001 --content "Completed the API integration"
```

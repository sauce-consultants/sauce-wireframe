# Sauce Kitchen

A wireframe-styled internal tooling demo built on a 41-component UI library. Kitchen Planner is the reference application -- a sales pipeline and ticket tracker designed for AI agent collaboration via MCP.

## What is this?

Sauce Kitchen started as a component toolkit for rapid customer prototyping sessions. The wireframe aesthetic is intentional: heavy black borders, square edges, monochrome palette, bold typography, and offset solid shadows.

On top of that foundation sits **Kitchen Planner** -- internal tooling for Sauce Consultants with two boards, a REST API, and an MCP server that lets Claude Code agents read and update tickets directly.

## Tech stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS v4** with custom theme tokens
- **Turso** (hosted LibSQL) for persistence
- **NextAuth v5** (Google OAuth)
- **@dnd-kit** for drag-and-drop
- **MCP SDK** for agent tool integration
- **Playwright** for API and browser tests
- **Lucide React** icons
- **Raleway** (headings) + **Space Mono** (numeric data)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) for the Kitchen Planner home page, or [http://localhost:3000/dev](http://localhost:3000/dev) for the component showcase.

### Environment variables

For production (Turso):

```
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
```

Local development uses a file-based SQLite database at `./data/the-pass.db` by default.

## Kitchen Planner

### The Pass (Sales Pipeline)

A 5-stage kanban board using a restaurant metaphor:

**At the door** > **Reservation** > **Seated** > **Cleared** > **Left the building**

- Drag-and-drop cards between stages
- Heat indicators and project sizing
- Journal entries per project (notes, updates, meetings, calls, emails)

### The Kitchen (Ticket Tracker)

Per-project ticket management with 5 statuses:

**Backlog** > **To Do** > **In Progress** > **Review** > **Done**

- Markdown content with rendered preview
- T-shirt sizing (XS--XL) and priority levels
- Human and agent comments
- Automatic field-level change history
- Unique references: `PROJECT_CODE-DISH_NUMBER` (e.g. `GIG-0001`)
- Agent assignment and claim functionality

## MCP server

An MCP server at `mcp/kitchen-planner.ts` exposes six tools for Claude Code agents:

| Tool | Description |
|------|-------------|
| `list_projects` | List all projects with codes, stages, owners |
| `list_dishes` | List tickets with filters (project, status, assignee, agent) |
| `read_dish` | Read a single dish by reference |
| `update_dish` | Update ticket fields (title, body, status, priority, size, etc.) |
| `add_comment` | Add a markdown comment to a dish |
| `claim_dish` | Set the agent field to the claimant's identity |

### Agent setup

Add to your Claude Code MCP config:

```json
{
  "mcpServers": {
    "kitchen-planner": {
      "command": "npx",
      "args": ["tsx", "mcp/kitchen-planner.ts"],
      "env": {
        "KP_API_KEY": "your-key-here",
        "KP_BASE_URL": "https://sauce-wireframe.vercel.app"
      }
    }
  }
}
```

Five agent roles are pre-configured with API keys (listed on the home page): ux-designer, backend-dev, frontend-dev, qa-tester, tech-lead.

## API

All agent-facing endpoints are under `/api/v1/` and require a Bearer token.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/projects` | List all projects |
| GET | `/api/v1/dishes` | List dishes (filterable) |
| GET | `/api/v1/dishes/:ref` | Get dish by reference |
| PATCH | `/api/v1/dishes/:ref` | Update dish fields |
| POST | `/api/v1/dishes/:ref/comments` | Add comment |
| POST | `/api/v1/dishes/:ref/claim` | Claim dish |

Frontend routes use separate unauthenticated endpoints under `/api/the-pass` and `/api/the-kitchen`.

## Testing

```bash
npm test              # All 31 tests (API + browser)
npm run test:api      # API tests only
npm run test:browser  # Browser tests only
```

Tests use a seeded test database with 3 projects, 5 dishes, comments, history, users, and API keys.

## Dev showcase

The `/dev` routes are the living reference for the component library:

| Route | Content |
|-------|---------|
| `/dev` | Overview and navigation |
| `/dev/brand` | Colour palette, typography, icons, spacing, borders, shadows |
| `/dev/components` | 41 components with variants, states, and interactive demos |
| `/dev/layouts` | 3 shell patterns + 5 content area layouts |
| `/dev/pages` | 7 page templates with mock data |

## Component library

41 components across 5 categories:

- **Core Inputs (12):** Button, Icon Button, Input, Textarea, Select, Combobox, Checkbox, Radio Group, Toggle, Slider, Date Picker, File Upload
- **Data Display (9):** Badge, Table, Card, Accordion, Avatar, Tooltip, Stat Card, Timeline, Empty State
- **Feedback & Overlays (7):** Spinner, Skeleton, Modal, Slide Panel, Toast, Alert, Progress Bar
- **Layout & Navigation (7):** Header, Sidebar, Breadcrumbs, Tabs, Pagination, Stepper, Footer
- **Composite Patterns (5):** Command Palette, Dropdown Menu, Context Menu, Form, Search

## Design tokens

All visual decisions are encoded in `src/app/globals.css` as CSS custom properties wired into Tailwind v4's `@theme` block:

- Semantic colour tokens (black, white, 3 greys, accent blue, danger/warning/success)
- Border scale (2px muted, 4px default, 8px heavy)
- Offset solid shadows (sm/md/lg)
- Z-index scale (sticky, dropdown, overlay, backdrop, modal, toast, command)
- Typography (Raleway 400/600/800/900, Space Mono 400/700)

## Built with

This project follows the [Sauce UI Guidelines](https://github.com/sauce-consultants/component-guidelines) specification library.

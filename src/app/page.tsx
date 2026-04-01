"use client";

import Link from "next/link";
import { Card, CardHeader, CardBody, Badge } from "@/components/ui";
import { KitchenHeader } from "@/components/kitchen-planner/KitchenHeader";
import { Providers } from "@/components/kitchen-planner/Providers";
import { Utensils, ChefHat, Bot, Palette, ArrowRight } from "lucide-react";

const sections = [
  {
    href: "/the-pass",
    icon: <Utensils size={24} />,
    title: "The Pass",
    subtitle: "Sales Pipeline Board",
    description: "Kanban board tracking projects through the sales pipeline using a restaurant metaphor. Five stages from 'At the door' (enquiry) to 'Left the building' (archived). Drag cards between columns, add journal entries, track heat indicators.",
    features: ["5-stage pipeline", "Drag and drop", "Heat indicators", "Journal entries", "Project CRUD"],
  },
  {
    href: "/the-kitchen",
    icon: <ChefHat size={24} />,
    title: "The Kitchen",
    subtitle: "Dish (Ticket) Tracking",
    description: "Ticket management with markdown content, per-project filtering, comments from humans and AI agents, and automatic field-level change history. Each ticket (dish) belongs to a project (table) and has a unique reference like GIG-0001.",
    features: ["Markdown tickets", "Comments (human + agent)", "Change history", "Project filtering", "Drag and drop", "T-shirt sizing"],
  },
  {
    href: "#mcp",
    icon: <Bot size={24} />,
    title: "MCP Server",
    subtitle: "Agent Integration",
    description: "Model Context Protocol server for Claude Code agents. Agents can list projects, create and read tickets, update status, add comments, and claim tickets through native tool calls. Authenticated via per-agent API keys.",
    features: ["list_projects", "list_tickets", "read_ticket", "create_ticket", "update_ticket", "add_ticket_comment", "claim_ticket"],
  },
  {
    href: "/dev",
    icon: <Palette size={24} />,
    title: "Dev Showcase",
    subtitle: "Component Library",
    description: "Living reference for the wireframe component toolkit. 41 components across 5 categories, 8 layout patterns, and 7 page templates — all with interactive demos.",
    features: ["41 components", "8 layouts", "7 page templates", "Brand reference"],
  },
];

export default function Home() {
  return (
    <Providers>
      <KitchenHeader />
      <main className="p-6 sm:p-8 lg:p-12">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-black mb-2">Sauce Kitchen</h1>
          <p className="text-lg text-text-muted">
            Internal tooling for Sauce Consultants. Pipeline management, ticket tracking, and AI agent integration.
          </p>
        </div>

        {/* Section cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {sections.map((section) => (
            <Link key={section.title} href={section.href}>
              <Card interactive className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <span className="text-text-muted">{section.icon}</span>
                    <div>
                      <h2 className="text-xl font-black">{section.title}</h2>
                      <p className="text-xs text-text-muted">{section.subtitle}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  <p className="text-sm text-text-secondary mb-4">{section.description}</p>
                  <div className="flex flex-wrap gap-1">
                    {section.features.map((f) => (
                      <Badge key={f} variant="neutral">{f}</Badge>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>

        {/* MCP Server details */}
        <div id="mcp" className="mb-12">
          <h2 className="text-3xl font-black mb-4">MCP Server Setup</h2>
          <p className="text-sm text-text-muted mb-6">
            Configure the MCP server in your project&apos;s <code className="font-mono bg-gray-light px-1.5 py-0.5">.mcp.json</code> to give Claude Code agents access to Sauce Kitchen.
          </p>

          <div className="border-4 border-black p-6 mb-6">
            <pre className="text-sm font-mono overflow-x-auto">{`{
  "mcpServers": {
    "sauce-kitchen": {
      "type": "http",
      "url": "https://sauce-wireframe.vercel.app/api/mcp",
      "headers": {
        "Authorization": "Bearer your-api-key-here"
      }
    }
  }
}`}</pre>
          </div>

          <h3 className="font-extrabold mb-3">API Keys</h3>
          <div className="border-4 border-black overflow-x-auto">
            <table className="min-w-full">
              <thead className="border-b-4 border-black">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Agent</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-text-muted">Key</th>
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-gray-light">
                {[
                  { agent: "ux-designer", key: "sk_ux_designer_dev_key_001" },
                  { agent: "backend-dev", key: "sk_backend_dev_dev_key_001" },
                  { agent: "frontend-dev", key: "sk_frontend_dev_dev_key_001" },
                  { agent: "qa-tester", key: "sk_qa_tester_dev_key_001" },
                  { agent: "tech-lead", key: "sk_tech_lead_dev_key_001" },
                ].map((row) => (
                  <tr key={row.agent}>
                    <td className="px-4 py-3 text-sm font-semibold">{row.agent}</td>
                    <td className="px-4 py-3 text-sm font-mono text-text-muted">{row.key}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick links */}
        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/the-pass" className="flex items-center gap-1 font-semibold hover:underline">
            The Pass <ArrowRight size={14} />
          </Link>
          <Link href="/the-kitchen" className="flex items-center gap-1 font-semibold hover:underline">
            The Kitchen <ArrowRight size={14} />
          </Link>
          <Link href="/dev" className="flex items-center gap-1 font-semibold hover:underline">
            Dev Showcase <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </main>
    </Providers>
  );
}

"use client";

import { Tabs } from "@/components/ui";
import { FileText, Settings, Users } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

const sampleTabs = [
  { id: "overview", label: "Overview", content: <p className="text-sm text-text-secondary">Overview content goes here. This is the default tab panel.</p> },
  { id: "activity", label: "Activity", count: 12, content: <p className="text-sm text-text-secondary">Recent activity feed would render here.</p> },
  { id: "settings", label: "Settings", content: <p className="text-sm text-text-secondary">Settings panel with configuration options.</p> },
];

const iconTabs = [
  { id: "docs", label: "Documents", icon: <FileText size={16} />, content: <p className="text-sm text-text-secondary">Documents list.</p> },
  { id: "members", label: "Members", icon: <Users size={16} />, count: 8, content: <p className="text-sm text-text-secondary">Team members list.</p> },
  { id: "config", label: "Config", icon: <Settings size={16} />, content: <p className="text-sm text-text-secondary">Configuration panel.</p> },
];

export default function TabsShowcase() {
  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Tabs</h1>
      <p className="text-text-muted mb-8">Switch between content views within the same page context.</p>

      <Section title="Underline (Default)">
        <Tabs tabs={sampleTabs} variant="underline" />
      </Section>

      <Section title="Boxed">
        <Tabs tabs={sampleTabs} variant="boxed" />
      </Section>

      <Section title="Pill">
        <Tabs tabs={sampleTabs} variant="pill" />
      </Section>

      <Section title="With Icons & Counts">
        <Tabs tabs={iconTabs} variant="underline" />
      </Section>
    </div>
  );
}

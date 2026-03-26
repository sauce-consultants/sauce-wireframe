"use client";

import { useState, type ReactNode } from "react";

interface Tab {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  count?: number;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: "underline" | "boxed" | "pill";
  className?: string;
}

function Tabs({ tabs, defaultTab, variant = "underline", className = "" }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultTab || tabs[0]?.id);

  const tabListClass = {
    underline: "flex border-b-4 border-black",
    boxed: "flex border-4 border-black",
    pill: "inline-flex bg-gray-light p-1 gap-1",
  }[variant];

  const tabClass = (active: boolean) => {
    if (variant === "underline") {
      return active
        ? "px-4 py-3 text-sm font-semibold border-b-4 border-black -mb-1 bg-white"
        : "px-4 py-3 text-sm font-semibold border-b-4 border-transparent -mb-1 text-text-muted hover:text-black";
    }
    if (variant === "boxed") {
      return active
        ? "px-4 py-3 text-sm font-semibold bg-black text-white"
        : "px-4 py-3 text-sm font-semibold text-text-muted hover:bg-gray-light";
    }
    // pill
    return active
      ? "px-4 py-2 text-sm font-semibold bg-black text-white"
      : "px-4 py-2 text-sm font-semibold text-text-muted hover:text-black";
  };

  const activeTab = tabs.find((t) => t.id === activeId);

  return (
    <div className={className}>
      <div role="tablist" className={tabListClass}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={tab.id === activeId}
            aria-controls={`panel-${tab.id}`}
            onClick={() => setActiveId(tab.id)}
            className={`inline-flex items-center gap-2 transition-colors ${tabClass(tab.id === activeId)}`}
          >
            {tab.icon}
            {tab.label}
            {tab.count != null && (
              <span className="text-xs font-mono bg-gray-light text-text-muted px-1.5 py-0.5">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>
      {activeTab && (
        <div
          role="tabpanel"
          id={`panel-${activeTab.id}`}
          aria-labelledby={activeTab.id}
          className="pt-4"
        >
          {activeTab.content}
        </div>
      )}
    </div>
  );
}

export { Tabs, type TabsProps, type Tab };

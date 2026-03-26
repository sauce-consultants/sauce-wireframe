"use client";

import { useState } from "react";
import { Search, type SearchResult } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

const allResults: SearchResult[] = [
  { id: "1", label: "Acme Corp", description: "Customer since 2021", category: "Customer" },
  { id: "2", label: "Project Alpha", description: "Active, 12 tasks remaining", category: "Project" },
  { id: "3", label: "Invoice #1042", description: "$12,500 — Paid", category: "Invoice" },
  { id: "4", label: "Jane Smith", description: "jane@acme.com", category: "Contact" },
  { id: "5", label: "Quarterly Report", description: "Generated 25 Mar 2026", category: "Document" },
  { id: "6", label: "API Settings", description: "Manage API keys and webhooks", category: "Settings" },
];

export default function SearchShowcase() {
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (query: string) => {
    if (!query) {
      setResults([]);
      return;
    }
    setResults(
      allResults.filter(
        (r) =>
          r.label.toLowerCase().includes(query.toLowerCase()) ||
          r.description?.toLowerCase().includes(query.toLowerCase())
      )
    );
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Search</h1>
      <p className="text-text-muted mb-8">Composite search with filtered results, categories, and keyboard navigation.</p>

      <Section title="Interactive">
        <Search
          placeholder="Search customers, projects, invoices..."
          results={results}
          onSearch={handleSearch}
          onSelect={(r) => alert(`Selected: ${r.label}`)}
        />
      </Section>

      <Section title="Empty State (type something with no matches)">
        <p className="text-sm text-text-muted">Try searching for &quot;xyz&quot; above to see the no-results state.</p>
      </Section>
    </div>
  );
}

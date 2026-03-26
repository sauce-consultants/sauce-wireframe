"use client";

import { useState } from "react";
import { Pagination } from "@/components/ui";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function PaginationShowcase() {
  const [page1, setPage1] = useState(3);
  const [page2, setPage2] = useState(1);

  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Pagination</h1>
      <p className="text-text-muted mb-8">Page navigation with result counts and ellipsis handling.</p>

      <Section title="Full (With Result Count)">
        <Pagination currentPage={page1} totalPages={12} onPageChange={setPage1} totalResults={340} pageSize={25} />
      </Section>

      <Section title="Few Pages">
        <Pagination currentPage={page2} totalPages={4} onPageChange={setPage2} />
      </Section>

      <Section title="First Page (Prev Disabled)">
        <Pagination currentPage={1} totalPages={8} onPageChange={() => {}} />
      </Section>

      <Section title="Last Page (Next Disabled)">
        <Pagination currentPage={8} totalPages={8} onPageChange={() => {}} />
      </Section>
    </div>
  );
}

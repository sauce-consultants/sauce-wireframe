import type { Metadata } from "next";
import { PassHeader } from "@/components/the-pass/PassHeader";

export const metadata: Metadata = {
  title: "The Pass | Kitchen Planner",
  description: "What's cooking at Sauce",
};

export default function ThePassLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <PassHeader />
      <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      <footer className="border-t-2 border-gray-light px-6 py-3 text-xs text-text-muted text-center">
        Kitchen Planner by Sauce Consultants.
      </footer>
    </div>
  );
}

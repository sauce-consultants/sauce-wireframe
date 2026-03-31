import type { Metadata } from "next";
import { Providers } from "@/components/kitchen-planner/Providers";

export const metadata: Metadata = {
  title: "The Kitchen | Kitchen Planner",
  description: "Dish tracking board",
};

export default function TheKitchenLayout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="min-h-screen flex flex-col">
        {children}
        <footer className="border-t-2 border-gray-light px-6 py-3 text-xs text-text-muted text-center">
          Kitchen Planner by Sauce Consultants.
        </footer>
      </div>
    </Providers>
  );
}

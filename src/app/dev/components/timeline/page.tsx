import { Timeline } from "@/components/ui";
import { Check, Edit, MessageSquare, Plus, Trash2 } from "lucide-react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-10">
      <h3 className="text-lg font-extrabold mb-4 pb-1 border-b-2 border-gray-light">{title}</h3>
      {children}
    </div>
  );
}

export default function TimelineShowcase() {
  return (
    <div className="max-w-xl">
      <h1 className="text-4xl mb-2">Timeline</h1>
      <p className="text-text-muted mb-8">Chronological event sequence for activity logs and history.</p>

      <Section title="Simple">
        <Timeline
          events={[
            { id: "1", title: "Order placed", timestamp: "26 Mar 2026, 09:15" },
            { id: "2", title: "Payment confirmed", timestamp: "26 Mar 2026, 09:16" },
            { id: "3", title: "Shipped via Express", description: "Tracking: XP-12345-AU", timestamp: "26 Mar 2026, 14:30" },
            { id: "4", title: "Delivered", timestamp: "27 Mar 2026, 10:45" },
          ]}
        />
      </Section>

      <Section title="With Icons & Actors">
        <Timeline
          events={[
            { id: "1", title: "Record created", actor: "Jane Smith", icon: <Plus size={16} />, timestamp: "25 Mar 2026, 08:00" },
            { id: "2", title: "Description updated", actor: "Bob Lee", icon: <Edit size={16} />, timestamp: "25 Mar 2026, 10:30" },
            { id: "3", title: "Comment added", actor: "Alice Wang", description: "Looks good, ready for review.", icon: <MessageSquare size={16} />, timestamp: "25 Mar 2026, 14:15" },
            { id: "4", title: "Approved", actor: "Jane Smith", icon: <Check size={16} />, timestamp: "26 Mar 2026, 09:00" },
            { id: "5", title: "Archived", actor: "System", icon: <Trash2 size={16} />, timestamp: "28 Mar 2026, 00:00" },
          ]}
        />
      </Section>
    </div>
  );
}

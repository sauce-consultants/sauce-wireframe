import { SplitView } from "@/components/layouts";
import { Badge } from "@/components/ui";

const items = [
  { id: "1", name: "Acme Corp", status: "Active" },
  { id: "2", name: "Globex Inc", status: "Pending" },
  { id: "3", name: "Wayne Enterprises", status: "Active" },
  { id: "4", name: "Stark Industries", status: "Inactive" },
  { id: "5", name: "Umbrella Corp", status: "Active" },
];

const statusVariant = { Active: "success" as const, Pending: "warning" as const, Inactive: "neutral" as const };

export default function SplitViewDemo() {
  return (
    <div>
      <h2 className="text-2xl font-extrabold mb-6">Split View — Master–Detail</h2>
      <div className="border-4 border-black" style={{ height: 400 }}>
        <SplitView
          master={
            <div className="divide-y-2 divide-gray-light">
              {items.map((item, i) => (
                <div
                  key={item.id}
                  className={`px-4 py-3 cursor-pointer ${i === 0 ? "bg-gray-light" : "hover:bg-gray-light/50"}`}
                >
                  <p className="text-sm font-semibold">{item.name}</p>
                  <Badge variant={statusVariant[item.status as keyof typeof statusVariant]} className="mt-1">
                    {item.status}
                  </Badge>
                </div>
              ))}
            </div>
          }
          detail={
            <div className="p-6">
              <h3 className="text-xl font-extrabold mb-2">Acme Corp</h3>
              <Badge variant="success" dot className="mb-4">Active</Badge>
              <div className="space-y-3 text-sm text-text-secondary">
                <p><span className="font-semibold text-black">Contact:</span> Jane Smith</p>
                <p><span className="font-semibold text-black">Email:</span> jane@acme.com</p>
                <p><span className="font-semibold text-black">Revenue:</span> <span className="font-mono">$142,580</span></p>
              </div>
            </div>
          }
        />
      </div>
    </div>
  );
}

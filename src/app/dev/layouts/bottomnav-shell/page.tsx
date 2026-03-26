import { BottomNavShell } from "@/components/layouts";
import { Alert } from "@/components/ui";
import { Home, FolderOpen, Plus, MessageSquare, User } from "lucide-react";

export default function BottomNavShellDemo() {
  return (
    <div>
      <Alert variant="info" className="mb-6">
        The bottom nav bar is only visible below the <strong>lg</strong> breakpoint (1024px). Resize your browser or view on a mobile device to see it.
      </Alert>
      <div className="border-4 border-black overflow-hidden relative" style={{ height: 500, maxWidth: 375 }}>
        <BottomNavShell
          contained
          header={<h1 className="text-lg font-black">Dashboard</h1>}
          items={[
            { icon: <Home size={20} />, label: "Home", href: "#", active: true },
            { icon: <FolderOpen size={20} />, label: "Projects", href: "#" },
            { icon: <Plus size={20} />, label: "Create", href: "#" },
            { icon: <MessageSquare size={20} />, label: "Messages", href: "#" },
            { icon: <User size={20} />, label: "Profile", href: "#" },
          ]}
        >
          <div className="space-y-4">
            <div className="border-4 border-black p-4 text-sm">
              <p className="font-semibold">Welcome back</p>
              <p className="text-text-muted">Mobile-first layout with bottom navigation.</p>
            </div>
            <div className="border-4 border-gray-light p-8 text-center text-text-muted text-sm">
              Content area
            </div>
          </div>
        </BottomNavShell>
      </div>
    </div>
  );
}

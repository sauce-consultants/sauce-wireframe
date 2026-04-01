"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Avatar, DropdownMenu } from "@/components/ui";
import { LogOut, User } from "lucide-react";

const navItems = [
  { href: "/the-pass", label: "The Pass" },
  { href: "/the-kitchen", label: "The Kitchen" },
];

interface KitchenHeaderProps {
  action?: ReactNode;
}

export function KitchenHeader({ action }: KitchenHeaderProps) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="border-b-4 border-black px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/" className="font-black text-lg tracking-tight">
          Sauce Kitchen
        </Link>
        <nav className="hidden sm:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = item.href !== "#" && pathname.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`px-3 py-1.5 text-sm font-semibold ${
                  isActive
                    ? "bg-black text-white"
                    : "text-text-muted hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-center gap-3">
        {action}
        {session?.user && (
          <DropdownMenu
            trigger={
              <div className="flex items-center gap-2 cursor-pointer">
                <Avatar
                  name={session.user.name || ""}
                  src={session.user.image || undefined}
                  size="sm"
                />
              </div>
            }
            align="end"
            items={[
              { type: "label", label: session.user.name || "" },
              { type: "separator" },
              {
                id: "signout",
                label: "Sign out",
                icon: <LogOut size={16} />,
                onClick: () => signOut({ callbackUrl: "/auth/signin" }),
              },
            ]}
          />
        )}
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import { User } from "lucide-react";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl";

interface AvatarProps {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: "online" | "away" | "busy" | "offline";
  className?: string;
}

const sizeStyles: Record<AvatarSize, { container: string; text: string; status: string; icon: number }> = {
  xs: { container: "h-6 w-6", text: "text-[10px]", status: "h-2 w-2", icon: 14 },
  sm: { container: "h-8 w-8", text: "text-xs", status: "h-2.5 w-2.5", icon: 16 },
  md: { container: "h-10 w-10", text: "text-sm", status: "h-3 w-3", icon: 20 },
  lg: { container: "h-12 w-12", text: "text-base", status: "h-3.5 w-3.5", icon: 24 },
  xl: { container: "h-16 w-16", text: "text-lg", status: "h-4 w-4", icon: 28 },
};

const statusColors = {
  online: "bg-success",
  away: "bg-warning",
  busy: "bg-danger",
  offline: "bg-gray-mid",
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function Avatar({
  src,
  alt = "",
  name,
  size = "md",
  status,
  className = "",
}: AvatarProps) {
  const [imgError, setImgError] = useState(false);
  const s = sizeStyles[size];
  const showImage = src && !imgError;
  const initials = name ? getInitials(name) : null;

  return (
    <span
      className={`
        relative inline-flex items-center justify-center
        ${s.container} bg-gray-light border-2 border-black overflow-hidden
        ${className}
      `}
      aria-label={name || alt || undefined}
    >
      {showImage ? (
        <img
          src={src}
          alt={name ? "" : alt}
          onError={() => setImgError(true)}
          className="h-full w-full object-cover"
        />
      ) : initials ? (
        <span className={`font-bold ${s.text}`}>{initials}</span>
      ) : (
        <User size={s.icon} className="text-text-muted" />
      )}
      {status && (
        <span
          className={`
            absolute bottom-0 right-0 ${s.status} ${statusColors[status]}
            border-2 border-white
          `}
          aria-label={status}
        />
      )}
    </span>
  );
}

function AvatarGroup({
  children,
  max = 4,
}: {
  children: React.ReactNode[];
  max?: number;
}) {
  const visible = children.slice(0, max);
  const overflow = children.length - max;

  return (
    <div className="flex -space-x-2">
      {visible}
      {overflow > 0 && (
        <span className="h-10 w-10 border-2 border-black bg-gray-light flex items-center justify-center text-xs font-bold">
          +{overflow}
        </span>
      )}
    </div>
  );
}

export { Avatar, AvatarGroup, type AvatarProps, type AvatarSize };

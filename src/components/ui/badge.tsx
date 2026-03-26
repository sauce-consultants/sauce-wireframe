import { type ReactNode } from "react";
import { X } from "lucide-react";

type BadgeVariant = "neutral" | "accent" | "success" | "warning" | "danger";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
  onRemove?: () => void;
  className?: string;
}

const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string }> = {
  neutral: { bg: "bg-gray-light", text: "text-black", dot: "bg-gray-dark" },
  accent: { bg: "bg-accent/15", text: "text-accent", dot: "bg-accent" },
  success: { bg: "bg-success/15", text: "text-success", dot: "bg-success" },
  warning: { bg: "bg-warning/15", text: "text-warning", dot: "bg-warning" },
  danger: { bg: "bg-danger/15", text: "text-danger", dot: "bg-danger" },
};

function Badge({
  children,
  variant = "neutral",
  dot = false,
  onRemove,
  className = "",
}: BadgeProps) {
  const styles = variantStyles[variant];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 border-2 border-current
        px-3 py-1 text-sm font-semibold
        ${styles.bg} ${styles.text}
        ${className}
      `}
    >
      {dot && (
        <span
          className={`h-2 w-2 ${styles.dot}`}
          aria-hidden="true"
        />
      )}
      {children}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="ml-0.5 -mr-1 h-4 w-4 inline-flex items-center justify-center hover:opacity-70"
          aria-label={`Remove ${children}`}
        >
          <X size={12} />
        </button>
      )}
    </span>
  );
}

export { Badge, type BadgeProps, type BadgeVariant };

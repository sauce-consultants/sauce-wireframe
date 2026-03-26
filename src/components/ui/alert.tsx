import { type ReactNode } from "react";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";

type AlertVariant = "info" | "warning" | "error" | "success";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  onDismiss?: () => void;
  className?: string;
}

const config: Record<AlertVariant, { icon: ReactNode; border: string; bg: string }> = {
  info: { icon: <Info size={20} className="text-accent shrink-0" />, border: "border-accent", bg: "bg-accent/5" },
  warning: { icon: <AlertTriangle size={20} className="text-warning shrink-0" />, border: "border-warning", bg: "bg-warning/5" },
  error: { icon: <AlertCircle size={20} className="text-danger shrink-0" />, border: "border-danger", bg: "bg-danger/5" },
  success: { icon: <CheckCircle size={20} className="text-success shrink-0" />, border: "border-success", bg: "bg-success/5" },
};

function Alert({
  variant = "info",
  title,
  children,
  action,
  onDismiss,
  className = "",
}: AlertProps) {
  const { icon, border, bg } = config[variant];

  return (
    <div
      role="alert"
      className={`
        border-4 ${border} ${bg} p-4 flex gap-3
        ${className}
      `}
    >
      {icon}
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold text-sm mb-1">{title}</p>}
        <div className="text-sm text-text-secondary">{children}</div>
        {action && <div className="mt-3">{action}</div>}
      </div>
      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          className="text-text-muted hover:text-black shrink-0"
          aria-label="Dismiss"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}

export { Alert, type AlertProps, type AlertVariant };

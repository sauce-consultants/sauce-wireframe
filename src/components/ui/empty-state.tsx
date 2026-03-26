import { type ReactNode } from "react";

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

function EmptyState({
  icon,
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center py-16 px-4 ${className}`}
    >
      {icon && (
        <div className="mb-6 text-gray-mid" aria-hidden="true">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-extrabold mb-2">{title}</h3>
      <p className="text-sm text-text-muted max-w-md mb-6">{description}</p>
      {action}
    </div>
  );
}

export { EmptyState, type EmptyStateProps };

import { type ReactNode } from "react";

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  icon?: ReactNode;
  actor?: string;
}

interface TimelineProps {
  events: TimelineEvent[];
  className?: string;
}

function Timeline({ events, className = "" }: TimelineProps) {
  return (
    <ol className={`relative ${className}`}>
      {/* Vertical line */}
      <div className="absolute left-4 top-0 bottom-0 w-1 bg-black" aria-hidden="true" />

      {events.map((event, i) => (
        <li key={event.id} className={`relative flex gap-4 ${i < events.length - 1 ? "pb-8" : ""}`}>
          {/* Node */}
          <span
            className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center bg-white border-4 border-black"
            aria-hidden="true"
          >
            {event.icon || <span className="h-2 w-2 bg-black" />}
          </span>

          {/* Content */}
          <div className="flex-1 pt-0.5">
            <p className="text-sm font-semibold">{event.title}</p>
            {event.actor && (
              <p className="text-xs text-text-muted">{event.actor}</p>
            )}
            {event.description && (
              <p className="text-sm text-text-secondary mt-1">{event.description}</p>
            )}
            <time className="text-xs font-mono text-text-muted mt-1 block">
              {event.timestamp}
            </time>
          </div>
        </li>
      ))}
    </ol>
  );
}

export { Timeline, type TimelineProps, type TimelineEvent };

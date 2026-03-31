import { Badge, Avatar } from "@/components/ui";
import { Clock, CheckCircle, Calendar, Building2, User } from "lucide-react";
import { CustomerJournal } from "./CustomerJournal";
import { STAGES, type Customer, type JournalEntry, type Stage, type Heat } from "./types";
import { formatRelativeTime } from "@/lib/relative-time";

const stageBadge: Record<Stage, string> = {
  enquiry: "Enquiry",
  reservation: "Reservation",
  seated: "Seated",
  cleared: "Cleared",
  archived: "Archived",
};

const heatLabel: Record<Heat, string> = {
  hot: "Hot",
  warm: "Warm",
  cool: "Cool",
  cold: "Cold",
};

interface CustomerDetailProps {
  customer: Customer;
  journalEntries: JournalEntry[];
  users: { id: number; name: string }[];
  onJournalRefresh: () => void;
}

export function CustomerDetail({ customer, journalEntries, users, onJournalRefresh }: CustomerDetailProps) {
  const stage = stageBadge[customer.stage];
  const stageInfo = STAGES.find((s) => s.key === customer.stage);
  const heat = heatLabel[customer.heat];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-black">{customer.companyName}</h3>
        {customer.subtitle && (
          <p className="text-sm text-text-muted mt-1">{customer.subtitle}</p>
        )}
      </div>

      {/* Status row */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="neutral" dot>{stage}</Badge>
        <Badge variant="neutral" dot>{heat}</Badge>
      </div>

      {/* Details grid */}
      <div className="border-4 border-black divide-y-2 divide-gray-light">
        <div className="flex items-center gap-3 px-4 py-3">
          <User size={16} className="text-text-muted shrink-0" />
          <div>
            <p className="text-xs text-text-muted">Owner</p>
            <div className="flex items-center gap-2 mt-0.5">
              <Avatar name={customer.owner} size="xs" />
              <span className="text-sm font-semibold">{customer.owner}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <Building2 size={16} className="text-text-muted shrink-0" />
          <div>
            <p className="text-xs text-text-muted">Stage</p>
            <p className="text-sm font-semibold">{stageInfo?.title}</p>
            <p className="text-xs text-text-muted">{stageInfo?.subtitle}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <Clock size={16} className="text-text-muted shrink-0" />
          <div>
            <p className="text-xs text-text-muted">Last Activity</p>
            <p className="text-sm font-mono">{formatRelativeTime(customer.lastActivity)}</p>
          </div>
        </div>

        {customer.nextAction && (
          <div className="flex items-start gap-3 px-4 py-3">
            <CheckCircle size={16} className="text-text-muted shrink-0 mt-0.5" />
            <div>
              <p className="text-xs text-text-muted">Next Action</p>
              <p className="text-sm font-semibold">{customer.nextAction}</p>
              {customer.dueDate && (
                <div className="flex items-center gap-1 mt-1">
                  <Calendar size={12} className="text-text-muted" />
                  <p className="text-xs font-mono text-text-muted">Due: {customer.dueDate}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Journal */}
      <CustomerJournal
        entries={journalEntries}
        customerId={customer.id}
        users={users}
        onRefresh={onJournalRefresh}
      />

      {/* Metadata */}
      <div className="text-xs text-text-muted font-mono">
        ID: {customer.id}
      </div>
    </div>
  );
}

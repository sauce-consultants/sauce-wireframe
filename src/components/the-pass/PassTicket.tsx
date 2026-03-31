import { Badge, Card, CardBody } from "@/components/ui";
import { Clock, CheckCircle } from "lucide-react";
import { OwnerAvatar } from "./OwnerAvatar";
import type { Customer, Heat } from "./types";
import { formatRelativeTime } from "@/lib/relative-time";

const heatBorder: Record<Heat, string> = {
  hot: "border-l-black",
  warm: "border-l-gray-dark",
  cool: "border-l-gray-mid",
  cold: "border-l-gray-light",
};

interface PassTicketProps {
  customer: Customer;
  onClick?: () => void;
}

export function PassTicket({ customer, onClick }: PassTicketProps) {
  return (
    <Card
      className={`border-l-4 ${heatBorder[customer.heat]} transition-transform duration-150 hover:-translate-y-1 hover:shadow-md cursor-pointer`}
      onClick={onClick}
    >
      <CardBody className="p-4">
        {/* Company name + size */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-extrabold text-sm leading-tight">{customer.companyName}</p>
            {customer.subtitle && (
              <p className="text-xs text-text-muted">{customer.subtitle}</p>
            )}
          </div>
          {customer.size && (
            <Badge variant="neutral" className="shrink-0">{customer.size}</Badge>
          )}
        </div>

        {/* Owner + last activity */}
        <div className="flex items-center gap-2 mt-2">
          <OwnerAvatar name={customer.owner} />
          <span className="text-xs">{customer.owner}</span>
          <span className="text-text-muted">·</span>
          <div className="flex items-center gap-1 text-xs text-text-muted">
            <Clock size={12} />
            <span className="font-mono">{formatRelativeTime(customer.lastActivity)}</span>
          </div>
        </div>

        {/* Next action */}
        {customer.nextAction && (
          <div className="border-t-2 border-gray-light pt-2 mt-3">
            <div className="flex items-start gap-1.5 text-xs">
              <CheckCircle size={12} className="text-text-muted shrink-0 mt-0.5" />
              <div>
                <p>{customer.nextAction}</p>
                {customer.dueDate && (
                  <p className="font-mono text-text-muted mt-0.5">
                    Due: {customer.dueDate}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

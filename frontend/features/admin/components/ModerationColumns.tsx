import React from "react";
import { Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, MessageSquare } from "lucide-react";
import { SupportTicket } from "@/features/citizen/types";
import { formatDate } from "@/lib/utils";

export const getModerationColumns = (
  resolveReport: (id: string) => void,
  openChat: (ticket: SupportTicket) => void,
): Header<SupportTicket>[] => [
  {
    label: "Name",
    render: (report) => (
      <span className="text-[14px] font-bold text-text leading-relaxed">
        {report.user?.name || "Anonymous User"}
      </span>
    ),
  },
  {
    label: "Issue",
    render: (report) => (
      <div className="flex flex-col">
        <span className="text-[14px] font-bold text-text leading-tight">{report.title}</span>
        <span className="text-[12px] text-text-muted mt-1 line-clamp-2 leading-relaxed">{report.description}</span>
      </div>
    ),
  },
  {
    label: "Date Created",
    render: (report) => (
      <span className="text-[14px] text-text-muted">
        {formatDate(report.created_at, "short")}
      </span>
    ),
  },
  {
    label: "Status",
    render: (report) => (
      <Badge variant={report.status === "Resolved" ? "success" : "warning"}>
        {report.status}
      </Badge>
    ),
  },
  {
    label: "Actions",
    render: (report) => (
      <div className="flex items-center gap-2">
        <Button
          variant="ghost-primary"
          size="icon"
          shape="square"
          onClick={() => openChat(report)}
          title="Open Chat with Reporter"
        >
          <MessageSquare size={18} />
        </Button>
        {report.status === "Open" && (
          <Button
            variant="ghost-success"
            size="icon"
            shape="square"
            onClick={() => resolveReport(report.id)}
            title="Mark as Resolved"
          >
            <CheckCircle2 size={18} />
          </Button>
        )}
      </div>
    ),
  },
];

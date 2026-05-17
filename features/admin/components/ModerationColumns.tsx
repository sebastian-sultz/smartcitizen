import React from "react";
import { Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle2 } from "lucide-react";

export const getModerationColumns = (
  resolveReport: (id: string) => void
): Header<any>[] => [
  {
    label: "Report ID",
    render: (report) => <span className="text-[14px] font-mono text-text-muted">{report.id}</span>,
  },
  {
    label: "Reported User",
    render: (report) => (
      <div>
        <div className="text-[14px] font-bold text-text">{report.reportedUserName}</div>
        <div className="text-[12px] text-text-muted font-normal font-mono mt-0.5">{report.reportedUserId}</div>
      </div>
    ),
  },
  {
    label: "Reason",
    render: (report) => <span className="text-[14px] text-text-muted">{report.reason}</span>,
  },
  {
    label: "Date",
    render: (report) => <span className="text-[14px] text-text-muted">{report.date}</span>,
  },
  {
    label: "Status",
    render: (report) => (
      <Badge variant={report.status === 'Resolved' ? 'success' : 'warning'}>
        {report.status}
      </Badge>
    ),
  },
  {
    label: "Actions",
    render: (report) => (
      <div className="flex items-center gap-2">
        {report.status === 'Open' && (
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

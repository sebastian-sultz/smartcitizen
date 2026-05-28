import React from "react";
import { Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { XCircle } from "lucide-react";
import { VolunteerResponse } from "@/features/public/volunteer/types";
import { formatDate } from "@/lib/utils";

export const getVolunteerAppsColumns = (
  updateVolunteerAppStatus: (id: string, status: "Approved" | "Rejected") => void | Promise<void>
): Header<VolunteerResponse>[] => [
  {
    label: "App ID",
    render: (app) => <span className="text-[14px] font-mono text-text-muted">{app.id}</span>,
  },
  {
    label: "Applicant",
    render: (app) => <span className="text-[14px] font-bold text-text">{app.name}</span>,
  },
  {
    label: "Profession",
    render: (app) => <span className="text-[14px] text-text-muted">{app.profession || "N/A"}</span>,
  },
  {
    label: "Applied Role",
    render: (app) => <span className="text-[14px] text-text-muted">Volunteer</span>,
  },
  {
    label: "Date",
    render: (app) => (
      <span className="text-[14px] text-text-muted">
        {formatDate(app.created_at, "default")}
      </span>
    ),
  },
  {
    label: "Status",
    render: (app) => (
      <Badge variant="success">
        Approved
      </Badge>
    ),
  },
  {
    label: "Actions",
    render: (app) => (
      <div className="flex items-center justify-end gap-2">
        <Button 
          variant="ghost-danger"
          size="icon"
          shape="square"
          onClick={() => updateVolunteerAppStatus(app.id, 'Rejected')}
          title="Remove Volunteer"
        >
          <XCircle size={18} />
        </Button>
      </div>
    ),
  },
];


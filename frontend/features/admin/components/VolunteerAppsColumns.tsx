import React from "react";
import { Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Eye, Check, Pause, X } from "lucide-react";
import { VolunteerResponse } from "@/features/public/volunteer/types";
import { formatDate } from "@/lib/utils";

export const getVolunteerAppsColumns = (
  updateVolunteerAppStatus: (id: string, status: "APPROVED" | "REJECTED" | "SUSPENDED" | "PENDING") => void | Promise<void>,
  viewDetails: (volunteer: VolunteerResponse) => void
): Header<VolunteerResponse>[] => [
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
    label: "Public Consent",
    render: (app) => (
      <Badge variant={app.ispublicconsent ? "success" : "secondary"}>
        {app.ispublicconsent ? "Accepted" : "Not Accepted"}
      </Badge>
    ),
  },
  {
    label: "Status",
    render: (app) => {
      const status = (app.status || "PENDING").toUpperCase();
      const variantMap: Record<string, "success" | "warning" | "danger" | "neutral"> = {
        APPROVED: "success",
        PENDING: "warning",
        REJECTED: "danger",
        SUSPENDED: "neutral",
      };
      const badgeVariant = variantMap[status] || "warning";
      return (
        <Badge variant={badgeVariant}>
          {status}
        </Badge>
      );
    },
  },
  {
    label: "Actions",
    render: (app) => {
      const status = (app.status || "PENDING").toUpperCase();
      return (
        <div className="flex items-center justify-end gap-2">
          <Button 
            variant="ghost-primary"
            size="sm"
            shape="square"
            onClick={() => viewDetails(app)}
            startIcon={<Eye size={16} />}
          >
            View
          </Button>
          <Button 
            variant="ghost-success"
            size="sm"
            shape="square"
            onClick={() => updateVolunteerAppStatus(app.id, 'APPROVED')}
            disabled={status === 'APPROVED'}
            startIcon={<Check size={16} />}
          >
            Approve
          </Button>
          <Button 
            variant="ghost-muted"
            size="sm"
            shape="square"
            onClick={() => updateVolunteerAppStatus(app.id, 'SUSPENDED')}
            disabled={status === 'SUSPENDED'}
            startIcon={<Pause size={16} />}
          >
            Suspend
          </Button>
          <Button 
            variant="ghost-danger"
            size="sm"
            shape="square"
            onClick={() => updateVolunteerAppStatus(app.id, 'REJECTED')}
            disabled={status === 'REJECTED'}
            startIcon={<X size={16} />}
          >
            Reject
          </Button>
        </div>
      );
    },
  },
];


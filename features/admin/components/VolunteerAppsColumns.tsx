import React from "react";
import { Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { CheckCircle2, XCircle } from "lucide-react";

export const getVolunteerAppsColumns = (
  updateVolunteerAppStatus: (id: string, status: any) => void
): Header<any>[] => [
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
    render: (app) => <span className="text-[14px] text-text-muted">{app.profession}</span>,
  },
  {
    label: "Applied Role",
    render: (app) => <span className="text-[14px] text-text-muted">{app.applyForRole !== 'None' ? app.applyForRole : 'Volunteer'}</span>,
  },
  {
    label: "Date",
    render: (app) => <span className="text-[14px] text-text-muted">{app.appliedDate}</span>,
  },
  {
    label: "Status",
    render: (app) => (
      <Badge variant={
        app.status === 'Approved' ? 'success' : 
        app.status === 'Rejected' ? 'danger' : 
        'warning'
      }>
        {app.status}
      </Badge>
    ),
  },
  {
    label: "Actions",
    render: (app) => (
      <div className="flex items-center justify-end gap-2">
        {app.status === 'Pending' && (
          <>
            <Button 
              variant="ghost-success"
              size="icon"
              shape="square"
              onClick={() => updateVolunteerAppStatus(app.id, 'Approved')}
              title="Approve"
            >
              <CheckCircle2 size={18} />
            </Button>
            <Button 
              variant="ghost-danger"
              size="icon"
              shape="square"
              onClick={() => updateVolunteerAppStatus(app.id, 'Rejected')}
              title="Reject"
            >
              <XCircle size={18} />
            </Button>
          </>
        )}
      </div>
    ),
  },
];

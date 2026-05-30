import React from "react";
import { Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";

export const campaignsColumns: Header<any>[] = [
  {
    label: "Title",
    render: (campaign) => <span className="text-[14px] font-bold text-text">{campaign.title}</span>,
  },
  {
    label: "Participants",
    render: (campaign) => <span className="text-[14px] text-text-muted">{campaign.participants.toLocaleString()}</span>,
  },
  {
    label: "Status",
    render: (campaign) => (
      <Badge variant={campaign.status === 'Active' ? 'success' : 'muted'}>
        {campaign.status}
      </Badge>
    ),
  },
];

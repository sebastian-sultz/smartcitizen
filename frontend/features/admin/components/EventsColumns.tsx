import React from "react";
import { Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";

export const getEventsColumns = (
  deleteEvent: (id: string) => void
): Header<any>[] => [
  {
    label: "Event ID",
    render: (event) => <span className="text-[14px] font-mono text-text-muted">{event.id}</span>,
  },
  {
    label: "Title",
    render: (event) => <span className="text-[14px] font-bold text-text">{event.title}</span>,
  },
  {
    label: "Date",
    render: (event) => <span className="text-[14px] text-text-muted">{event.date}</span>,
  },
  {
    label: "Location",
    render: (event) => <span className="text-[14px] text-text-muted">{event.location}</span>,
  },
  {
    label: "Status",
    render: (event) => (
      <Badge variant={
        event.status === 'Upcoming' ? 'info' : 
        event.status === 'Completed' ? 'success' : 
        'danger'
      }>
        {event.status}
      </Badge>
    ),
  },
  {
    label: "Actions",
    render: (event) => (
      <div className="flex items-center justify-end gap-2">
        <Button 
          variant="ghost-danger"
          size="icon"
          shape="square"
          onClick={() => {
            if(confirm("Delete this event?")) {
              deleteEvent(event.id);
            }
          }}
          title="Delete Event"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    ),
  },
];

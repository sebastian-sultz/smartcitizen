import React from "react";
import { Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Trash2, Users } from "lucide-react";
import { EventResponse } from "@/features/citizen/community/types";
import { formatDate } from "@/lib/utils";
import { ConfirmOptions } from "@/components/ui/AlertProvider";

export const getEventsColumns = (
  deleteEvent: (id: string) => void,
  showConfirm: (options: ConfirmOptions) => void,
  viewParticipants: (id: string, name: string) => void
): Header<EventResponse>[] => [
  {
    label: "Title",
    render: (event) => <span className="text-[14px] font-bold text-text">{event.event_name}</span>,
  },
  {
    label: "Date",
    render: (event) => (
      <span className="text-[14px] text-text-muted">
        {formatDate(event.event_date, "short")}
      </span>
    ),
  },
  {
    label: "Location",
    render: (event) => <span className="text-[14px] text-text-muted">{event.event_address}</span>,
  },
  {
    label: "Status",
    render: (event) => {
      const isCompleted = new Date(event.event_date) < new Date();
      return (
        <Badge variant={isCompleted ? "success" : "info"}>
          {isCompleted ? "Completed" : "Upcoming"}
        </Badge>
      );
    },
  },
  {
    label: "Actions",
    render: (event) => (
      <div className="flex items-center justify-end gap-2">
        <Button 
          variant="ghost-primary"
          size="icon"
          shape="square"
          onClick={() => viewParticipants(event.id, event.event_name)}
          title="View Participants"
        >
          <Users size={16} />
        </Button>
        <Button 
          variant="ghost-danger"
          size="icon"
          shape="square"
          onClick={() => {
            showConfirm({
              title: "Delete Event",
              message: "Are you sure you want to delete this event? This action cannot be undone.",
              confirmText: "Delete",
              cancelText: "Cancel",
              type: "error",
              onConfirm: () => deleteEvent(event.id),
            });
          }}
          title="Delete Event"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    ),
  },
];


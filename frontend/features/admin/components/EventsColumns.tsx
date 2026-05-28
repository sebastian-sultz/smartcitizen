import React from "react";
import { Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Trash2 } from "lucide-react";
import { EventResponse } from "@/features/community/types";
import { formatDate } from "@/lib/utils";
import { ConfirmOptions } from "@/components/ui/AlertProvider";

export const getEventsColumns = (
  deleteEvent: (id: string) => void,
  showConfirm: (options: ConfirmOptions) => void
): Header<EventResponse>[] => [
  {
    label: "Event ID",
    render: (event) => <span className="text-[14px] font-mono text-text-muted">{event.id}</span>,
  },
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


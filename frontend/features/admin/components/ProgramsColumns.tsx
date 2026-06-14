import React from "react";
import { Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Trash2, Users } from "lucide-react";
import { EventResponse } from "@/features/citizen/community/types";
import { formatDate } from "@/lib/utils";
import { ConfirmOptions } from "@/components/ui/AlertProvider";

export const getProgramsColumns = (
  deleteProgram: (id: string) => void,
  showConfirm: (options: ConfirmOptions) => void,
  viewParticipants: (id: string, name: string) => void
): Header<EventResponse>[] => [
  {
    label: "Title",
    render: (program) => <span className="text-[14px] font-bold text-text">{program.event_name}</span>,
  },
  {
    label: "Type",
    render: (program) => (
      <Badge variant={program.event_type === "Initiative" ? "success" : "info"}>
        {program.event_type || "Event"}
      </Badge>
    ),
  },
  {
    label: "Date",
    render: (program) => (
      <span className="text-[14px] text-text-muted">
        {formatDate(program.event_date, "short")}
      </span>
    ),
  },
  {
    label: "Location",
    render: (program) => <span className="text-[14px] text-text-muted">{program.event_address}</span>,
  },
  {
    label: "Status",
    render: (program) => {
      const isCompleted = new Date(program.event_date) < new Date();
      return (
        <Badge variant={isCompleted ? "success" : "info"}>
          {isCompleted ? "Completed" : "Upcoming"}
        </Badge>
      );
    },
  },
  {
    label: "Actions",
    render: (program) => (
      <div className="flex items-center justify-end gap-2">
        <Button 
          variant="ghost-primary"
          size="sm"
          shape="square"
          onClick={() => viewParticipants(program.id, program.event_name)}
          startIcon={<Users size={16} />}
        >
          Participants
        </Button>
        <Button 
          variant="ghost-danger"
          size="sm"
          shape="square"
          onClick={() => {
            showConfirm({
              title: "Delete Program",
              message: "Are you sure you want to delete this program? This action cannot be undone.",
              confirmText: "Delete",
              cancelText: "Cancel",
              type: "error",
              onConfirm: () => deleteProgram(program.id),
            });
          }}
          startIcon={<Trash2 size={16} />}
        >
          Delete
        </Button>
      </div>
    ),
  },
];

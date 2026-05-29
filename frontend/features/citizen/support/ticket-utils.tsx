import { Badge } from "@/components/ui/Badge";
import { SupportTicket } from "../types";

export function getTicketStatusBadge(status: SupportTicket["status"]) {
  switch (status) {
    case "Open":
      return <Badge variant="default" size="sm">Open</Badge>;
    case "Resolved":
      return <Badge variant="success" size="sm">Resolved</Badge>;
    default:
      return <Badge variant="neutral" size="sm">Closed</Badge>;
  }
}

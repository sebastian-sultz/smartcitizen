"use client";

import { useAdminStore } from "../store/useAdminStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trash2, Plus } from "lucide-react";
import { TableComponent } from "@/components/ui/TableComponent";
import { getEventsColumns } from "./EventsColumns";

export const EventsTable = () => {
  const { events, deleteEvent } = useAdminStore();

  const columns = getEventsColumns(deleteEvent);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Event Management</CardTitle>
        <Button size="sm" variant="primary" startIcon={<Plus size={16} />} onClick={() => alert("Open Create Event Modal")}>
          Create Event
        </Button>
      </CardHeader>
      <CardContent>
        <TableComponent 
          headers={columns} 
          data={events} 
          emptyMessage="No events found" 
          className="shadow-none border-0" 
        />
      </CardContent>
    </Card>
  );
};

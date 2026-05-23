"use client";

import { useEffect, useState } from "react";
import { getAllEvents, deleteEvent as apiDeleteEvent } from "@/features/community/api";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { TableComponent } from "@/components/ui/TableComponent";
import { getEventsColumns } from "./EventsColumns";
import { toast } from "sonner";
import { CreateEventModal } from "./CreateEventModal";
import { useAlert } from "@/components/ui/AlertProvider";

import { EventResponse } from "@/features/community/types";

export const EventsTable = () => {
  const { showConfirm } = useAlert();
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  const fetchEvents = async () => {
    try {
      const fetched = await getAllEvents();
      setEvents(fetched);
    } catch (err) {
      console.error("Failed to fetch events:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        await fetchEvents();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const deleteEvent = async (id: string) => {
    try {
      await apiDeleteEvent(id);
      setEvents(prev => prev.filter(e => e.id !== id));
      toast.success("Event deleted successfully");
    } catch (err) {
      console.error("Failed to delete event:", err);
    }
  };


  const columns = getEventsColumns(deleteEvent, showConfirm);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CardTitle>Event Management</CardTitle>
        <Button 
          size="sm" 
          variant="primary" 
          startIcon={<Plus size={16} />}
          onClick={() => setOpen(true)}
          className="w-full sm:w-auto"
        >
          Create Event
        </Button>
        <CreateEventModal open={open} onOpenChange={setOpen} onSuccess={fetchEvents} />
      </CardHeader>
      <CardContent>
        <TableComponent 
          headers={columns} 
          data={events} 
          loading={loading}
          emptyMessage="No events found" 
          className="shadow-none border-0" 
        />
      </CardContent>
    </Card>
  );
};

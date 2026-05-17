"use client";

import { useAdminStore } from "../store/useAdminStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Trash2, Plus } from "lucide-react";

export const EventsTable = () => {
  const { events, deleteEvent } = useAdminStore();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Event Management</CardTitle>
        <Button size="sm" onClick={() => alert("Open Create Event Modal")}>
          <Plus size={16} className="mr-2" />
          Create Event
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg/50">
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider rounded-tl-xl">Event ID</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Title</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Date</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Location</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider rounded-tr-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {events.map((event) => (
                <tr key={event.id} className="hover:bg-bg/50 transition-colors">
                  <td className="p-4 text-[14px] font-mono text-text-muted">{event.id}</td>
                  <td className="p-4 text-[14px] font-bold text-text">{event.title}</td>
                  <td className="p-4 text-[14px] text-text-muted">{event.date}</td>
                  <td className="p-4 text-[14px] text-text-muted">{event.location}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[12px] font-bold uppercase rounded-full tracking-wider ${
                      event.status === 'Upcoming' ? 'bg-blue-100 text-blue-700' : 
                      event.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                      'bg-red-100 text-red-700'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => {
                        if(confirm("Delete this event?")) {
                          deleteEvent(event.id);
                        }
                      }}
                      className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                      title="Delete Event"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

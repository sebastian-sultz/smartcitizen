import { EventsTable } from "@/features/admin/components/EventsTable";

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Events</h1>
        <p className="text-text-muted mt-1 text-[14px]">Create and manage community workshops and events.</p>
      </div>
      <EventsTable />
    </div>
  );
}

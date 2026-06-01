import { ProgramsTable } from "@/features/admin/components/ProgramsTable";

export default function AdminEventsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Programs</h1>
        <p className="text-text-muted mt-1 text-[14px]">Create and manage community programs, initiatives, and workshops.</p>
      </div>
      <ProgramsTable />
    </div>
  );
}

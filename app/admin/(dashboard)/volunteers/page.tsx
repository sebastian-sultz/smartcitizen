import { VolunteerAppsTable } from "@/features/admin/components/VolunteerAppsTable";

export default function AdminVolunteersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Volunteer Applications</h1>
        <p className="text-text-muted mt-1 text-[14px]">Review and approve incoming volunteer and coordinator applications.</p>
      </div>
      <VolunteerAppsTable />
    </div>
  );
}

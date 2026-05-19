import { UsersTable } from "@/features/admin/components/UsersTable";

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Users</h1>
        <p className="text-text-muted mt-1 text-[14px]">Manage all registered Smart Citizens, Volunteers, and Coordinators.</p>
      </div>
      <UsersTable />
    </div>
  );
}

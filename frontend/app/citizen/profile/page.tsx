import { ProfileView } from "@/features/citizen";

export default function CitizenProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-black text-text tracking-tight">My Profile</h1>
        <p className="text-text-muted mt-1 text-sm font-semibold uppercase tracking-wider">
          Manage your personal information, address, and social links
        </p>
      </div>

      <ProfileView />
    </div>
  );
}

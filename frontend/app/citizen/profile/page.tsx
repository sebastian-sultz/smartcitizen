import { ProfileView } from "@/features/citizen";

export default function CitizenProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-text">My Profile</h1>
        <p className="text-text-muted mt-1 text-[15px]">Manage your personal coordinates and coordinator credentials.</p>
      </div>

      <ProfileView />
    </div>
  );
}

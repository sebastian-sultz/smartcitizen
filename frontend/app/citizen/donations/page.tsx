import { DonationDashboard } from "@/features/citizen";

export default function CitizenDonationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-black text-text tracking-tight">My Donations</h1>
        <p className="text-text-muted mt-1 text-sm font-semibold uppercase tracking-wider">
          Track your contributions, download 80G tax certificates, and manage recurring plans
        </p>
      </div>

      <DonationDashboard />
    </div>
  );
}

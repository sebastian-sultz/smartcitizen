import { DonationDashboard } from "@/features/citizen";

export default function CitizenDonationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-text">My Donations</h1>
        <p className="text-text-muted mt-1 text-[15px]">Track your direct impact support ledger and download 80G tax benefit certificates.</p>
      </div>

      <DonationDashboard />
    </div>
  );
}

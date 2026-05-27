import { ReferralDashboard } from "@/features/citizen";

export default function CitizenReferralsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-black text-text tracking-tight">Referral Network</h1>
        <p className="text-text-muted mt-1 text-sm font-semibold uppercase tracking-wider">
          Track your invitations, monitor joined connections, and review total community impact generated
        </p>
      </div>

      <ReferralDashboard />
    </div>
  );
}

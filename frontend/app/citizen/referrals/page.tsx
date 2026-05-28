import { ReferralDashboard } from "@/features/citizen";

export default function CitizenReferralsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-text">My Referrals</h1>
        <p className="text-text-muted mt-1 text-[15px]">Invite friends, track your member network directory, and level up your promoter credentials.</p>
      </div>

      <ReferralDashboard />
    </div>
  );
}

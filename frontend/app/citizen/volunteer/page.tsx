import { VolunteerHub } from "@/features/citizen";

export default function CitizenVolunteerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-black text-text tracking-tight">Volunteer Hub</h1>
        <p className="text-text-muted mt-1 text-sm font-semibold uppercase tracking-wider">
          Track your eligibility and submit details to become an active community drives coordinator
        </p>
      </div>

      <VolunteerHub />
    </div>
  );
}

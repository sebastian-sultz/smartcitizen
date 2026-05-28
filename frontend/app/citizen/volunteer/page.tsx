import { VolunteerHub } from "@/features/citizen";

export default function CitizenVolunteerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-text">Volunteer Gating</h1>
        <p className="text-text-muted mt-1 text-[15px]">Check coordinator requirements, verify your community circle, and apply for verified NGO coordinator status.</p>
      </div>

      <VolunteerHub />
    </div>
  );
}

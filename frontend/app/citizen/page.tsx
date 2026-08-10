import { CitizenDashboard } from "@/features/citizen";

export default function CitizenDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="hidden md:block">
        <h1 className="text-3xl font-display font-bold text-text">Dashboard</h1>
        <p className="text-text-muted mt-1 text-[15px]">Welcome back to your Smart Citizen portal.</p>
      </div>

      <CitizenDashboard />
    </div>
  );
}

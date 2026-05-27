import { SupportDashboard } from "@/features/citizen";

export default function CitizenSupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-black text-text tracking-tight">Support Desk</h1>
        <p className="text-text-muted mt-1 text-sm font-semibold uppercase tracking-wider">
          Search frequently asked questions or open a direct ticket with our district coordinators
        </p>
      </div>

      <SupportDashboard />
    </div>
  );
}

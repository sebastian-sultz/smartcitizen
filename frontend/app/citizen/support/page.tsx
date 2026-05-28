import { SupportDashboard } from "@/features/citizen";

export default function CitizenSupportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-text">Help & Support</h1>
        <p className="text-text-muted mt-1 text-[15px]">Find quick answers to common issues or lodge a ticket directly to our coordinators.</p>
      </div>

      <SupportDashboard />
    </div>
  );
}

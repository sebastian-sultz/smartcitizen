import { CampaignsTable } from "@/features/admin/components/CampaignsTable";

export default function AdminCampaignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Awareness Campaigns</h1>
        <p className="text-text-muted mt-1 text-[14px]">Monitor and manage ongoing awareness campaigns.</p>
      </div>
      <CampaignsTable />
    </div>
  );
}

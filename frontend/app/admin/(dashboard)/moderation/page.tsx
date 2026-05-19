import { ModerationTable } from "@/features/admin/components/ModerationTable";

export default function AdminModerationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Moderation & Abuse</h1>
        <p className="text-text-muted mt-1 text-[14px]">Review user reports and manage platform safety.</p>
      </div>
      <ModerationTable />
    </div>
  );
}

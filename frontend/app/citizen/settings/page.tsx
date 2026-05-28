import { PrivacyControls } from "@/features/citizen/profile/PrivacyControls";

export default function CitizenSettingsPage() {
  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-3xl font-display font-bold text-text">Privacy & Settings</h1>
        <p className="text-text-muted mt-1 text-[15px]">Manage your data, visibility, and account preferences.</p>
      </div>

      <div className="max-w-2xl">
        <PrivacyControls />
      </div>
    </div>
  );
}

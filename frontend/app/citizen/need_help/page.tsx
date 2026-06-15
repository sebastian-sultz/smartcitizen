import { NeedHelpDirectory } from "@/features/public/need-help/components/NeedHelpDirectory";

export default function CitizenNeedHelpPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-text">Need Help Directory</h1>
        <p className="text-text-muted mt-1 text-[15px]">Connect with volunteer professionals willing to offer civic/expert assistance.</p>
      </div>
      <NeedHelpDirectory />
    </div>
  );
}

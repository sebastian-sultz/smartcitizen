import { NetworkUserList } from "@/features/admin/components/network/NetworkUserList";

export default function AdminNetworksPage() {
  return (
    <div className="space-y-0 sm:space-y-6 ">
      <div>
        <h1 className="text-2xl font-bold text-text">Referral Network Tree</h1>
        <p className="text-text-muted mt-1 text-[14px]">
          Auditing administrative referral networks, community invitation trees,
          and cumulative fundraising counts.
        </p>
      </div>
      <NetworkUserList />
    </div>
  );
}

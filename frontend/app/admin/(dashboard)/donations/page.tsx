import { DonationAuditCenter } from "@/features/admin/components/DonationAuditCenter";

export default function AdminDonationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Donation Audit Center</h1>
        <p className="text-text-muted mt-1 text-[14px]">
          Monitor global donations, check compliance details, and export official reports.
        </p>
      </div>
      <DonationAuditCenter />
    </div>
  );
}

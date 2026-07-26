import { NetworkUserDashboard } from "@/features/admin/components/network/NetworkUserDashboard";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function AdminNetworkUserPage({ params }: PageProps) {
  const { userId } = await params;

  return (
    <div className="space-y-6">
      <NetworkUserDashboard userId={userId} />
    </div>
  );
}

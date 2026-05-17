"use client";

import { useAdminStore } from "../store/useAdminStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";

export const CampaignsTable = () => {
  const { campaigns } = useAdminStore();

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Awareness Campaigns</CardTitle>
        <Button size="sm" onClick={() => alert("Open Create Campaign Modal")}>
          <Plus size={16} className="mr-2" />
          Create Campaign
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg/50">
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider rounded-tl-xl">Campaign ID</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Title</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Participants</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {campaigns.map((campaign) => (
                <tr key={campaign.id} className="hover:bg-bg/50 transition-colors">
                  <td className="p-4 text-[14px] font-mono text-text-muted">{campaign.id}</td>
                  <td className="p-4 text-[14px] font-bold text-text">{campaign.title}</td>
                  <td className="p-4 text-[14px] text-text-muted">{campaign.participants.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[12px] font-bold uppercase rounded-full tracking-wider ${
                      campaign.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

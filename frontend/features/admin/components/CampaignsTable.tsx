"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { TableComponent } from "@/components/ui/TableComponent";
import { campaignsColumns } from "./CampaignsColumns";

interface Campaign {
  id: string;
  title: string;
  participants: number;
  status: 'Active' | 'Ended';
}

const initialCampaigns: Campaign[] = [
  { id: 'CMP-1', title: 'Safe Internet for All', participants: 1250, status: 'Active' },
  { id: 'CMP-2', title: 'Know Your Rights', participants: 3400, status: 'Ended' },
];

export const CampaignsTable = () => {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Awareness Campaigns</CardTitle>
        <Button size="sm" variant="primary" startIcon={<Plus size={16} />} onClick={() => alert("Open Create Campaign Modal")}>
          Create Campaign
        </Button>
      </CardHeader>
      <CardContent>
        <TableComponent 
          headers={campaignsColumns} 
          data={initialCampaigns} 
          emptyMessage="No campaigns found" 
          className="shadow-none border-0" 
        />
      </CardContent>
    </Card>
  );
};

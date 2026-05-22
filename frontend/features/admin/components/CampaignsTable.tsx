"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { TableComponent } from "@/components/ui/TableComponent";
import { campaignsColumns } from "./CampaignsColumns";

import { useAlert } from "@/components/ui/AlertProvider";

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
  const { showAlert } = useAlert();
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CardTitle>Awareness Campaigns</CardTitle>
        <Button size="sm" variant="primary" startIcon={<Plus size={16} />} onClick={() => showAlert("Open Create Campaign Modal")} className="w-full sm:w-auto">
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

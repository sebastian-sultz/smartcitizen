"use client";

import { useAdminStore } from "../store/useAdminStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus } from "lucide-react";
import { TableComponent } from "@/components/ui/TableComponent";
import { campaignsColumns } from "./CampaignsColumns";

export const CampaignsTable = () => {
  const { campaigns } = useAdminStore();

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
          data={campaigns} 
          emptyMessage="No campaigns found" 
          className="shadow-none border-0" 
        />
      </CardContent>
    </Card>
  );
};

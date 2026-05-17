"use client";

import { useAdminStore } from "../store/useAdminStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { CheckCircle2 } from "lucide-react";
import { TableComponent } from "@/components/ui/TableComponent";
import { getModerationColumns } from "./ModerationColumns";

export const ModerationTable = () => {
  const { reports, resolveReport } = useAdminStore();

  const columns = getModerationColumns(resolveReport);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Abuse & Moderation</CardTitle>
      </CardHeader>
      <CardContent>
        <TableComponent 
          headers={columns} 
          data={reports} 
          emptyMessage="No moderation reports found" 
          className="shadow-none border-0" 
        />
      </CardContent>
    </Card>
  );
};

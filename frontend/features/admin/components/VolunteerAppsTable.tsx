"use client";

import { useAdminStore } from "../store/useAdminStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { CheckCircle2, XCircle } from "lucide-react";
import { TableComponent } from "@/components/ui/TableComponent";
import { getVolunteerAppsColumns } from "./VolunteerAppsColumns";

export const VolunteerAppsTable = () => {
  const { volunteerApps, updateVolunteerAppStatus } = useAdminStore();

  const columns = getVolunteerAppsColumns(updateVolunteerAppStatus);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Volunteer Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <TableComponent 
          headers={columns} 
          data={volunteerApps} 
          emptyMessage="No volunteer applications found" 
          className="shadow-none border-0" 
        />
      </CardContent>
    </Card>
  );
};

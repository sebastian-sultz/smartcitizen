"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TableComponent } from "@/components/ui/TableComponent";
import { getVolunteerAppsColumns } from "./VolunteerAppsColumns";

interface VolunteerApp {
  id: string;
  userId: string;
  name: string;
  profession: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  applyForRole: string;
}

const initialApps: VolunteerApp[] = [
  { id: 'APP-001', userId: 'GSC-1001', name: 'Rajesh Kumar', profession: 'IT Professional', status: 'Pending', appliedDate: '2026-05-10', applyForRole: 'None' },
  { id: 'APP-002', userId: 'GSC-1005', name: 'Suresh Patel', profession: 'Teacher', status: 'Pending', appliedDate: '2026-05-12', applyForRole: 'Block Coordinator' },
];

export const VolunteerAppsTable = () => {
  const [volunteerApps, setVolunteerApps] = useState<VolunteerApp[]>(initialApps);

  const updateVolunteerAppStatus = (id: string, status: 'Approved' | 'Rejected') => {
    setVolunteerApps(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

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

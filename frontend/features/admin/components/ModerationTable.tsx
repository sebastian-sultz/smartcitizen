"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { TableComponent } from "@/components/ui/TableComponent";
import { getModerationColumns } from "./ModerationColumns";

interface ModerationReport {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: string;
  status: 'Open' | 'Resolved';
  date: string;
}

const initialReports: ModerationReport[] = [
  { id: 'REP-1', reportedUserId: 'GSC-1004', reportedUserName: 'Priya Sharma', reason: 'Spam invites', status: 'Resolved', date: '2026-05-01' },
  { id: 'REP-2', reportedUserId: 'GSC-1006', reportedUserName: 'Amit Verma', reason: 'Inappropriate profile description', status: 'Open', date: '2026-05-16' },
];

export const ModerationTable = () => {
  const [reports, setReports] = useState<ModerationReport[]>(initialReports);

  const resolveReport = (id: string) => {
    setReports(prev => prev.map(r => r.id === id ? { ...r, status: 'Resolved' } : r));
  };

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

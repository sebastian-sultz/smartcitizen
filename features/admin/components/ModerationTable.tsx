"use client";

import { useAdminStore } from "../store/useAdminStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { CheckCircle2 } from "lucide-react";

export const ModerationTable = () => {
  const { reports, resolveReport } = useAdminStore();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Abuse & Moderation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg/50">
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider rounded-tl-xl">Report ID</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Reported User</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Reason</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Date</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider rounded-tr-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-bg/50 transition-colors">
                  <td className="p-4 text-[14px] font-mono text-text-muted">{report.id}</td>
                  <td className="p-4 text-[14px] font-bold text-text">
                    {report.reportedUserName}
                    <div className="text-[12px] text-text-muted font-normal font-mono mt-0.5">{report.reportedUserId}</div>
                  </td>
                  <td className="p-4 text-[14px] text-text-muted">{report.reason}</td>
                  <td className="p-4 text-[14px] text-text-muted">{report.date}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[12px] font-bold uppercase rounded-full tracking-wider ${
                      report.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {report.status === 'Open' && (
                      <button 
                        onClick={() => resolveReport(report.id)}
                        className="p-2 rounded-lg text-green-500 hover:bg-green-50 transition-colors"
                        title="Mark as Resolved"
                      >
                        <CheckCircle2 size={18} />
                      </button>
                    )}
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

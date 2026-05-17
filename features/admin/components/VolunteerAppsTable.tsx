"use client";

import { useAdminStore } from "../store/useAdminStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { CheckCircle2, XCircle } from "lucide-react";

export const VolunteerAppsTable = () => {
  const { volunteerApps, updateVolunteerAppStatus } = useAdminStore();

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Volunteer Applications</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg/50">
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider rounded-tl-xl">App ID</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Applicant</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Profession</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Applied Role</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Date</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider rounded-tr-xl text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {volunteerApps.map((app) => (
                <tr key={app.id} className="hover:bg-bg/50 transition-colors">
                  <td className="p-4 text-[14px] font-mono text-text-muted">{app.id}</td>
                  <td className="p-4 text-[14px] font-bold text-text">{app.name}</td>
                  <td className="p-4 text-[14px] text-text-muted">{app.profession}</td>
                  <td className="p-4 text-[14px] text-text-muted">{app.applyForRole !== 'None' ? app.applyForRole : 'Volunteer'}</td>
                  <td className="p-4 text-[14px] text-text-muted">{app.appliedDate}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[12px] font-bold uppercase rounded-full tracking-wider ${
                      app.status === 'Approved' ? 'bg-green-100 text-green-700' : 
                      app.status === 'Rejected' ? 'bg-red-100 text-red-700' : 
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {app.status === 'Pending' && (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => updateVolunteerAppStatus(app.id, 'Approved')}
                          className="p-2 rounded-lg text-green-500 hover:bg-green-50 transition-colors"
                          title="Approve"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button 
                          onClick={() => updateVolunteerAppStatus(app.id, 'Rejected')}
                          className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                          title="Reject"
                        >
                          <XCircle size={18} />
                        </button>
                      </div>
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

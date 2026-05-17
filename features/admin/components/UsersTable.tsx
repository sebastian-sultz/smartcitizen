"use client";

import { useState } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Search, MoreVertical, Edit2, Ban, CheckCircle2 } from "lucide-react";

export const UsersTable = () => {
  const { users, updateUserStatus, updateUserRole } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.mobile.includes(searchTerm)
  );

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Management</CardTitle>
        <div className="w-64">
          <Input 
            placeholder="Search users..." 
            icon={<Search size={18} />} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-bg/50">
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider rounded-tl-xl">GSC ID</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Name</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Mobile</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Role</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="p-4 text-[13px] font-bold text-text-muted uppercase tracking-wider rounded-tr-xl">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-bg/50 transition-colors">
                  <td className="p-4 text-[14px] font-mono text-text-muted">{user.id}</td>
                  <td className="p-4 text-[14px] font-bold text-text">{user.name}</td>
                  <td className="p-4 text-[14px] text-text-muted">{user.mobile}</td>
                  <td className="p-4">
                    <select 
                      className="text-[13px] border border-border rounded-lg px-2 py-1 bg-white"
                      value={user.role}
                      onChange={(e) => updateUserRole(user.id, e.target.value as any)}
                    >
                      <option value="Smart Citizen">Smart Citizen</option>
                      <option value="Volunteer">Volunteer</option>
                      <option value="Coordinator">Coordinator</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[12px] font-bold uppercase rounded-full tracking-wider ${
                      user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => updateUserStatus(user.id, user.status === 'Active' ? 'Suspended' : 'Active')}
                        className={`p-2 rounded-lg transition-colors ${
                          user.status === 'Active' ? 'text-red-500 hover:bg-red-50' : 'text-green-500 hover:bg-green-50'
                        }`}
                        title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
                      >
                        {user.status === 'Active' ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                      </button>
                    </div>
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

"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import { TableComponent } from "@/components/ui/TableComponent";
import { getUsersColumns } from "./UsersColumns";

interface User {
  id: string;
  name: string;
  mobile: string;
  role: 'Smart Citizen' | 'Volunteer' | 'Coordinator';
  status: 'Active' | 'Suspended';
  joinDate: string;
}

const initialUsers: User[] = [
  { id: 'GSC-1001', name: 'Rajesh Kumar', mobile: '9876543210', role: 'Smart Citizen', status: 'Active', joinDate: '2026-01-15' },
  { id: 'GSC-1002', name: 'Anita Desai', mobile: '9876543211', role: 'Volunteer', status: 'Active', joinDate: '2026-02-10' },
  { id: 'GSC-1003', name: 'Vikram Singh', mobile: '9876543212', role: 'Coordinator', status: 'Active', joinDate: '2026-03-05' },
  { id: 'GSC-1004', name: 'Priya Sharma', mobile: '9876543213', role: 'Smart Citizen', status: 'Suspended', joinDate: '2026-04-20' },
];

export const UsersTable = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const updateUserStatus = (id: string, status: 'Active' | 'Suspended') => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, status } : u));
  };

  const updateUserRole = (id: string, role: User['role']) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, role } : u));
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.mobile.includes(searchTerm)
  );

  const columns = getUsersColumns(updateUserRole, updateUserStatus);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CardTitle>User Management</CardTitle>
        <div className="w-full sm:w-64">
          <Input 
            placeholder="Search users..." 
            icon={<Search size={18} />} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <TableComponent 
          headers={columns} 
          data={filteredUsers} 
          emptyMessage="No users found matching search criteria" 
          className="shadow-none border-0" 
        />
      </CardContent>
    </Card>
  );
};

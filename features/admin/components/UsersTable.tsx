"use client";

import { useState } from "react";
import { useAdminStore } from "../store/useAdminStore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Search } from "lucide-react";
import { TableComponent } from "@/components/ui/TableComponent";
import { getUsersColumns } from "./UsersColumns";

export const UsersTable = () => {
  const { users, updateUserStatus, updateUserRole } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.mobile.includes(searchTerm)
  );

  const columns = getUsersColumns(updateUserRole, updateUserStatus);

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

import React from "react";
import { Header } from "@/components/ui/TableComponent";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Ban, CheckCircle2 } from "lucide-react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

export const getUsersColumns = (
  updateUserRole: (id: string, role: any) => void,
  updateUserStatus: (id: string, status: any) => void
): Header<any>[] => [
  {
    label: "GSC ID",
    render: (user) => <span className="text-[14px] font-mono text-text-muted">{user.id}</span>,
  },
  {
    label: "Name",
    render: (user) => <span className="text-[14px] font-bold text-text">{user.name}</span>,
  },
  {
    label: "Mobile",
    render: (user) => <span className="text-[14px] text-text-muted">{user.mobile}</span>,
  },
  {
    label: "Role",
    render: (user) => (
      <Select 
        value={user.role} 
        onValueChange={(val) => updateUserRole(user.id, val as any)}
      >
        <SelectTrigger className="w-36 h-8 py-1 px-2 text-[13px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Smart Citizen">Smart Citizen</SelectItem>
          <SelectItem value="Volunteer">Volunteer</SelectItem>
          <SelectItem value="Coordinator">Coordinator</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    label: "Status",
    render: (user) => (
      <Badge variant={user.status === 'Active' ? 'success' : 'danger'}>
        {user.status}
      </Badge>
    ),
  },
  {
    label: "Actions",
    render: (user) => (
      <div className="flex items-center gap-2">
        <Button 
          variant={user.status === 'Active' ? 'ghost-danger' : 'ghost-success'}
          size="icon"
          shape="square"
          onClick={() => updateUserStatus(user.id, user.status === 'Active' ? 'Suspended' : 'Active')}
          title={user.status === 'Active' ? 'Suspend User' : 'Activate User'}
        >
          {user.status === 'Active' ? <Ban size={16} /> : <CheckCircle2 size={16} />}
        </Button>
      </div>
    ),
  },
];

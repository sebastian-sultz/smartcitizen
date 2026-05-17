import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  mobile: string;
  role: 'Smart Citizen' | 'Volunteer' | 'Coordinator';
  status: 'Active' | 'Suspended';
  joinDate: string;
}

export interface VolunteerApp {
  id: string;
  userId: string;
  name: string;
  profession: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  appliedDate: string;
  applyForRole: string;
}

export interface Event {
  id: string;
  title: string;
  date: string;
  location: string;
  status: 'Upcoming' | 'Completed' | 'Cancelled';
}

export interface Campaign {
  id: string;
  title: string;
  participants: number;
  status: 'Active' | 'Ended';
}

export interface ModerationReport {
  id: string;
  reportedUserId: string;
  reportedUserName: string;
  reason: string;
  status: 'Open' | 'Resolved';
  date: string;
}

interface AdminStore {
  users: User[];
  volunteerApps: VolunteerApp[];
  events: Event[];
  campaigns: Campaign[];
  reports: ModerationReport[];
  
  // Actions
  updateUserStatus: (id: string, status: 'Active' | 'Suspended') => void;
  updateUserRole: (id: string, role: User['role']) => void;
  updateVolunteerAppStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  addEvent: (event: Event) => void;
  deleteEvent: (id: string) => void;
  resolveReport: (id: string) => void;
}

// Initial Mock Data
const initialUsers: User[] = [
  { id: 'GSC-1001', name: 'Rajesh Kumar', mobile: '9876543210', role: 'Smart Citizen', status: 'Active', joinDate: '2026-01-15' },
  { id: 'GSC-1002', name: 'Anita Desai', mobile: '9876543211', role: 'Volunteer', status: 'Active', joinDate: '2026-02-10' },
  { id: 'GSC-1003', name: 'Vikram Singh', mobile: '9876543212', role: 'Coordinator', status: 'Active', joinDate: '2026-03-05' },
  { id: 'GSC-1004', name: 'Priya Sharma', mobile: '9876543213', role: 'Smart Citizen', status: 'Suspended', joinDate: '2026-04-20' },
];

const initialApps: VolunteerApp[] = [
  { id: 'APP-001', userId: 'GSC-1001', name: 'Rajesh Kumar', profession: 'IT Professional', status: 'Pending', appliedDate: '2026-05-10', applyForRole: 'None' },
  { id: 'APP-002', userId: 'GSC-1005', name: 'Suresh Patel', profession: 'Teacher', status: 'Pending', appliedDate: '2026-05-12', applyForRole: 'Block Coordinator' },
];

const initialEvents: Event[] = [
  { id: 'EVT-1', title: 'Digital Literacy Camp', date: '2026-06-15', location: 'Delhi', status: 'Upcoming' },
  { id: 'EVT-2', title: 'Health Awareness Drive', date: '2026-06-22', location: 'Mumbai', status: 'Upcoming' },
];

const initialCampaigns: Campaign[] = [
  { id: 'CMP-1', title: 'Safe Internet for All', participants: 1250, status: 'Active' },
  { id: 'CMP-2', title: 'Know Your Rights', participants: 3400, status: 'Ended' },
];

const initialReports: ModerationReport[] = [
  { id: 'REP-1', reportedUserId: 'GSC-1004', reportedUserName: 'Priya Sharma', reason: 'Spam invites', status: 'Resolved', date: '2026-05-01' },
  { id: 'REP-2', reportedUserId: 'GSC-1006', reportedUserName: 'Amit Verma', reason: 'Inappropriate profile description', status: 'Open', date: '2026-05-16' },
];

export const useAdminStore = create<AdminStore>((set) => ({
  users: initialUsers,
  volunteerApps: initialApps,
  events: initialEvents,
  campaigns: initialCampaigns,
  reports: initialReports,

  updateUserStatus: (id, status) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, status } : u)
  })),
  
  updateUserRole: (id, role) => set((state) => ({
    users: state.users.map(u => u.id === id ? { ...u, role } : u)
  })),

  updateVolunteerAppStatus: (id, status) => set((state) => {
    // If approved, also update the user's role to Volunteer/Coordinator
    const app = state.volunteerApps.find(a => a.id === id);
    if (app && status === 'Approved') {
      const newRole = app.applyForRole !== 'None' ? 'Coordinator' : 'Volunteer';
      return {
        volunteerApps: state.volunteerApps.map(a => a.id === id ? { ...a, status } : a),
        users: state.users.map(u => u.id === app.userId ? { ...u, role: newRole } : u)
      };
    }
    return {
      volunteerApps: state.volunteerApps.map(a => a.id === id ? { ...a, status } : a)
    };
  }),

  addEvent: (event) => set((state) => ({
    events: [...state.events, event]
  })),

  deleteEvent: (id) => set((state) => ({
    events: state.events.filter(e => e.id !== id)
  })),

  resolveReport: (id) => set((state) => ({
    reports: state.reports.map(r => r.id === id ? { ...r, status: 'Resolved' } : r)
  }))
}));

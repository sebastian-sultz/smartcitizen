"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, 
  BookOpen, 
  HelpCircle, 
  Building2, 
  GraduationCap, 
  Activity, 
  Users, 
  HeartHandshake, 
  ChevronDown, 
  ChevronRight,
  Menu,
  X,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { title: "Home", href: "/admin", icon: <Home className="w-5 h-5" /> },
  {
    title: "Awareness Activities",
    icon: <BookOpen className="w-5 h-5" />,
    children: [
      { title: "Add Awareness Category", href: "/admin/awareness/category" },
      { title: "Add Designation", href: "/admin/awareness/designation" },
      { title: "Add Awareness Activity", href: "/admin/awareness/activity" },
      { title: "Add SC News", href: "/admin/awareness/news" },
      { title: "Awareness Images", href: "/admin/awareness/images" },
      { title: "Add Banner Image", href: "/admin/awareness/banner" },
      { title: "Add Popup Image", href: "/admin/awareness/popup" },
      { title: "Awareness Experts", href: "/admin/awareness/experts" },
      { title: "User KYC Details", href: "/admin/awareness/kyc" },
      { title: "Add Expert Category", href: "/admin/awareness/expert-category" },
      { title: "Global Citizen Verification", href: "/admin/awareness/verification" },
    ],
  },
  {
    title: "Help & Support",
    icon: <HelpCircle className="w-5 h-5" />,
    children: [
      { title: "User Message", href: "/admin/support/messages" },
      { title: "User Feedback", href: "/admin/support/feedback" },
      { title: "View Enquiry", href: "/admin/support/enquiries" },
    ],
  },
  {
    title: "Organization",
    icon: <Building2 className="w-5 h-5" />,
    children: [
      { title: "Add Organization", href: "/admin/organization/add" },
      { title: "Organization Details", href: "/admin/organization/details" },
      { title: "Add Role", href: "/admin/organization/role" },
      { title: "Add Staff", href: "/admin/organization/staff" },
      { title: "Manage Bank", href: "/admin/organization/bank" },
    ],
  },
  {
    title: "Quizzes",
    icon: <GraduationCap className="w-5 h-5" />,
    children: [
      { title: "Add Quiz Topic", href: "/admin/quizzes/topic" },
      { title: "Add Questions", href: "/admin/quizzes/questions" },
      { title: "Show Results", href: "/admin/quizzes/results" },
    ],
  },
  {
    title: "Smart Citizen Activity",
    icon: <Activity className="w-5 h-5" />,
    children: [
      { title: "Add Smart Citizen Activity", href: "/admin/activities/add" },
      { title: "Activity List", href: "/admin/activities/list" },
    ],
  },
  {
    title: "Smart Citizen Engagement",
    icon: <Users className="w-5 h-5" />,
    children: [
      { title: "Add Engagement", href: "/admin/engagement/add" },
      { title: "Engagement List", href: "/admin/engagement/list" },
    ],
  },
  {
    title: "Support Contribution",
    icon: <HeartHandshake className="w-5 h-5" />,
    children: [
      { title: "Add Payment Mode", href: "/admin/donations/payment-mode" },
      { title: "Donation Amount Master", href: "/admin/donations/amount-master" },
      { title: "Donors List", href: "/admin/donations/list" },
    ],
  },
];


export function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-md lg:hidden"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay */}
      {!isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(true)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen transition-transform bg-primary border-r border-white/10 text-white w-72",
          !isSidebarOpen && "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex flex-col h-full px-3 py-4 overflow-y-auto custom-scrollbar">
          <div className="flex items-center px-2 mb-8 mt-4">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center font-bold text-xl mr-3">
              G
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">GSCF Admin</h1>
              <p className="text-xs text-white/60">Modernized Panel</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map((item) => {
              const hasChildren = item.children && item.children.length > 0;
              const isOpen = openMenus.includes(item.title);
              const isActive = item.href === pathname;

              return (
                <div key={item.title}>
                  {hasChildren ? (
                    <button
                      onClick={() => toggleMenu(item.title)}
                      className={cn(
                        "flex items-center justify-between w-full p-3 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors group",
                        isOpen && "bg-white/5"
                      )}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 opacity-70 group-hover:opacity-100">{item.icon}</span>
                        {item.title}
                      </div>
                      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                  ) : (
                    <Link
                      href={item.href || "#"}
                      className={cn(
                        "flex items-center p-3 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors group",
                        isActive && "bg-accent text-white"
                      )}
                    >
                      <span className={cn("mr-3 opacity-70 group-hover:opacity-100", isActive && "opacity-100")}>
                        {item.icon}
                      </span>
                      {item.title}
                    </Link>
                  )}

                  {hasChildren && isOpen && (
                    <div className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-4">
                      {item.children?.map((child) => (
                        <Link
                          key={child.title}
                          href={child.href || "#"}
                          className={cn(
                            "flex items-center p-2 text-xs font-medium rounded-lg hover:bg-white/10 transition-colors",
                            pathname === child.href && "text-accent"
                          )}
                        >
                          {child.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="pt-4 mt-4 border-t border-white/10">
            <button 
              onClick={() => {
                // Mock logout
                window.location.href = "/admin/login";
              }}
              className="flex items-center w-full p-3 text-sm font-medium text-white/70 rounded-lg hover:bg-red-500/10 hover:text-red-400 transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

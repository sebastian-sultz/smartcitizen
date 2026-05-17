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
import { Button } from "@/components/ui/Button";

interface NavItem {
  title: string;
  href?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

const navItems: NavItem[] = [
  { title: "Dashboard Overview", href: "/admin", icon: <Home className="w-5 h-5" /> },
  { title: "User Management", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
  { title: "Volunteer Applications", href: "/admin/volunteers", icon: <HeartHandshake className="w-5 h-5" /> },
  { title: "Awareness Campaigns", href: "/admin/campaigns", icon: <BookOpen className="w-5 h-5" /> },
  { title: "Event Management", href: "/admin/events", icon: <Activity className="w-5 h-5" /> },
  { title: "Abuse & Moderation", href: "/admin/moderation", icon: <HelpCircle className="w-5 h-5" /> },
  {
    title: "Organization Setup",
    icon: <Building2 className="w-5 h-5" />,
    children: [
      { title: "Organization Details", href: "#" },
      { title: "Manage Staff", href: "#" },
      { title: "Bank Details", href: "#" },
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
      <Button
        variant="primary"
        size="icon"
        shape="square"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </Button>

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
                    <Button
                      variant="ghost-white"
                      shape="square"
                      fullWidth
                      normalCase
                      onClick={() => toggleMenu(item.title)}
                      className={cn(
                        "justify-between p-3 text-sm font-normal group h-auto",
                        isOpen && "bg-white/5"
                      )}
                    >
                      <div className="flex items-center">
                        <span className="mr-3 opacity-70 group-hover:opacity-100">{item.icon}</span>
                        {item.title}
                      </div>
                      {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </Button>
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
            <Button 
              variant="ghost-danger-white"
              shape="square"
              fullWidth
              alignLeft
              normalCase
              onClick={() => {
                // Mock logout
                window.location.href = "/admin/login";
              }}
              className="p-3 text-sm h-auto"
            >
              <LogOut className="w-5 h-5 mr-3 shrink-0" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
}

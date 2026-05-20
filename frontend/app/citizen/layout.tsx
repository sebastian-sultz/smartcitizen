"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Settings, UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

import { performLogout } from "@/lib/api-helpers";

export default function CitizenLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const handleLogout = () => performLogout('/member_login');

  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-border shrink-0 relative">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex flex-col">
            <span className="font-display font-black text-xl text-primary leading-none">GlobalSmart</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted opacity-60">Citizen Portal</span>
          </Link>
        </div>
        
        <nav className="p-4 space-y-1">
          <Link 
            href="/citizen" 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[14px] transition-colors",
              pathname === "/citizen" 
                ? "bg-primary/10 text-primary" 
                : "text-text-muted hover:bg-bg hover:text-text"
            )}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link 
            href="/citizen/settings" 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[14px] transition-colors",
              pathname === "/citizen/settings" 
                ? "bg-primary/10 text-primary" 
                : "text-text-muted hover:bg-bg hover:text-text"
            )}
          >
            <Settings size={18} />
            Privacy & Settings
          </Link>
          <Link 
            href="/volunteer/apply" 
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-[14px] transition-colors",
              pathname === "/volunteer/apply" 
                ? "bg-primary/10 text-primary" 
                : "text-text-muted hover:bg-bg hover:text-text"
            )}
          >
            <UserCircle size={18} />
            Volunteer Application
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-border bg-white">
          <Button 
            variant="ghost-danger" 
            fullWidth 
            alignLeft 
            normalCase 
            className="gap-3 px-4 py-3 text-[14px]"
            onClick={handleLogout}
          >
            <LogOut size={18} className="shrink-0" />
            Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 lg:p-12 overflow-y-auto pb-24 md:pb-12">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>

    </div>
  );
}

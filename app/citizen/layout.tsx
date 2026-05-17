import { ReactNode } from "react";
import Link from "next/link";
import { LayoutDashboard, Settings, UserCircle, LogOut } from "lucide-react";

export default function CitizenLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col md:flex-row">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-white border-r border-border shrink-0">
        <div className="p-6 border-b border-border">
          <Link href="/" className="flex flex-col">
            <span className="font-display font-black text-xl text-primary leading-none">GlobalSmart</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-text-muted opacity-60">Citizen Portal</span>
          </Link>
        </div>
        
        <nav className="p-4 space-y-1">
          <Link href="/citizen" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-primary/10 text-primary font-bold text-[14px]">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>
          <Link href="/citizen/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-bg hover:text-text font-bold text-[14px] transition-colors">
            <Settings size={18} />
            Privacy & Settings
          </Link>
          <Link href="/volunteer/apply" className="flex items-center gap-3 px-4 py-3 rounded-xl text-text-muted hover:bg-bg hover:text-text font-bold text-[14px] transition-colors">
            <UserCircle size={18} />
            Volunteer Application
          </Link>
        </nav>

        <div className="absolute bottom-0 w-full md:w-64 p-4 border-t border-border">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-500 hover:bg-red-50 font-bold text-[14px] transition-colors">
            <LogOut size={18} />
            Log Out
          </button>
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

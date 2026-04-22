import { Trophy } from "lucide-react";
import EmptyState from "@/components/ui/EmptyState";

export const LeaderboardHighlights = () => {
  return (
    <div className="mt-16">
    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="bg-bg rounded-[32px] overflow-hidden border border-border shadow-lg group">
        <div className="aspect-video relative overflow-hidden">
          <img src="/assets/s1.jpeg" alt="Volunteer Recognition" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-4 left-4 bg-accent text-white px-4 py-1 rounded-full text-[12px] font-bold">EVENT</div>
        </div>
        <div className="p-8 text-left space-y-3">
          <h3 className="font-display text-2xl font-bold text-text">Volunteer Recognition</h3>
          <p className="text-text-muted text-[15px]">Celebrating the dedicated citizens who drive our mission forward every day.</p>
        </div>
      </div>

      <div className="bg-bg rounded-[32px] overflow-hidden border border-border shadow-lg group">
        <div className="aspect-video relative overflow-hidden">
          <img src="/assets/q8.jpeg" alt="Community Sports" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute top-4 left-4 bg-primary text-white px-4 py-1 rounded-full text-[12px] font-bold">SPORTS</div>
        </div>
        <div className="p-8 text-left space-y-3">
          <h3 className="font-display text-2xl font-bold text-text">Battle of Champions</h3>
          <p className="text-text-muted text-[15px]">Youth engagement through community cricket tournaments promoting teamwork and unity.</p>
        </div>
      </div>
    </div>
    </div>
  );
};

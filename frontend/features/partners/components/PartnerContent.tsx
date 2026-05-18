import { User, AlertTriangle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

export const ExpertCard = ({ title, category, quote }: { title: string; category: string; quote: string }) => (
  <div className="bg-bg rounded-2xl p-8 border border-border text-center space-y-6 group hover:shadow-xl transition-all">
    <div className="w-24 h-24 rounded-full bg-white border border-border flex items-center justify-center mx-auto text-text-light group-hover:border-primary transition-colors">
      <User size={40} />
    </div>
    <div>
      <h3 className="font-display text-xl font-bold text-text">{title}</h3>
      <p className="text-accent text-[12px] font-bold uppercase tracking-widest mt-1">{category}</p>
    </div>
    <p className="text-text-muted text-[15px] italic">&quot;{quote}&quot;</p>
  </div>
);

export const PartnerDisclaimer = () => (
  <div className="max-w-4xl mx-auto">
    <div className="bg-amber-50 border-l-4 border-amber-500 p-8 rounded-r-xl space-y-4">
      <div className="flex items-center gap-3 text-amber-700">
        <AlertTriangle size={24} />
        <h4 className="font-bold text-lg uppercase tracking-wider">Disclaimer</h4>
      </div>
      <div className="text-[14px] text-amber-900/80 leading-relaxed space-y-3">
        <p>GlobalSmart Citizens Foundation provides guidance strictly for general awareness purposes.</p>
        <p>The Foundation does not provide professional, legal, medical, or financial advisory services.</p>
      </div>
    </div>
  </div>
);

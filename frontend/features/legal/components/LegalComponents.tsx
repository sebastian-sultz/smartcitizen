import PageHero from "@/components/layout/PageHero";
import { FileText, Download, ShieldCheck, Lock, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export const LegalDocGrid = ({ documents }: { documents: { name: string; route: string }[] }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {documents.map((doc, i) => (
      <div key={i} className="group bg-bg p-6 rounded-xl border border-border hover:border-primary hover:shadow-lg transition-all flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
            <FileText size={20} />
          </div>
          <span className="font-bold text-text text-[15px]">{doc.name}</span>
        </div>
        <a href={doc.route} className="p-2 text-text-light hover:text-primary transition-colors" title="Download">
          <Download size={20} />
        </a>
      </div>
    ))}
  </div>
);

export const PolicySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="space-y-6">
    <h2 className="font-display text-3xl font-bold text-text">{title}</h2>
    <div className="space-y-4 text-text-muted text-[16px] leading-relaxed">
      {children}
    </div>
  </div>
);

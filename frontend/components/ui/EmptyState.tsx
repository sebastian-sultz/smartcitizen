import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
}

export default function EmptyState({ icon: Icon, title, description, ctaText, ctaHref }: EmptyStateProps) {
  return (
    <div className="bg-white rounded-[40px] border-2 border-dashed border-border p-16 text-center space-y-6">
      <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto text-primary opacity-30">
        <Icon size={48} />
      </div>
      <div className="space-y-2">
        <h3 className="font-display text-2xl font-bold text-text-muted">{title}</h3>
        <p className="text-text-light max-w-sm mx-auto">{description}</p>
      </div>
      {ctaText && ctaHref && (
        <div className="pt-6">
          <Link href={ctaHref} className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-light transition-all inline-block">
            {ctaText}
          </Link>
        </div>
      )}
    </div>
  );
}

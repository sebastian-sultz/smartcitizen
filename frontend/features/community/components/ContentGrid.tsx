import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { LucideIcon } from "lucide-react";

interface ContentItem {
  id: string | number;
  title: string;
  desc: string;
  date?: string;
  location?: string;
  image?: string;
  category?: string;
}

interface ContentGridProps {
  items: ContentItem[];
  type: 'blog' | 'event' | 'activity';
  emptyIcon: LucideIcon;
  emptyTitle: string;
  emptyDesc: string;
}

export const ContentGrid = ({ items, type, emptyIcon, emptyTitle, emptyDesc }: ContentGridProps) => {
  if (items.length === 0) {
    return (
      <EmptyState 
        icon={emptyIcon}
        title={emptyTitle}
        description={emptyDesc}
        ctaText={type === 'event' ? "Join as Volunteer" : undefined}
        ctaHref={type === 'event' ? "/JoinUs" : undefined}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => (
        <Card key={item.id} className="group hover:shadow-2xl transition-all duration-500">
          {item.image && (
            <div className="aspect-video overflow-hidden relative">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              />
              {item.category && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary">
                  {item.category}
                </div>
              )}
            </div>
          )}
          <CardHeader className="space-y-4">
            <div className="flex flex-wrap gap-4 text-[13px] text-text-muted">
              {item.date && (
                <div className="flex items-center gap-1.5">
                  <Calendar size={14} className="text-primary" />
                  {item.date}
                </div>
              )}
              {item.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-primary" />
                  {item.location}
                </div>
              )}
            </div>
            <h3 className="font-display text-xl font-bold text-text group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-text-muted text-[15px] line-clamp-3 leading-relaxed">
              {item.desc}
            </p>
          </CardHeader>
          <CardContent>
            <Link href={`/${type}s/${item.id}`} className="flex items-center gap-2 text-[14px] font-bold text-primary group-hover:gap-3 transition-all">
              Read More
              <ArrowRight size={16} />
            </Link>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

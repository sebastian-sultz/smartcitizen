import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/Card";
import EmptyState from "@/components/ui/EmptyState";
import { LucideIcon } from "lucide-react";
import { EventRegisterButton } from "./EventRegisterButton";
import { formatDate } from "@/lib/utils";

interface ContentItem {
  id: string | number;
  event_name?: string;
  description?: string;
  event_date?: string;
  event_address?: string;
  image?: string | null;
  category?: string;

  // Fallback for blogs or custom types
  title?: string;
  desc?: string;
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
        ctaText={type === 'event' ? "Join as a Smart Citizen" : undefined}
        ctaHref={type === 'event' ? "/join_us" : undefined}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {items.map((item) => {
        const displayTitle = item.event_name || item.title || "";
        const displayDesc = item.description || item.desc || "";
        const displayDate = formatDate(item.event_date);
        const displayLocation = item.event_address;

        return (
          <Card key={item.id} className="group hover:shadow-2xl transition-all duration-500">
            {item.image && (
              <div className="aspect-video overflow-hidden relative">
                <Image 
                  src={item.image} 
                  alt={displayTitle} 
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                {item.category && (
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary z-10">
                    {item.category}
                  </div>
                )}
              </div>
            )}
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap gap-4 text-[13px] text-text-muted">
                {displayDate && (
                  <div className="flex items-center gap-1.5">
                    <Calendar size={14} className="text-primary" />
                    {displayDate}
                  </div>
                )}
                {displayLocation && (
                  <div className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-primary" />
                    {displayLocation}
                  </div>
                )}
              </div>
              <h3 className="font-display text-xl font-bold text-text group-hover:text-primary transition-colors">
                {displayTitle}
              </h3>
              <p className="text-text-muted text-[15px] line-clamp-3 leading-relaxed">
                {displayDesc}
              </p>
            </CardHeader>
            <CardContent>
              {type === 'event' ? (
                <EventRegisterButton />
              ) : (
                <Link href={`/${type}s/${item.id}`} className="flex items-center gap-2 text-[14px] font-bold text-primary group-hover:gap-3 transition-all">
                  Read More
                  <ArrowRight size={16} />
                </Link>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

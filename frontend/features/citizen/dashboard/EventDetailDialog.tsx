"use client";
 
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import {
  MapPin,
  CalendarDays,
  Phone,
  User as UserIcon,
  CheckCircle,
} from "lucide-react";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { EventResponse } from "../community/types";
import { cn } from "@/lib/utils";
 
interface EventDetailDialogProps {
  event: EventResponse;
  isRegistered: boolean;
  onRegister: (e: React.MouseEvent) => void;
  fullDate: string;
  timeStr: string;
}
 
export default function EventDetailDialog({
  event,
  isRegistered,
  onRegister,
  fullDate,
  timeStr,
}: EventDetailDialogProps) {
  return (
    <DialogContent size="lg" className="p-0 sm:p-0 overflow-hidden bg-surface border-border flex flex-col max-h-[90vh]">
      {/* Header Image */}
      <div className="relative w-full h-56 sm:h-64 bg-muted/50 shrink-0">
        {event.image ? (
          <Image
            src={event.image}
            alt={event.event_name}
            fill
            sizes="(max-width: 768px) 100vw, 600px"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
            <CalendarDays className="size-20 text-primary/40" />
          </div>
        )}
        {/* Overlay Category Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-block px-3 py-1 bg-surface/95 backdrop-blur-md text-primary text-xs font-black uppercase rounded-full tracking-wider shadow-sm border border-border/50">
            {event.category || "Community"}
          </span>
        </div>

        {/* Subtle gradient to ensure text/icons on top are visible if we had any, and blends with content below */}
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto p-6 space-y-6">
        <DialogHeader className="gap-2">
          <DialogTitle className="text-2xl sm:text-3xl font-black">
            {event.event_name}
          </DialogTitle>
          <DialogDescription className="hidden">
            Detailed view for {event.event_name}
          </DialogDescription>
        </DialogHeader>

        {/* Quick Info Grid */}
        <div className="grid grid-cols-1 gap-5 py-2">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
              <CalendarDays size={20} />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-text">{fullDate}</p>
              <p className="text-sm font-medium text-text-muted">{timeStr}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
              <MapPin size={20} />
            </div>
            <div className="space-y-0.5">
              <p className="text-sm font-semibold text-text leading-snug">
                {event.event_address}
              </p>
            </div>
          </div>

          {(event.organizer_name || event.organizer_phone) && (
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-xl text-primary shrink-0">
                <UserIcon size={20} />
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-text flex items-center gap-2">
                  {event.organizer_name}
                </p>
                {event.organizer_phone && (
                  <p className="text-sm font-medium text-text-muted flex items-center gap-1.5">
                    <Phone size={14} /> {event.organizer_phone}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* About Event */}
        {event.description && (
          <div className="space-y-3 pt-4 border-t border-border/40">
            <h3 className="text-lg font-bold text-text">About this event</h3>
            <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap font-medium">
              {event.description}
            </p>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <DialogFooter className="m-0 sm:m-0 rounded-none p-5 sm:px-8 sm:pb-8 bg-surface/80 backdrop-blur-md border-t border-border/50 shrink-0">
        <Button
          variant={isRegistered ? "outline" : "primary"}
          onClick={onRegister}
          disabled={isRegistered}
          fullWidth
          className={cn(
            "h-14 text-base transition-all duration-300 shadow-sm",
            isRegistered
              ? "border-green-200 text-green-700 bg-green-50 hover:bg-green-100 opacity-100"
              : "hover:shadow-md hover:-translate-y-0.5"
          )}
        >
          {isRegistered ? (
            <span className="flex items-center justify-center gap-2">
              <CheckCircle size={20} className="text-green-600 shrink-0" />
              You are registered
            </span>
          ) : (
            event.cta_text || "Register Now"
          )}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

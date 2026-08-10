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

interface InfoRowProps {
  icon: React.ComponentType<{ size: number; className?: string }>;
  title: string;
  subtitle?: React.ReactNode;
  titleTooltip?: string;
}

function InfoRow({ icon: Icon, title, subtitle, titleTooltip }: InfoRowProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-primary/5 border border-primary/10 text-primary flex items-center justify-center shrink-0 shadow-sm">
        <Icon size={14} className="stroke-[2.5]" />
      </div>
      <div className="space-y-0.5 min-w-0">
        <p className="text-xs sm:text-sm font-semibold text-text truncate" title={titleTooltip}>
          {title}
        </p>
        {subtitle && (
          <div className="text-[10px] text-text-muted leading-none">{subtitle}</div>
        )}
      </div>
    </div>
  );
}

export default function EventDetailDialog({
  event,
  isRegistered,
  onRegister,
  fullDate,
  timeStr,
}: EventDetailDialogProps) {
  return (
    <DialogContent size="lg" className="p-0 sm:p-0 gap-0 overflow-hidden bg-surface border-border flex flex-col max-h-[90vh] rounded-[28px] md:rounded-[32px]">
      {/* Header Image */}
      <div className="relative w-full h-44 sm:h-52 bg-muted/50 shrink-0">
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
            <CalendarDays className="size-12 text-primary/40" />
          </div>
        )}
        {/* Overlay Category Tag */}
        <div className="absolute top-4 left-4 z-10">
          <span className="inline-block px-3 py-1 bg-surface/95 backdrop-blur-md text-primary text-[9px] font-extrabold uppercase rounded-full tracking-wider shadow-sm border border-border/50">
            {event.category || "Community"}
          </span>
        </div>

        {/* Subtle gradient to ensure text/icons on top are visible if we had any, and blends with content below */}
        <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-surface to-transparent" />
      </div>

      {/* Scrollable Content */}
      <div className="flex-grow overflow-y-auto px-5 py-4.5 sm:p-6 space-y-4">
        <DialogHeader className="gap-0.5">
          <DialogTitle className="text-lg sm:text-xl font-bold tracking-tight text-text text-left">
            {event.event_name}
          </DialogTitle>
          <DialogDescription className="hidden">
            Detailed view for {event.event_name}
          </DialogDescription>
        </DialogHeader>

        {/* Quick Info Grid */}
        <div className="space-y-3 py-1">
          <InfoRow icon={CalendarDays} title={fullDate} subtitle={timeStr} />
          
          <InfoRow icon={MapPin} title={event.event_address} titleTooltip={event.event_address} />

          {(event.organizer_name || event.organizer_phone) && (
            <InfoRow
              icon={UserIcon}
              title={event.organizer_name || ""}
              subtitle={
                event.organizer_phone ? (
                  <span className="flex items-center gap-1 leading-none mt-0.5">
                    <Phone size={10} className="text-text-muted/70 shrink-0" />
                    {event.organizer_phone}
                  </span>
                ) : undefined
              }
            />
          )}
        </div>

        {/* About Event */}
        {event.description && (
          <div className="space-y-1.5 pt-3 border-t border-border/40">
            <h3 className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">About this event</h3>
            <p className="text-xs text-text-muted leading-relaxed whitespace-pre-wrap font-normal">
              {event.description}
            </p>
          </div>
        )}
      </div>

      {/* Sticky Footer */}
      <DialogFooter className="m-0 sm:m-0 rounded-none p-4 sm:px-6 sm:pb-6 bg-surface/85 backdrop-blur-md border-t border-border/40 shrink-0">
        <Button
          variant={isRegistered ? "outline" : "primary"}
          onClick={onRegister}
          disabled={isRegistered}
          fullWidth
          size="md"
          className={cn(
            "transition-all duration-300 shadow-sm",
            isRegistered
              ? "border-green-200 text-green-750 bg-green-50/70 hover:bg-green-105 opacity-100"
              : "hover:shadow-md hover:-translate-y-0.5"
          )}
        >
          {isRegistered ? (
            <span className="flex items-center justify-center gap-1.5">
              <CheckCircle size={14} className="text-green-600 shrink-0" />
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

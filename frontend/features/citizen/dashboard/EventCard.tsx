"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, Clock, CheckCircle, CalendarDays } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EventResponse } from "../community/types";
import EventDetailDialog from "./EventDetailDialog";

interface EventCardProps {
  event: EventResponse;
  isRegistered: boolean;
  onRegister: (eventId: string, title: string) => void;
}

export default function EventCard({ event, isRegistered, onRegister }: EventCardProps) {
  const [open, setOpen] = useState(false);

  const dateObj = new Date(event.event_date);
  const day = isNaN(dateObj.getTime()) ? "--" : dateObj.getDate().toString().padStart(2, "0");
  const month = isNaN(dateObj.getTime())
    ? "---"
    : dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase();
  const fullDate = isNaN(dateObj.getTime())
    ? "TBA"
    : dateObj.toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = isNaN(dateObj.getTime())
    ? "TBA"
    : dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

  const handleRegister = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRegister(event.id, event.event_name);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Card className="group border border-primary/5 hover:border-primary/20 hover:shadow-md transition-all duration-300 rounded-[32px] overflow-hidden bg-card flex flex-col h-full cursor-pointer outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 text-left">
          {/* Image Header */}
          <div className="relative w-full h-40 bg-muted/50 overflow-hidden shrink-0">
            {event.image ? (
              <Image
                src={event.image}
                alt={event.event_name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/30 flex items-center justify-center">
                <CalendarDays className="size-10 text-primary/40" />
              </div>
            )}
            {/* Floating Date Badge */}
            <div className="absolute top-4 left-4 flex flex-col items-center justify-center bg-surface/90 backdrop-blur-md rounded-2xl w-14 h-14 border border-border/50 shadow-sm shrink-0 select-none z-10">
              <span className="text-[9px] uppercase font-black text-text-muted tracking-wider leading-none">
                {month}
              </span>
              <span className="text-xl font-display font-black text-primary mt-1 leading-none">
                {day}
              </span>
            </div>
            {/* Category Tag */}
            <div className="absolute top-4 right-4 z-10">
              <span className="inline-block px-3 py-1 bg-surface/90 backdrop-blur-md text-primary text-[10px] font-extrabold uppercase rounded-full tracking-wider shadow-sm border border-border/50">
                {event.category || "Community"}
              </span>
            </div>
          </div>

          <CardContent className="p-6 flex flex-col flex-grow justify-between gap-6">
            <div className="space-y-3">
              <h4
                className="font-bold text-lg text-text leading-tight group-hover:text-primary transition-colors duration-200 line-clamp-2"
                title={event.event_name}
              >
                {event.event_name}
              </h4>

              <div className="space-y-2 text-sm text-text-muted font-medium pt-1">
                <p className="flex items-center gap-2 truncate">
                  <Clock size={16} className="text-primary/75 shrink-0" />
                  <span>{timeStr}</span>
                </p>
                <p className="flex items-center gap-2 truncate">
                  <MapPin size={16} className="text-primary/75 shrink-0" />
                  <span title={event.event_address}>{event.event_address}</span>
                </p>
              </div>

              {event.description && (
                <div className="pt-2">
                  <p className="text-sm text-text-muted line-clamp-2 leading-relaxed">
                    {event.description}
                  </p>
                  <span className="text-xs font-bold text-primary inline-flex items-center mt-1 group-hover:underline">
                    Read More
                  </span>
                </div>
              )}
            </div>

            <div className="w-full mt-auto pt-4">
              <Button
                variant={isRegistered ? "outline" : "primary"}
                onClick={handleRegister}
                disabled={isRegistered}
                fullWidth
                size="sm"
                className={cn(
                  "duration-200",
                  isRegistered && "border-green-200 text-green-700 bg-green-50/50 hover:bg-green-50 opacity-100"
                )}
              >
                {isRegistered ? (
                  <span className="flex items-center justify-center gap-1.5">
                    <CheckCircle size={16} className="text-green-600 shrink-0" />
                    Registered
                  </span>
                ) : (
                  event.cta_text || "Register for Event"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogTrigger>

      <EventDetailDialog
        event={event}
        isRegistered={isRegistered}
        onRegister={handleRegister}
        fullDate={fullDate}
        timeStr={timeStr}
      />
    </Dialog>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, MoveRight } from "lucide-react";
import { useAlert } from "@/components/ui/AlertProvider";
import {
  getAllEvents,
  registerForEvent,
  getEventsByUserId,
} from "../community/api";
import { EventResponse } from "../community/types";
import { useAuthStore } from "@/store/authStore";
import EmptyState from "@/components/ui/EmptyState";
import EventCard from "./EventCard";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import EventDetailDialog from "./EventDetailDialog";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export default function UpcomingEvents() {
  const { showAlert, showConfirm } = useAlert();
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const { session } = useAuthStore();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await getAllEvents();
        if (res && res.events) {
          // Display top 3 events statically on the dashboard
          setEvents(res.events.slice(0, 3));
        }

        if (session) {
          const registered = await getEventsByUserId("me");
          if (registered) {
            setRegisteredEvents(registered.map((r) => r.event_id));
          }
        }
      } catch (err) {
        console.error(
          "Failed to fetch events or registrations for dashboard:",
          err,
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [session]);

  const handleRegister = async (eventId: string, title: string) => {
    if (!session) {
      showConfirm({
        title: "Authentication Required",
        message: "You need to be logged in as a member to register for community events. Would you like to go to the login page now?",
        confirmText: "Go to Login",
        cancelText: "Cancel",
        type: "warning",
        onConfirm: () => {
          window.location.href = "/member_login";
        },
      });
      return;
    }

    try {
      await registerForEvent(eventId);
      setRegisteredEvents((prev) => [...prev, eventId]);
      showAlert({
        title: "Successfully Registered",
        message: `You are registered for ${title}! We have sent details to your registered number.`,
        type: "success",
      });
    } catch (err) {
      console.error("Failed to register for event:", err);
    }
  };

  if (loading) {
    return (
      <div id="upcoming-events" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-text">
            Upcoming Events
          </h3>
        </div>
        {/* Mobile Skeleton */}
        <div className="block sm:hidden">
          <Card shape="lg" className="p-4 space-y-4">
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-2xl" />
          </Card>
        </div>

        {/* Desktop Skeleton */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} shape="xl" className="border-primary/5 animate-pulse h-[26rem] flex flex-col overflow-hidden">
              {/* Image Skeleton */}
              <div className="h-40 w-full bg-muted/50 shrink-0" />
              <CardContent className="p-6 space-y-4 flex flex-col flex-grow justify-between">
                <div className="space-y-4">
                  <div className="h-6 w-3/4 bg-muted rounded-full" />
                  <div className="space-y-2">
                    <div className="h-4 w-1/2 bg-muted rounded" />
                    <div className="h-4 w-2/3 bg-muted rounded" />
                  </div>
                  <div className="space-y-2 pt-2">
                    <div className="h-3 w-full bg-muted rounded" />
                    <div className="h-3 w-4/5 bg-muted rounded" />
                  </div>
                </div>
                <div className="h-10 w-full bg-muted rounded-xl mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div id="upcoming-events" className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-lg font-bold text-text">
            Upcoming Events
          </h3>
        </div>
        <EmptyState
          icon={Calendar}
          title="No Upcoming Events"
          description="There are currently no community field drives or assemblies scheduled. Check back soon!"
        />
      </div>
    );
  }

  return (
    <div id="upcoming-events" className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg font-bold text-text">
          Upcoming Events
        </h3>
        <Button
          asChild
          variant="link"
          size="xs"
        >
          <Link href="/events" className="flex items-center gap-1">
            View All Events
            <MoveRight size={14} />
          </Link>
        </Button>
      </div>

      {/* Mobile view: Compact Event List */}
      <div className="block sm:hidden">
        <Card shape="lg" className="p-4 divide-y divide-border/60">
          {events.map((evt) => {
            const dateObj = new Date(evt.event_date);
            const day = isNaN(dateObj.getTime()) ? "--" : dateObj.getDate().toString();
            const month = isNaN(dateObj.getTime()) ? "---" : dateObj.toLocaleString("en-US", { month: "short" });
            const fullDate = isNaN(dateObj.getTime())
              ? "TBA"
              : dateObj.toLocaleString("en-US", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
            const timeStr = isNaN(dateObj.getTime())
              ? "TBA"
              : dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

            return (
              <Dialog key={evt.id}>
                <DialogTrigger asChild>
                  <div className="flex items-center justify-between gap-3 py-3 first:pt-1 last:pb-1 cursor-pointer active:bg-bg/50 transition-colors">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-primary/5 border border-primary/10 flex flex-col items-center justify-center shrink-0">
                        <span className="text-[9px] uppercase font-black text-primary leading-none">{month}</span>
                        <span className="text-sm font-display font-black text-primary mt-0.5 leading-none">{day}</span>
                      </div>
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="font-bold text-xs text-text truncate">
                          {evt.event_name}
                        </h4>
                        <p className="text-[10px] text-text-muted truncate leading-tight">
                          {evt.event_address}
                        </p>
                      </div>
                    </div>
                    
                    <div className="shrink-0 text-right">
                      <span className="text-[10px] font-bold px-2.5 py-1 bg-primary/5 text-primary rounded-full uppercase tracking-wider">
                        Details
                      </span>
                    </div>
                  </div>
                </DialogTrigger>
                <EventDetailDialog
                  event={evt}
                  isRegistered={registeredEvents.includes(evt.id)}
                  onRegister={(e) => {
                    e.stopPropagation();
                    handleRegister(evt.id, evt.event_name);
                  }}
                  fullDate={fullDate}
                  timeStr={timeStr}
                />
              </Dialog>
            );
          })}
        </Card>
      </div>

      {/* Desktop view: Event Grid */}
      <div className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-6">
        {events.map((evt) => (
          <EventCard
            key={evt.id}
            event={evt}
            isRegistered={registeredEvents.includes(evt.id)}
            onRegister={handleRegister}
          />
        ))}
      </div>
    </div>
  );
}

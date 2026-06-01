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

export default function UpcomingEvents() {
  const { showAlert } = useAlert();
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
      showAlert({
        title: "Authentication Required",
        message: "Please login to register for events.",
        type: "warning",
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="rounded-[32px] border-primary/5 shadow-sm animate-pulse h-[26rem] bg-card flex flex-col overflow-hidden">
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
          className="text-primary font-bold text-xs p-0 gap-1 hover:text-primary/80 transition-colors"
        >
          <Link href="/events" className="flex items-center gap-1">
            View All Events
            <MoveRight size={14} />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

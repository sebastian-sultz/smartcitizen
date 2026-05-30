"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, Clock, CheckCircle, Calendar, Info, MoveRight } from "lucide-react";
import { useAlert } from "@/components/ui/AlertProvider";
import {
  getAllEvents,
  registerForEvent,
  getEventsByUserId,
} from "../community/api";
import { EventResponse } from "../community/types";
import { Spinner } from "@/components/ui/spinner";
import { useAuthStore } from "@/store/authStore";

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
      <Card id="upcoming-events" className="rounded-[40px] border-primary/5 shadow-sm h-full flex flex-col justify-between overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-lg font-bold text-text">
              Upcoming Events
            </CardTitle>
            <Calendar size={18} className="text-primary/75" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex justify-center items-center py-12">
          <Spinner className="size-8 text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card id="upcoming-events" className="rounded-[40px] border-primary/5 shadow-sm h-full flex flex-col justify-between overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="font-display text-lg font-bold text-text">
              Upcoming Events
            </CardTitle>
            <Calendar size={18} className="text-primary/75" />
          </div>
        </CardHeader>
        <CardContent className="flex-grow flex flex-col items-center justify-center p-6 text-center">
          <Info className="size-8 text-text-muted/65 mb-2" />
          <p className="text-sm font-medium text-text-muted">No upcoming events scheduled.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card id="upcoming-events" className="rounded-[40px] border-primary/5 shadow-sm h-full flex flex-col justify-between overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg font-bold text-text">
            Upcoming Events
          </CardTitle>
          <Calendar size={18} className="text-primary/75" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-grow flex flex-col justify-between">
        <div className="space-y-4 flex-1">
          {events.map((evt) => {
            const isRegistered = registeredEvents.includes(evt.id);
            const dateObj = new Date(evt.event_date);
            const day = isNaN(dateObj.getTime()) ? "--" : dateObj.getDate().toString().padStart(2, "0");
            const month = isNaN(dateObj.getTime()) ? "---" : dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase();
            const timeStr = isNaN(dateObj.getTime())
              ? "TBA"
              : dateObj.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });

            return (
              <div
                key={evt.id}
                className="group p-4 bg-surface border border-border/40 rounded-[24px] flex flex-col gap-4 hover:border-primary/20 hover:shadow-sm transition-all duration-300"
              >
                <div className="flex gap-4 items-start">
                  {/* Date Block */}
                  <div className="flex flex-col items-center justify-center bg-bg-alt/40 rounded-2xl w-14 h-14 border border-border/20 shrink-0 select-none">
                    <span className="text-[9px] uppercase font-black text-text-muted tracking-wider leading-none">
                      {month}
                    </span>
                    <span className="text-xl font-display font-black text-primary mt-1 leading-none">
                      {day}
                    </span>
                  </div>

                  {/* Content Details */}
                  <div className="flex-grow min-w-0 space-y-1.5">
                    <span className="inline-block px-2 py-0.5 bg-primary/5 text-primary text-[9px] font-extrabold uppercase rounded-md tracking-wider">
                      {evt.category || "Community"}
                    </span>

                    <h4
                      className="font-bold text-sm text-text leading-snug truncate group-hover:text-primary transition-colors duration-200"
                      title={evt.event_name}
                    >
                      {evt.event_name}
                    </h4>

                    <div className="space-y-1 text-[11px] text-text-muted font-medium">
                      <p className="flex items-center gap-1.5 truncate">
                        <Clock size={12} className="text-primary/65 shrink-0" />
                        {timeStr}
                      </p>
                      <p className="flex items-center gap-1.5 truncate">
                        <MapPin
                          size={12}
                          className="text-primary/65 shrink-0"
                        />
                        {evt.event_address}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <div className="w-full">
                  <Button
                    variant={isRegistered ? "outline" : "primary"}
                    onClick={() => handleRegister(evt.id, evt.event_name)}
                    disabled={isRegistered}
                    className={`w-full text-xs font-bold py-2 h-9 rounded-xl transition-all duration-200 ${
                      isRegistered
                        ? "border-green-200 text-green-700 bg-green-50/50 hover:bg-green-50"
                        : ""
                    }`}
                  >
                    {isRegistered ? (
                      <span className="flex items-center justify-center gap-1.5">
                        <CheckCircle
                          size={14}
                          className="text-green-600 shrink-0"
                        />
                        Registered
                      </span>
                    ) : (
                      "Register"
                    )}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        {/* View All Events Button */}
        <div className="pt-4 border-t border-border/40 w-full mt-4">
          <Button
            asChild
            variant="outline"
            className="w-full rounded-xl py-2.5 h-auto text-xs font-bold border-border text-text hover:bg-bg"
          >
            <Link href="/events" className="flex items-center justify-center gap-1.5">
              View All Events
              <MoveRight size={14} />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

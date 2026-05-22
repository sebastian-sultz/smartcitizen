"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { MoveRight, Calendar, MapPin, Info } from "lucide-react";
import { getAllEvents } from "../api";
import { EventResponse } from "../types";
import EmptyState from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

const EventSkeleton = () => (
  <div className="border border-border/60 rounded-2xl p-6 bg-white space-y-4 animate-pulse">
    <div className="aspect-[16/10] bg-zinc-100 rounded-xl w-full" />
    <div className="space-y-3">
      <div className="h-4 bg-zinc-100 rounded-md w-1/4" />
      <div className="h-6 bg-zinc-100 rounded-md w-3/4" />
      <div className="h-4 bg-zinc-100 rounded-md w-full" />
      <div className="h-4 bg-zinc-100 rounded-md w-5/6" />
    </div>
    <div className="pt-4 border-t border-border/40 flex justify-between items-center">
      <div className="h-4 bg-zinc-100 rounded-md w-1/3" />
      <div className="h-4 bg-zinc-100 rounded-md w-1/4" />
    </div>
  </div>
);

export function UpcomingEvents() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetched = await getAllEvents();
        if (fetched) {
          setEvents(fetched);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).toUpperCase();
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <section className="py-12 md:py-16 bg-bg border-t border-border/50">
      <div className="max-content">
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 md:mb-10 gap-6">
          <div className="space-y-4 max-w-2xl">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-accent">
              UPCOMING EVENTS
            </span>
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text">
              Be Part of What&apos;s Coming
            </h2>
            <p className="text-text-muted text-[16px] max-w-xl">
              Join our interactive drives, awareness programs, and community initiatives to create a direct local impact.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="px-6 py-3 text-[15px] h-auto font-bold"
          >
            <Link
              href="/events"
              className="inline-flex items-center gap-2"
            >
              View All Events
              <MoveRight size={18} />
            </Link>
          </Button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <EventSkeleton />
            <EventSkeleton />
            <EventSkeleton />
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-3xl border border-border/50 p-12 shadow-card">
            <EmptyState
              icon={Info}
              title="No Upcoming Events Scheduled"
              description="We are currently organizing our upcoming workshops, drives, and sports activities. Please check back later or register to join as a volunteer."
              ctaText="Join as Volunteer"
              ctaHref="/join_us"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl overflow-hidden shadow-card border border-border/35 hover:shadow-xl transition-all duration-300 group flex flex-col"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-bg-alt">
                  <Image
                    src={event.image || "/assets/a1.png"}
                    alt={event.event_name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider shadow-md">
                    {event.category || "Community"}
                  </div>
                </div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-4 text-[13px] text-text-muted">
                      <div className="flex items-center gap-1.5 font-medium">
                        <Calendar size={14} className="text-primary" />
                        {formatDate(event.event_date)}
                      </div>
                      <div className="flex items-center gap-1.5 font-medium line-clamp-1 max-w-[200px]">
                        <MapPin size={14} className="text-primary shrink-0" />
                        <span className="truncate">{event.event_address}</span>
                      </div>
                    </div>
                    <h3 className="font-display text-xl font-bold text-text group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                      {event.event_name}
                    </h3>
                    <p className="text-text-muted text-[14px] leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-6 mt-6 border-t border-border/40 flex items-center justify-between">
                    {event.registration_link ? (
                      <a
                        href={event.registration_link}
                        target={event.registration_link.startsWith("http") ? "_blank" : undefined}
                        rel={event.registration_link.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="inline-flex items-center gap-2 font-black text-[14px] text-primary hover:text-primary-light transition-colors group/link"
                      >
                        {event.cta_text || "Register Now"}
                        <MoveRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                      </a>
                    ) : (
                      <Link
                        href={`/events`}
                        className="inline-flex items-center gap-2 font-black text-[14px] text-primary hover:text-primary-light transition-colors group/link"
                      >
                        {event.cta_text || "Learn More"}
                        <MoveRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                      </Link>
                    )}
                    <span className="text-[11px] text-text-light font-bold">
                      By {event.organizer_name || "GlobalSmart"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import { Info } from "lucide-react";
import { ContentGrid } from "./ContentGrid";
import { getAllEvents } from "../api";
import { EventResponse } from "../types";
import { Skeleton } from "@/components/ui/skeleton";

const EventSkeleton = () => (
  <div className="border border-border/60 rounded-3xl p-6 bg-white space-y-4">
    <Skeleton className="aspect-[16/10] rounded-2xl w-full" />
    <div className="space-y-3">
      <Skeleton className="h-4 w-1/4" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </div>
    <div className="pt-4 border-t border-border/40 flex justify-between items-center">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-4 w-1/4" />
    </div>
  </div>
);

export function EventsMain() {
  const [events, setEvents] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetched = await getAllEvents();
        if (fetched && fetched.length > 0) {
          setEvents(fetched);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen">
      <PageHero title="Events & Workshops" image="/assets/a1.png" />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-content">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text">WHAT&apos;S COMING</h2>
            <p className="text-text-muted text-[17px] leading-relaxed">
              Join our upcoming workshops, seminars, and community outreach programs.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <EventSkeleton />
              <EventSkeleton />
              <EventSkeleton />
            </div>
          ) : (
            <ContentGrid 
              items={events}
              type="event"
              emptyIcon={Info}
              emptyTitle="No Upcoming Events"
              emptyDesc="We are currently planning our next set of awareness workshops. Check back soon!"
            />
          )}
        </div>
      </section>
    </main>
  );
}

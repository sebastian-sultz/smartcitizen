"use client";

import { useEffect, useState } from "react";
import PageHero from "@/components/layout/PageHero";
import { Info } from "lucide-react";
import { ContentGrid } from "./ContentGrid";
import { getAllEvents, getEventsByUserId } from "../api";
import { EventResponse } from "../types";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/store/authStore";

const InitiativeSkeleton = () => (
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

export function InitiativesMain() {
  const [initiatives, setInitiatives] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);
  const { session } = useAuthStore();

  const fetchRegistrations = async () => {
    if (session) {
      try {
        const regs = await getEventsByUserId("me");
        if (regs) {
          setRegisteredEvents(regs.map((r) => r.event_id));
        }
      } catch (err) {
        console.error("Failed to fetch user registered events:", err);
      }
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const res = await getAllEvents("Initiative");
        if (res && res.events && res.events.length > 0) {
          setInitiatives(res.events);
        } else {
          setInitiatives([]);
        }
        await fetchRegistrations();
      } catch (err) {
        console.error("Failed to fetch community initiatives page data:", err);
        setInitiatives([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [session]);

  return (
    <main className="min-h-screen">
      <PageHero title="Our Initiatives" image="/assets/a3.png" />

      <section className="py-16 md:py-24 bg-white">
        <div className="max-content">
          <div className="max-w-3xl mx-auto text-center space-y-6 mb-20">
            <h2 className="font-display text-4xl md:text-5xl font-bold text-text">DRIVING IMPACT</h2>
            <p className="text-text-muted text-[17px] leading-relaxed">
              Explore our strategic initiatives aimed at building a smarter, more connected community.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <InitiativeSkeleton />
              <InitiativeSkeleton />
              <InitiativeSkeleton />
            </div>
          ) : (
            <ContentGrid 
              items={initiatives}
              type="event"
              emptyIcon={Info}
              emptyTitle="No Active Initiatives"
              emptyDesc="We are currently planning our next set of community initiatives. Check back soon!"
              registeredEventIds={registeredEvents}
              onRegisterSuccess={fetchRegistrations}
            />
          )}
        </div>
      </section>
    </main>
  );
}

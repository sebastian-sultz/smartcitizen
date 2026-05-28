"use client";

import { useEffect, useState } from "react";
import { Users } from "lucide-react";
import { ContentGrid } from "./ContentGrid";
import { getAllEvents } from "../api";
import { EventResponse } from "../types";

const ActivitySkeleton = () => (
  <div className="border border-border/60 rounded-[32px] p-6 bg-white space-y-4 animate-pulse">
    <div className="aspect-[16/10] bg-zinc-100 rounded-2xl w-full" />
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

export function CommunityActivities() {
  const [activities, setActivities] = useState<EventResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const fetched = await getAllEvents("Activity");
        if (fetched && fetched.length > 0) {
          setActivities(fetched);
        } else {
          setActivities([]);
        }
      } catch (err) {
        console.error("Failed to fetch community activities:", err);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ActivitySkeleton />
        <ActivitySkeleton />
        <ActivitySkeleton />
      </div>
    );
  }

  return (
    <ContentGrid 
      items={activities}
      type="event"
      emptyIcon={Users}
      emptyTitle="Activities Coming Soon"
      emptyDesc="We are currently organizing new community activities. Be the first to join our next event!"
    />
  );
}

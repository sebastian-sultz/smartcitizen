import { EventsMain } from "@/features/citizen/community";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upcoming Events & Workshops | GlobalSmart Citizens Foundation",
  description: "Explore and register for upcoming community awareness workshops, educational seminars, and social campaigns organized by GlobalSmart Citizens Foundation.",
};

export default function EventsPage() {
  return <EventsMain />;
}


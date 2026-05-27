"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, MapPin, Clock, CheckCircle } from "lucide-react";
import { useAlert } from "@/components/ui/AlertProvider";

interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  category: string;
}

export default function UpcomingEvents() {
  const { showAlert } = useAlert();
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  const events: Event[] = [
    {
      id: "evt_1",
      title: "Juhu Beach Cleanup Drive",
      date: "05 Jun 2026",
      time: "07:00 AM - 09:30 AM",
      location: "Juhu Beach, Mumbai",
      category: "Environment",
    },
    {
      id: "evt_2",
      title: "Tribal School Education Assembly",
      date: "14 Jun 2026",
      time: "10:30 AM - 01:30 PM",
      location: "Vada Center, Palghar",
      category: "Education",
    },
  ];

  const handleRegister = (eventId: string, title: string) => {
    if (registeredEvents.includes(eventId)) {
      setRegisteredEvents(registeredEvents.filter((id) => id !== eventId));
      showAlert({
        title: "Registration Cancelled",
        message: `Your registration for ${title} has been cancelled.`,
        type: "info",
      });
    } else {
      setRegisteredEvents([...registeredEvents, eventId]);
      showAlert({
        title: "Successfully Registered",
        message: `You are registered for ${title}! We have sent details to your registered number.`,
        type: "success",
      });
    }
  };

  return (
    <Card id="upcoming-events" className="rounded-[40px] border-primary/5 shadow-sm h-full flex flex-col justify-between">
      <CardHeader className="pb-4">
        <CardTitle className="font-display text-lg font-bold text-text">
          Upcoming Events
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {events.map((evt) => {
          const isRegistered = registeredEvents.includes(evt.id);
          return (
            <div 
              key={evt.id}
              className="p-4 bg-bg/40 border border-border/80 rounded-2xl flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
            >
              <div className="space-y-2">
                <div className="flex gap-2 items-center">
                  <span className="px-2.5 py-0.5 bg-primary/5 text-primary text-[10px] font-bold uppercase rounded-md tracking-wider">
                    {evt.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-text-muted font-bold">
                    <Calendar size={12} className="text-primary/70" />
                    {evt.date}
                  </span>
                </div>
                <h4 className="font-bold text-sm text-text">
                  {evt.title}
                </h4>
                <div className="space-y-1 text-[11px] text-text-muted font-medium">
                  <p className="flex items-center gap-1.5">
                    <Clock size={12} />
                    {evt.time}
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin size={12} />
                    {evt.location}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                <Button
                  variant={isRegistered ? "outline" : "primary"}
                  onClick={() => handleRegister(evt.id, evt.title)}
                  className={`text-xs font-bold px-4 py-2 h-auto rounded-xl w-full sm:w-auto gap-1.5 ${
                    isRegistered ? "border-green-200 text-green-700 hover:bg-green-50" : ""
                  }`}
                >
                  {isRegistered ? (
                    <>
                      <CheckCircle size={13} className="text-green-600" />
                      Going
                    </>
                  ) : (
                    "Register"
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

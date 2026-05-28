"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { MapPin, Clock, CheckCircle, Calendar } from "lucide-react";
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
    <Card id="upcoming-events" className="rounded-[40px] border-primary/5 shadow-sm h-full flex flex-col justify-between overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="font-display text-lg font-bold text-text">
            Upcoming Events
          </CardTitle>
          <Calendar size={18} className="text-primary/75" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 flex-1">
        {events.map((evt) => {
          const isRegistered = registeredEvents.includes(evt.id);
          const [day, month, year] = evt.date.split(" ");

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
                    {evt.category}
                  </span>
                  
                  <h4 className="font-bold text-sm text-text leading-snug truncate group-hover:text-primary transition-colors duration-200" title={evt.title}>
                    {evt.title}
                  </h4>

                  <div className="space-y-1 text-[11px] text-text-muted font-medium">
                    <p className="flex items-center gap-1.5 truncate">
                      <Clock size={12} className="text-primary/65 shrink-0" />
                      {evt.time}
                    </p>
                    <p className="flex items-center gap-1.5 truncate">
                      <MapPin size={12} className="text-primary/65 shrink-0" />
                      {evt.location}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="w-full">
                <Button
                  variant={isRegistered ? "outline" : "primary"}
                  onClick={() => handleRegister(evt.id, evt.title)}
                  className={`w-full text-xs font-bold py-2 h-9 rounded-xl transition-all duration-200 ${
                    isRegistered 
                      ? "border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800" 
                      : ""
                  }`}
                >
                  {isRegistered ? (
                    <span className="flex items-center justify-center gap-1.5">
                      <CheckCircle size={14} className="text-green-600 shrink-0" />
                      Going
                    </span>
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

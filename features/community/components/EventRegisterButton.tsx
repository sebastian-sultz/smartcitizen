"use client";

import { ArrowRight } from "lucide-react";

export const EventRegisterButton = () => {
  return (
    <button 
      onClick={() => alert("Redirecting to event registration...")}
      className="flex items-center gap-2 text-[14px] font-bold bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-all w-full justify-center"
    >
      Register for Event
      <ArrowRight size={16} />
    </button>
  );
};

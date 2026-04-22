"use client";

import { Phone, Mail, X } from "lucide-react";
import { useState } from "react";

export default function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-primary text-white text-[13px] h-10 flex items-center justify-between px-4 md:px-6 relative z-50">
      <div className="flex items-center gap-4 md:gap-6 overflow-hidden">
        <a href="tel:+918429696969" className="flex items-center gap-2 hover:text-accent-light transition-colors whitespace-nowrap">
          <Phone size={14} className="shrink-0" />
          <span className="font-bold">84 29 69 69 69</span>
        </a>
        <a href="mailto:globalsmartcitizensfoundation@gmail.com" className="hidden md:flex items-center gap-2 hover:text-accent-light transition-colors whitespace-nowrap">
          <Mail size={14} className="shrink-0" />
          <span>globalsmartcitizensfoundation@gmail.com</span>
        </a>
      </div>
      
      <div className="flex items-center gap-4">
        <span className="font-semibold hidden lg:inline">12A & 80G Certified NGO</span>
        <button 
          onClick={() => setIsVisible(false)}
          className="p-1 hover:bg-white/10 rounded-full transition-colors"
          aria-label="Dismiss announcement"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}

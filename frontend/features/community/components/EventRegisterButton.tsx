"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const EventRegisterButton = () => {
  return (
    <Button 
      variant="primary"
      endIcon={<ArrowRight size={16} />}
      onClick={() => alert("Redirecting to event registration...")}
      className="w-full"
    >
      Register for Event
    </Button>
  );
};

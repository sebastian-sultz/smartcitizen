"use client";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAlert } from "@/components/ui/AlertProvider";

export const EventRegisterButton = () => {
  const { showAlert } = useAlert();
  return (
    <Button 
      variant="primary"
      endIcon={<ArrowRight size={16} />}
      onClick={() => showAlert("Redirecting to event registration...")}
      className="w-full"
    >
      Register for Event
    </Button>
  );
};

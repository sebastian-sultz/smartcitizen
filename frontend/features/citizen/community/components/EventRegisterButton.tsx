"use client";

import React, { useState } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAlert } from "@/components/ui/AlertProvider";
import { registerForEvent } from "../api";
import { useAuthStore } from "@/store/authStore";

interface EventRegisterButtonProps {
  eventId: string;
  isRegistered: boolean;
  onRegisterSuccess?: () => void;
}

export const EventRegisterButton: React.FC<EventRegisterButtonProps> = ({
  eventId,
  isRegistered,
  onRegisterSuccess,
}) => {
  const { showAlert, showConfirm } = useAlert();
  const { session } = useAuthStore();
  const [loading, setLoading] = useState(false);
 
  const handleRegister = async () => {
    if (!session) {
      showConfirm({
        title: "Authentication Required",
        message: "You need to be logged in as a member to register for community events. Would you like to go to the login page now?",
        confirmText: "Go to Login",
        cancelText: "Cancel",
        type: "warning",
        onConfirm: () => {
          window.location.href = "/member_login";
        },
      });
      return;
    }

    try {
      setLoading(true);
      await registerForEvent(eventId);
      showAlert({
        title: "Successfully Registered",
        message: "You have successfully registered for this event!",
        type: "success",
      });
      if (onRegisterSuccess) {
        onRegisterSuccess();
      }
    } catch (err) {
      console.error("Failed to register for event:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant={isRegistered ? "outline" : "primary"}
      endIcon={isRegistered ? undefined : <ArrowRight size={16} />}
      onClick={handleRegister}
      disabled={isRegistered || loading}
      isLoading={loading}
      className={`w-full font-bold transition-all duration-200 ${
        isRegistered
          ? "border-green-200 text-green-700 bg-green-50/50 hover:bg-green-50"
          : ""
      }`}
    >
      {isRegistered ? (
        <span className="flex items-center justify-center gap-1.5">
          <CheckCircle size={14} className="text-green-600 shrink-0" />
          Registered
        </span>
      ) : (
        "Register for Event"
      )}
    </Button>
  );
};


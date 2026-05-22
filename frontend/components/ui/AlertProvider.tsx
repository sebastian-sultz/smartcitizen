"use client";

import React, { createContext, useContext, useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Info, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

interface AlertOptions {
  title?: string;
  message: string;
  buttonText?: string;
  type?: "info" | "success" | "warning" | "error";
  onClose?: () => void;
}

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: "info" | "success" | "warning" | "error";
  onConfirm: () => void;
  onCancel?: () => void;
}

interface AlertContextType {
  showAlert: (options: AlertOptions | string) => void;
  showConfirm: (options: ConfirmOptions) => void;
}

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [isConfirm, setIsConfirm] = useState(false);
  const [options, setOptions] = useState<{
    title?: string;
    message: string;
    buttonText?: string;
    confirmText?: string;
    cancelText?: string;
    type?: "info" | "success" | "warning" | "error";
    onClose?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({ message: "" });

  const showAlert = (opts: AlertOptions | string) => {
    setIsConfirm(false);
    if (typeof opts === "string") {
      setOptions({ 
        message: opts, 
        title: "Notification",
        buttonText: "Dismiss",
        type: "info"
      });
    } else {
      setOptions({
        title: opts.title || "Notification",
        message: opts.message,
        buttonText: opts.buttonText || "Dismiss",
        type: opts.type || "info",
        onClose: opts.onClose,
      });
    }
    setOpen(true);
  };

  const showConfirm = (opts: ConfirmOptions) => {
    setIsConfirm(true);
    setOptions({
      title: opts.title || "Confirm",
      message: opts.message,
      confirmText: opts.confirmText || "Confirm",
      cancelText: opts.cancelText || "Cancel",
      type: opts.type || "warning",
      onConfirm: opts.onConfirm,
      onCancel: opts.onCancel,
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    if (isConfirm) {
      if (options.onCancel) {
        options.onCancel();
      }
    } else {
      if (options.onClose) {
        options.onClose();
      }
    }
  };

  const handleConfirm = () => {
    setOpen(false);
    if (options.onConfirm) {
      options.onConfirm();
    }
  };

  const getIcon = () => {
    switch (options.type) {
      case "success":
        return <CheckCircle2 className="size-10 text-success shrink-0" />;
      case "warning":
        return <AlertTriangle className="size-10 text-accent shrink-0" />;
      case "error":
        return <XCircle className="size-10 text-danger shrink-0" />;
      case "info":
      default:
        return <Info className="size-10 text-primary shrink-0" />;
    }
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
          handleClose();
        }
      }}>
        <DialogContent className="max-w-[400px] p-6 sm:p-6 text-center flex flex-col items-center gap-0">
          <div className="mb-4">
            {getIcon()}
          </div>
          <DialogHeader className="space-y-2 mb-6">
            <DialogTitle className="text-xl font-bold tracking-tight text-text text-center">
              {options.title}
            </DialogTitle>
            <DialogDescription className="text-[14px] text-text-light text-center leading-relaxed whitespace-pre-line">
              {options.message}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="w-full mt-2 -mx-0 -mb-0 p-0 bg-transparent border-t-0 flex flex-row justify-center gap-3">
            {isConfirm ? (
              <>
                <Button 
                  onClick={handleClose} 
                  variant="secondary" 
                  className="w-full sm:w-auto px-6"
                >
                  {options.cancelText}
                </Button>
                <Button 
                  onClick={handleConfirm} 
                  variant={options.type === "error" ? "danger" : "primary"}
                  className="w-full sm:w-auto px-6"
                >
                  {options.confirmText}
                </Button>
              </>
            ) : (
              <Button 
                onClick={handleClose} 
                variant="primary" 
                className="w-full sm:w-auto px-8"
              >
                {options.buttonText}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error("useAlert must be used within an AlertProvider");
  }
  return context;
};

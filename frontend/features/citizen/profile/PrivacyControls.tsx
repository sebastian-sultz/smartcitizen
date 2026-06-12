"use client";

import { useState } from "react";
import { Shield, EyeOff, Trash2, Eye } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAlert } from "@/components/ui/AlertProvider";
import { Switch } from "@/components/ui/switch";

export const PrivacyControls = () => {
  const { showAlert, showConfirm } = useAlert();
  const [inDirectory, setInDirectory] = useState(true);

  return (
    <div className="space-y-6">
      <Card className="rounded-[40px] border-primary/5 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-display font-bold text-text">
            <Shield className="text-primary" size={20} />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start justify-between gap-4 p-5 rounded-[24px] border border-border bg-bg/50">
            <div>
              <h4 className="font-bold text-text flex items-center gap-2">
                {inDirectory ? (
                  <Eye size={16} className="text-primary" />
                ) : (
                  <EyeOff size={16} className="text-primary" />
                )}
                Directory Visibility
              </h4>
              <p className="text-[13px] text-text-muted mt-1 leading-relaxed font-medium">
                List your profile in the public Need Help directory. Disabling
                this will hide your profile from all public searches.
              </p>
            </div>
            <div className="mt-2 shrink-0">
              <Switch checked={inDirectory} onCheckedChange={setInDirectory} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[40px] border-red-100 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-display font-bold text-red-600">
            <Trash2 size={20} />
            Data Deletion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[14px] text-text-muted mb-6 leading-relaxed font-medium">
            Under data protection guidelines, you have the right to request the
            deletion of all your personal data from the Global Smart Citizen
            Foundation systems.
          </p>
          <Button
            variant="ghost-danger"
            size="sm"
            className="border border-red-200"
            onClick={() => {
              showConfirm({
                title: "Delete Profile",
                message:
                  "Are you sure you want to request data deletion? This action cannot be undone and you will lose access to the Smart Citizen network.",
                confirmText: "Delete",
                cancelText: "Cancel",
                type: "error",
                onConfirm: () => {
                  showAlert({
                    title: "Deletion Requested",
                    message:
                      "Data deletion request submitted to administrators.",
                    type: "success",
                  });
                },
              });
            }}
          >
            Request Profile Deletion
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

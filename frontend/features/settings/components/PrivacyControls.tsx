"use client";

import { useState } from "react";
import { Shield, EyeOff, Trash2, Smartphone, Eye } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { useAlert } from "@/components/ui/AlertProvider";

export const PrivacyControls = () => {
  const { showAlert, showConfirm } = useAlert();
  const [showPhone, setShowPhone] = useState(false);
  const [inDirectory, setInDirectory] = useState(true);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl">
            <Shield className="text-primary" size={20} />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          
          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border bg-bg/50">
            <div>
              <h4 className="font-bold text-text flex items-center gap-2">
                <Smartphone size={16} />
                Public Phone Number
              </h4>
              <p className="text-[13px] text-text-muted mt-1">
                Allow citizens to see your phone number in the Need Help directory. If disabled, they can only contact you via in-app requests.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-2 shrink-0">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={showPhone}
                onChange={() => setShowPhone(!showPhone)}
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

          <div className="flex items-start justify-between gap-4 p-4 rounded-xl border border-border bg-bg/50">
            <div>
              <h4 className="font-bold text-text flex items-center gap-2">
                {inDirectory ? <Eye size={16} /> : <EyeOff size={16} />}
                Directory Visibility
              </h4>
              <p className="text-[13px] text-text-muted mt-1">
                List your profile in the public Need Help directory. Disabling this will hide your profile from all public searches.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer mt-2 shrink-0">
              <input 
                type="checkbox" 
                className="sr-only peer" 
                checked={inDirectory}
                onChange={() => setInDirectory(!inDirectory)}
              />
              <div className="w-11 h-6 bg-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>

        </CardContent>
      </Card>

      <Card className="border-red-100 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl text-red-600">
            <Trash2 size={20} />
            Data Deletion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-[14px] text-text-muted mb-4">
            Under data protection guidelines, you have the right to request the deletion of all your personal data from the Global Smart Citizen Foundation systems.
          </p>
          <Button 
            variant="outline" 
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
            onClick={() => {
              showConfirm({
                title: "Delete Profile",
                message: "Are you sure you want to request data deletion? This action cannot be undone and you will lose access to the Smart Citizen network.",
                confirmText: "Delete",
                cancelText: "Cancel",
                type: "error",
                onConfirm: () => {
                  showAlert({
                    title: "Deletion Requested",
                    message: "Data deletion request submitted to administrators.",
                    type: "success"
                  });
                }
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

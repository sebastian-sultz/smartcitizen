"use client";

import { User, Activity, Share2, Heart, Award, Bell, Shield } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

import { useAlert } from "@/components/ui/AlertProvider";

export const CitizenDashboard = () => {
  const { showAlert } = useAlert();

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://gscf.org/invite/GSC-849201");
    showAlert({
      title: "Link Copied",
      message: "Your unique invite link has been copied to your clipboard!",
      type: "success",
    });
  };

  return (
    <div className="space-y-8">
      
      {/* Profile & Stats Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Profile Card */}
        <Card className="lg:col-span-1 shadow-card border-primary/10 overflow-hidden relative">
          <div className="absolute top-0 inset-x-0 h-24 bg-primary/10" />
          <CardContent className="pt-12 text-center relative z-10">
            <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-lg mx-auto flex items-center justify-center text-primary mb-4 overflow-hidden">
              <User size={40} className="opacity-20" />
            </div>
            <h2 className="font-display text-2xl font-bold text-text">Rajesh Kumar</h2>
            <p className="text-primary font-bold tracking-widest mt-1">GSC-849201</p>
            <div className="mt-4 flex items-center justify-center gap-2">
              <span className="px-3 py-1 bg-green-100 text-green-700 text-[12px] font-bold uppercase rounded-full tracking-wider">Active</span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 text-[12px] font-bold uppercase rounded-full tracking-wider">Smart Citizen</span>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-none shadow-sm flex flex-col justify-center items-center p-6 text-center">
            <Share2 className="text-blue-500 mb-2" size={24} />
            <span className="text-3xl font-display font-bold text-blue-900">12</span>
            <span className="text-[12px] text-blue-700/80 font-bold uppercase tracking-wider mt-1">Invited</span>
          </Card>
          <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-none shadow-sm flex flex-col justify-center items-center p-6 text-center">
            <Activity className="text-green-500 mb-2" size={24} />
            <span className="text-3xl font-display font-bold text-green-900">3</span>
            <span className="text-[12px] text-green-700/80 font-bold uppercase tracking-wider mt-1">Campaigns</span>
          </Card>
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100/50 border-none shadow-sm flex flex-col justify-center items-center p-6 text-center">
            <Award className="text-purple-500 mb-2" size={24} />
            <span className="text-3xl font-display font-bold text-purple-900">Lvl 2</span>
            <span className="text-[12px] text-purple-700/80 font-bold uppercase tracking-wider mt-1">Badge</span>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100/50 border-none shadow-sm flex flex-col justify-center items-center p-6 text-center">
            <Heart className="text-orange-500 mb-2" size={24} />
            <span className="text-3xl font-display font-bold text-orange-900">₹500</span>
            <span className="text-[12px] text-orange-700/80 font-bold uppercase tracking-wider mt-1">Donated</span>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Invite Link System */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Share2 className="text-primary" size={20} />
              Grow the Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[14px] text-text-muted mb-4">
              Share your unique invite link with friends and family. When they register using your link, they join your network!
            </p>
            <div className="flex gap-2">
              <div className="flex-1 bg-bg p-3 rounded-xl border border-border text-[14px] font-mono text-text-muted truncate">
                https://gscf.org/invite/GSC-849201
              </div>
              <Button onClick={handleCopyLink}>Copy Link</Button>
            </div>
            
            <div className="mt-6 bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3">
              <Shield className="text-blue-500 shrink-0" size={20} />
              <div className="text-[13px] text-blue-900/80">
                <span className="font-bold">Volunteer Eligibility:</span> Invite 10 more citizens to unlock the ability to apply for a District Coordinator role.
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Notifications */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Bell className="text-primary" size={20} />
              Recent Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 pb-4 border-b border-border">
              <div className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
              <div>
                <p className="text-[14px] text-text font-medium">Welcome to Global Smart Citizen Foundation!</p>
                <p className="text-[12px] text-text-muted mt-1">2 days ago</p>
              </div>
            </div>
            <div className="flex gap-3 pb-4 border-b border-border">
              <div className="w-2 h-2 rounded-full bg-border mt-2 shrink-0" />
              <div>
                <p className="text-[14px] text-text font-medium">New Awareness Campaign in your city.</p>
                <p className="text-[12px] text-text-muted mt-1">1 week ago</p>
              </div>
            </div>
            <Button variant="outline" className="w-full text-text-muted border-dashed mt-2">
              View All Notifications
            </Button>
          </CardContent>
        </Card>
      </div>

    </div>
  );
};
